/**
 * Prettier v3 defaults with the single evidence-backed deviation
 * (singleQuote) plus package.json field sorting. Keys are limited to the
 * subset oxfmt also understands so a future formatter swap stays mechanical.
 *
 * @type {import('prettier').Config}
 */
export default {
  singleQuote: true,
  plugins: ['prettier-plugin-packagejson'],
};
