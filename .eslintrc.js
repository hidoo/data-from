module.exports = {
  root: true,
  extends: ['@hidoo/eslint-config'],
  overrides: [
    {
      files: ['**/src/**/*.js'],
      extends: ['@hidoo/eslint-config/+node'],
      rules: {}
    },
    {
      files: ['**/*.test.js'],
      extends: ['@hidoo/eslint-config/+mocha', '@hidoo/eslint-config/+node'],
      rules: {
        'no-empty-function': 'off'
      }
    }
  ]
};
