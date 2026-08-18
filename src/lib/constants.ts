// Gedeelde constanten.

export const DAY = 86400000; // ms per dag

// Toegestane afbeeldingstypes voor wondfoto's (client-hint + server-enforcement).
// Bewust GÉÉN image/svg+xml (SVG kan script bevatten → XSS via inline weergave).
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
] as const;
