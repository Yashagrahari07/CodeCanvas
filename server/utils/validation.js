export const supportedLanguages = new Set(['cpp', 'python', 'javascript', 'java']);

export const normalizeLanguage = (language) => language === 'c++' ? 'cpp' : language;

export const isNonEmptyString = (value, maxLength) => (
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength
);

export const isValidEmail = (email) => (
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
);

export const isValidObjectId = (value) => /^[a-f\d]{24}$/i.test(value);

export const validateWorkspace = (workspace) => (
  workspace &&
  isNonEmptyString(workspace.title, 100) &&
  (!workspace.cards || Array.isArray(workspace.cards))
);

export const validateCard = (card) => (
  card &&
  isNonEmptyString(card.title || 'new', 100) &&
  supportedLanguages.has(normalizeLanguage(card.language))
);
