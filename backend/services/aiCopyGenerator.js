/**
 * services/aiCopyGenerator.js
 *
 * Server-side only (Node/Express, CommonJS to match your existing
 * backend scripts) — never require() this from the React frontend,
 * it needs your ANTHROPIC_API_KEY.
 *
 * Generates original, per-product review copy using Claude:
 * description, bestFor, pros, cons, buyingTip, verdict. Fields are
 * built from your actual Product schema (name, category, highlights,
 * store) — there's no brand or price field in your schema, so those
 * prompt slots are always sent as "Not specified", same as if a
 * product just didn't have that detail.
 *
 * Usage:
 *   const { generateProductCopy } = require('./services/aiCopyGenerator');
 *   const copy = await generateProductCopy(product);
 *   // copy = { description, bestFor, pros, cons, buyingTip, verdict }
 *
 * Requires:  npm install @anthropic-ai/sdk
 * Env:       ANTHROPIC_API_KEY set in your backend's environment
 */

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-sonnet-4-6';

function buildPrompt(product) {
  const { name, category, highlights, store } = product;

  const featuresText = Array.isArray(highlights) && highlights.length > 0
    ? highlights.join(', ')
    : 'Not specified';

  return `You are an experienced affiliate product reviewer.
Write ORIGINAL content for the product below.

IMPORTANT RULES:
• Do NOT copy or rewrite Amazon, Flipkart, Myntra, Ajio, or manufacturer descriptions.
• Write in natural human language.
• Do NOT claim personal ownership or testing.
• Do NOT make false claims or exaggerated promises.
• Do NOT guarantee results.
• Mention only information that can reasonably be inferred from the product details.
• Keep the tone helpful and unbiased.
• Follow Amazon Associates and EarnKaro affiliate content guidelines.

Generate the following:

1. Short Description (120-170 words)
- Explain what the product is.
- Explain its main purpose.
- Mention notable features naturally.
- Explain why someone may consider buying it.
- Do not copy product listing text.

2. Best For
Write one short sentence beginning with:
Best for:
Examples:
- Best for home cooks who want organized spice storage.
- Best for people looking for an affordable neck massager.
- Best for students needing a compact study lamp.

3. Pros (3-5 points)
Only realistic advantages.
Examples:
✓ Space-saving design
✓ Easy to install
✓ Good value for money
✓ Compact size
✓ Simple to maintain

4. Cons (2-3 points)
Only reasonable limitations.
Examples:
✗ May not suit larger kitchens
✗ Premium alternatives offer more features
✗ Color options may be limited

5. Buying Tip
One practical sentence to help buyers choose.
Example:
Choose the larger size if you plan to store more than 20 spice jars.

6. Overall Verdict
2-3 sentences describing who should consider the product.

Return ONLY valid JSON, no preamble, no markdown code fences, in exactly this shape:
{
"description":"",
"bestFor":"",
"pros":[],
"cons":[],
"buyingTip":"",
"verdict":""
}

Product Details:
Title:
${name || 'Not specified'}
Category:
${category || 'Not specified'}
Features:
${featuresText}
Brand:
Not specified
Price:
Not specified
Store:
${store && store !== 'all' ? store : 'Not specified'}`;
}

function parseJsonResponse(rawText) {
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  const required = ['description', 'bestFor', 'pros', 'cons', 'buyingTip', 'verdict'];
  for (const key of required) {
    if (!(key in parsed)) throw new Error(`AI response missing "${key}"`);
  }
  if (!Array.isArray(parsed.pros) || !Array.isArray(parsed.cons)) {
    throw new Error('AI response "pros"/"cons" must be arrays');
  }
  return parsed;
}

/**
 * Calls Claude to generate original copy for one product.
 * Throws on API failure or malformed response — callers (e.g. the
 * backfill script) should catch, log, and skip rather than crash a
 * whole batch run over one bad product.
 */
async function generateProductCopy(product, { maxRetries = 1 } = {}) {
  const prompt = buildPrompt(product);
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock) throw new Error('No text block in AI response');

      return parseJsonResponse(textBlock.text);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

module.exports = { generateProductCopy };