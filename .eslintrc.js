module.exports = {
  parser: 'babel-eslint', // Mostly because dynamic import isn't correctly linted while is valid with esm/babel
  plugins: [
    'react'
  ],
  extends: [
    'standard',
    'plugin:react/recommended'
  ]
}
