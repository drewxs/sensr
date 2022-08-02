module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['solid'],
  extends: ['eslint:recommended', 'plugin:solid/typescript'],
  env: {
    browser: true,
    amd: true,
    node: true,
  },
};
