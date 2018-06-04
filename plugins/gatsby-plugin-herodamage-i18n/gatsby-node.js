// // Add Babel plugin
// let babelPluginExists = false
// try {
//   require.resolve('@lingui/babel-preset-react')
//   babelPluginExists = true
// } catch (e) {
//   // Ignore
// }
//
// exports.modifyBabelrc = ({ babelrc, stage }) => {
//   if (babelPluginExists) {
//     if (stage === 'build-html') {
//       return {
//         ...babelrc,
//         plugins: babelrc.plugins.concat([
//           [
//             '@lingui/babel-preset-react',
//             {
//               ssr: true
//             }
//           ]
//         ])
//       }
//     }
//
//     return {
//       ...babelrc,
//       plugins: babelrc.plugins.concat(['@lingui/babel-preset-react'])
//     }
//   }
//
//   return babelrc
// }

// Create i18n routes
const langs = require('./index').langs

exports.onCreatePage = async ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators

  if (page.path === '/dev-404-page/' || page.path === '/404/' || page.path === '/404.html') return
  console.log(page.path)

  // Delete the original page
  deletePage(page)

  // Make a new page for each lang
  langs.forEach((lang) => {
    // Make a new page object from the original page
    const newPage = Object.assign({}, page)

    // Override the path to add the lang prefix
    newPage.path = `/${lang}${page.path}`

    // Makes sure we have a context object
    if (!newPage.context) newPage.context = {}
    // Then pass it the lang key
    newPage.context.lang = lang

    createPage(newPage)
  })
}
