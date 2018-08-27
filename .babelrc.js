module.exports = {
  env: {
    production: {
      presets: [
        ['@babel/preset-env', {
          targets: {node: 8}
        }]
      ]
    },
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {node: 'current'}
        }],
        'power-assert'
      ]
    }
  }
};
