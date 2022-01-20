const config = {
  babelrc: false,
  presets: [ '@babel/env', '@babel/react' ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties'
  ]
}

module.exports = require('babel-jest').default.createTransformer(config)
