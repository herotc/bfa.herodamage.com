// Add Babel preset
let babelPresetExists = false
try {
  require.resolve('@lingui/babel-preset-react')
  babelPresetExists = true
} catch (e) {
  // Ignore
}
module.exports.modifyBabelrc = function ({babelrc}) {
  if (babelPresetExists) {
    return {...babelrc, presets: babelrc.presets.concat(['@lingui/babel-preset-react'])}
  }
  return babelrc
}

// Create i18n routes
const langs = require('./index').langs
module.exports.onCreatePage = function ({page, boundActionCreators}) {
  const {createPage, deletePage} = boundActionCreators

  // Prevent i18n on dev pages
  if (page.path === '/dev-404-page/') return

  // Delete the original page
  deletePage(page)

  // TODO: Support pages made with 'name.lang.ext' like 'fancy-post.fr.md'

  // Make a new page for each lang
  langs.forEach((lang) => {
    // Object.assign is used to avoid mutating the page object
    const context = {context: Object.assign({}, page.context, {lang})}
    const path = {path: `/${lang}${page.path}`}
    const newPage = Object.assign({}, page, path, context)
    createPage(newPage)
  })
}
