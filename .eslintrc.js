module.exports = {
  'root': true,
  'extends': [
    '@hidoo/eslint-config',
    '@hidoo/eslint-config/+babel',
    '@hidoo/eslint-config/+node'
  ],
  'overrides': [
    // for Mocha
    {
      'files': [
        '**/*.test.js'
      ],
      'extends': [
        '@hidoo/eslint-config/+mocha'
      ],
      'rules': {
        'no-empty-function': 'off',
        'mocha/no-hooks-for-single-case': 'off'
      }
    }
  ]
};
