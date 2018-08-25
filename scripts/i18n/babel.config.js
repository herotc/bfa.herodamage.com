module.exports = function (api) {
  api.cache(true)

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    '@lingui/babel-preset-react'
  ]
  const plugins = []

  return {
    presets,
    plugins
  }
}
