/** @type {import('eslint').ESLint.ConfigData} */
const config = {
  extends: [
    '../.eslintrc.cjs',
    '.eslintrc-auto-import.json'
  ],
  ignorePatterns: [
    '/dist/**/*', // Ignore built files.
    '.eslintrc.cjs',
  ],
  rules: {
    'no-console': 'warn',
    'vue/max-attributes-per-line': ["error", {
      "singleline": {
        "max": 3
      },
      "multiline": {
        "max": 1
      }
    }]
  }
}
module.exports = config
