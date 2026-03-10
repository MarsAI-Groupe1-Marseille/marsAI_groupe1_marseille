const fs = require('fs/promises');
const upload = require('./uploadMiddleware');
const { validateUploadedLocalFilesBySignature, cleanupUploadedFiles } = require('../services/fileValidationService');

const formatUploadErrorResponse = (res, err) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: 'Le fichier depasse la taille maximale autorisee (500MB).',
            errors: [{ field: err.field || 'file', message: 'Fichier trop volumineux (max 500MB).' }]
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            message: 'Un fichier non attendu a ete envoye.',
            errors: [{ field: err.field || 'file', message: 'Champ de fichier non autorise.' }]
        });
    }

    return res.status(400).json({
        message: err.message || 'Erreur de validation fichier.',
        errors: [{ field: err.field || 'file', message: err.message || 'Fichier invalide.' }]
    });
};

const runMulter = (parser, req, res) => new Promise((resolve, reject) => {
    parser(req, res, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});

const normalizeFilesByField = (req) => {
    if (req.files && !Array.isArray(req.files)) {
        return req.files;
    }

    if (req.file) {
        return { [req.file.fieldname || 'file']: [req.file] };
    }

    return {};
};

const cleanupLocalFiles = async (filesByField = {}) => {
    const files = Object.values(filesByField).flat();

    await Promise.all(files.map(async (file) => {
        if (!file?.path) return;
        try {
            await fs.unlink(file.path);
        } catch (error) {
            // Ignore: un fichier temporaire peut deja etre supprime.
        }
    }));
};

// Pipeline unique: parser local -> valider signature -> uploader S3 -> nettoyer les fichiers temporaires.
const processValidatedUpload = (parser) => async (req, res, next) => {
    try {
        await runMulter(parser, req, res);
    } catch (err) {
        const localFilesOnError = normalizeFilesByField(req);
        await cleanupLocalFiles(localFilesOnError);
        return formatUploadErrorResponse(res, err);
    }

    const localFilesByField = normalizeFilesByField(req);
    const hasFiles = Object.keys(localFilesByField).length > 0;

    if (!hasFiles) {
        return next();
    }

    const signatureValidation = await validateUploadedLocalFilesBySignature(localFilesByField);
    if (!signatureValidation.ok) {
        await cleanupLocalFiles(localFilesByField);
        return res.status(400).json({
            message: 'Fichier invalide.',
            error: signatureValidation.message,
            errors: [{
                field: signatureValidation.field || 'file',
                message: signatureValidation.message
            }]
        });
    }

    const uploadedFilesByField = {};

    try {
        // Upload uniquement apres validation binaire reussie.
        for (const [fieldName, files] of Object.entries(localFilesByField)) {
            uploadedFilesByField[fieldName] = [];
            for (const file of files) {
                const uploadedFile = await upload.uploadSingleFileToS3(file, fieldName);
                uploadedFilesByField[fieldName].push(uploadedFile);
            }
        }
    } catch (error) {
        await cleanupUploadedFiles(uploadedFilesByField);
        await cleanupLocalFiles(localFilesByField);
        return res.status(500).json({
            message: 'Erreur lors de l\'upload du fichier.',
            errors: [{ field: 'file', message: 'Echec lors de l\'envoi sur le stockage.' }]
        });
    }

    await cleanupLocalFiles(localFilesByField);

    req.files = uploadedFilesByField;
    if (req.file) {
        // Maintient la compatibilite des controlleurs existants qui lisent req.file.
        const uploadedAvatar = uploadedFilesByField[req.file.fieldname || 'file'];
        req.file = uploadedAvatar ? uploadedAvatar[0] : null;
    }

    return next();
};

const createValidatedFieldsUploadHandler = (fields) => processValidatedUpload(upload.fields(fields));

const createValidatedSingleUploadHandler = (fieldName) => processValidatedUpload(upload.single(fieldName));

module.exports = {
    createValidatedFieldsUploadHandler,
    createValidatedSingleUploadHandler
};
