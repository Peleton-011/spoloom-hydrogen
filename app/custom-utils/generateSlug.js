export default function generateSlug(text) {
  return text
    .toLowerCase() // Convert to lowercase
    .normalize('NFD') // Normalize the string
    .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
}
