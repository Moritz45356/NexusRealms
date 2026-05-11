// Resolves a bilingual field { de: '...', en: '...' } to the guild's language.
export function t(field, lang = 'de') {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field['de'] ?? '';
}