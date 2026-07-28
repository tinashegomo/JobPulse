import OpenAI from 'openai';

const BASE_URL = 'https://console.opencode.ai/inference/openai/v1';

let client = null;

/**
 * Get or create a reusable OpenAI client configured for OpenCode Console.
 * @param {string} apiKey - API key (server-side only)
 * @returns {OpenAI}
 */
export function getClient(apiKey) {
  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: BASE_URL,
    });
  }
  return client;
}

/**
 * Send a chat completion request.
 * @param {object} options
 * @param {string} options.apiKey
 * @param {string} options.model
 * @param {string} options.prompt
 * @param {number} [options.maxTokens=2048]
 * @returns {Promise<string>} - Raw text response
 */
export async function chatCompletion({ apiKey, model, prompt, maxTokens = 2048 }) {
  const ai = getClient(apiKey);

  const response = await ai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.1,
  });

  return response.choices?.[0]?.message?.content || '';
}
