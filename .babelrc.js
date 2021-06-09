module.exports = {
  env: {
    production: {
      targets: {node: 12},
      presets: [
        ['@babel/preset-env', {}]
      ]
    },
    test: {
      targets: {node: 'current'},
      presets: [
        ['@babel/preset-env', {}],
        'power-assert'
      ]
    }
  }
};
