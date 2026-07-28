/**
 * Ordered list of models to try. First is primary, rest are fallbacks.
 * When a model fails with 429/5xx, the next one is tried automatically.
 */
export const MODELS = [
  'mimo-v2.5-free',
  'deepseek-v4-flash-free',
  'ling-3.0-flash-free',
  'laguna-s-2.1-free',
  'nemotron-3-ultra-free',
  'north-mini-code-free',
];
