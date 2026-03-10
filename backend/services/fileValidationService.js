const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const logger = require('../config/logger');

const s3Client = new S3Client({
    endpoint: process.env.SCALEWAY_ENDPOINT,
    region: process.env.SCALEWAY_REGION,
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
    }
});

const readStreamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
};

const getHeadBufferFromS3 = async (key, maxBytes = 8192) => {
    const command = new GetObjectCommand({
        Bucket: process.env.SCALEWAY_BUCKET_NAME,
        Key: key,
        Range: `bytes=0-${maxBytes - 1}`
    });

    const response = await s3Client.send(command);
    if (!response.Body) {
        throw new Error(`Impossible de lire le fichier S3: ${key}`);
    }

    return readStreamToBuffer(response.Body);
};

const getExtension = (filename = '') => {
    const extension = path.extname(filename).toLowerCase();
    return extension.startsWith('.') ? extension.slice(1) : extension;
};

const isJpeg = (buffer) => buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff;

const isPng = (buffer) => buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;

const isWebp = (buffer) => buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP';

const isAvi = (buffer) => buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'AVI ';

const isMkv = (buffer) => buffer.length >= 4
    && buffer[0] === 0x1a
    && buffer[1] === 0x45
    && buffer[2] === 0xdf
    && buffer[3] === 0xa3;

const readFtypBrand = (buffer) => {
    if (buffer.length < 12) return null;
    const box = buffer.subarray(4, 8).toString('ascii');
    if (box !== 'ftyp') return null;
    return buffer.subarray(8, 12).toString('ascii');
};

const hasLikelyTextContent = (buffer) => {
    if (!buffer || buffer.length === 0) return false;

    let controlChars = 0;
    for (const byte of buffer) {
        const isAllowedControl = byte === 9 || byte === 10 || byte === 13;
        const isPrintableAscii = byte >= 32 && byte <= 126;
        if (!isAllowedControl && !isPrintableAscii && byte < 160) {
            controlChars += 1;
        }
    }

    return controlChars / buffer.length < 0.05;
};

const validateTextSubtitle = (extension, buffer) => {
    if (!hasLikelyTextContent(buffer)) {
        return false;
    }

    const text = buffer.toString('utf8').replace(/^\uFEFF/, '');

    if (extension === 'vtt') {
        return /^WEBVTT\b/i.test(text.trimStart());
    }

    if (extension === 'srt') {
        return /(\d+\s*\r?\n)?\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(text);
    }

    return true; // txt
};

const validateSignatureByExtension = (extension, buffer) => {
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return isJpeg(buffer);
        case 'png':
            return isPng(buffer);
        case 'webp':
            return isWebp(buffer);
        case 'avi':
            return isAvi(buffer);
        case 'mkv':
            return isMkv(buffer);
        case 'mp4': {
            const brand = readFtypBrand(buffer);
            return !!brand && brand !== 'qt  ';
        }
        case 'mov': {
            const brand = readFtypBrand(buffer);
            return brand === 'qt  ';
        }
        case 'srt':
        case 'vtt':
        case 'txt':
            return validateTextSubtitle(extension, buffer);
        default:
            return false;
    }
};

const FIELD_CONFIG = {
    video_file: { allowed: new Set(['mp4', 'mov', 'avi', 'mkv']) },
    poster_file: { allowed: new Set(['jpg', 'jpeg', 'png', 'webp']) },
    gallery_files: { allowed: new Set(['jpg', 'jpeg', 'png', 'webp']) },
    subtitle_file: { allowed: new Set(['srt', 'vtt', 'txt']) },
    avatar: { allowed: new Set(['jpg', 'jpeg', 'png', 'webp']) }
};

const flattenRequestFiles = (filesByField = {}) => Object.entries(filesByField)
    .flatMap(([fieldName, files]) => (files || []).map((file) => ({ fieldName, file })));

const validateUploadedFilesBySignature = async (filesByField = {}) => {
    const allFiles = flattenRequestFiles(filesByField);

    for (const { fieldName, file } of allFiles) {
        const config = FIELD_CONFIG[fieldName];
        if (!config) {
            return { ok: false, message: `Champ fichier non autorise: ${fieldName}` };
        }

        const extension = getExtension(file.originalname);
        if (!config.allowed.has(extension)) {
            return {
                ok: false,
                field: fieldName,
                message: `Extension invalide pour ${fieldName}: .${extension || 'inconnue'}`
            };
        }

        const headBuffer = await getHeadBufferFromS3(file.key);
        const signatureIsValid = validateSignatureByExtension(extension, headBuffer);

        if (!signatureIsValid) {
            return {
                ok: false,
                field: fieldName,
                message: `Le contenu du fichier ne correspond pas a son type declare (${file.originalname}).`
            };
        }
    }

    return { ok: true };
};

const cleanupUploadedFiles = async (filesByField = {}) => {
    const allFiles = flattenRequestFiles(filesByField);

    await Promise.all(allFiles.map(async ({ file }) => {
        if (!file || !file.key) return;

        try {
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.SCALEWAY_BUCKET_NAME,
                Key: file.key
            }));
        } catch (error) {
            logger.error('Echec suppression S3', { s3Key: file.key, error: error.message });
        }
    }));
};

module.exports = {
    validateUploadedFilesBySignature,
    cleanupUploadedFiles
};
