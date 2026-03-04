import DOMPurify from 'dompurify';

export const sanitizeText = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export const sanitizeList = (value, separator = ',') => {
  return sanitizeText(value)
    .split(separator)
    .map((item) => sanitizeText(item).trim())
    .filter(Boolean);
};