module.exports = function (api) {
  api.cache(true)

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    '@lingui/babel-preset-react'
  ]
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import'
  ]

  return {
    presets,
    plugins
  }
}
