/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.modifyBabelrc = ({babelrc}) => ({
  ...babelrc,
  plugins: babelrc.plugins.concat(
    ['transform-regenerator'],
    ['transform-runtime']
  )
})
