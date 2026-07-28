/**
 * Strip markdown code fences from AI response text.
 * Handles ```json, ```, and variations with leading/trailing whitespace.
 */
function stripCodeFences(text) {
  return text
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?\s*```\s*$/i, '')
    .trim();
}

/**
 * Attempt to repair common JSON issues.
 * - Trailing commas before } or ]
 * - Single quotes instead of double quotes (only for simple cases)
 */
function attemptRepair(text) {
  let fixed = text;

  // Remove trailing commas
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');

  // Remove single-line comments
  fixed = fixed.replace(/\/\/.*$/gm, '');

  return fixed;
}

/**
 * Parse JSON from AI response with robust error handling.
 * Tries: raw parse → strip fences → repair → throw descriptive error.
 * @param {string} text - Raw AI response text
 * @returns {object} - Parsed JSON object
 * @throws {Error} - If all parsing attempts fail
 */
export function parseAIJson(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('parseAIJson: empty or non-string input');
  }

  // Attempt 1: raw parse
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  // Attempt 2: strip code fences
  const stripped = stripCodeFences(text);
  try {
    return JSON.parse(stripped);
  } catch {
    // continue
  }

  // Attempt 3: repair
  const repaired = attemptRepair(stripped);
  try {
    return JSON.parse(repaired);
  } catch {
    // continue
  }

  // Attempt 4: extract JSON from surrounding text
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // continue
    }
  }

  throw new Error(
    `Failed to parse AI response as JSON. First 200 chars: ${text.slice(0, 200)}`
  );
}
