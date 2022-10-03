/** @type {import('eslint').ESLint.ConfigData} */
const config = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    '../.eslintrc.cjs',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/dist/**/*', // Ignore built files.
    '.eslintrc.cjs',
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'import/no-unresolved': 0,
  },
}
module.exports = config
