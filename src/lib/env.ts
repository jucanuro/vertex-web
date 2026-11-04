/**
 * Variables de entorno de build.
 * ALLOW_INDEXING: solo "true" permite indexación (producción con dominio real).
 */
export const allowIndexing = (import.meta.env.ALLOW_INDEXING ?? process.env.ALLOW_INDEXING) === 'true';
