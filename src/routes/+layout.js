// Cada página sale como <ruta>/index.html. Con <ruta>.html, el servidor no
// encontraba /inputs al entrar directo o recargar (404), y /sidebar/ era una
// carpeta sin index (403).
export const trailingSlash = 'always';
