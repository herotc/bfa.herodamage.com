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
const defaultLang = require('./index').defaultLang
const prefix = require('./index').prefix
module.exports.onCreatePage = function ({page, boundActionCreators}) {
  const {createPage, deletePage} = boundActionCreators

  let pagePath
  switch (page.path) {
    // Prevent i18n on dev page
    case '/dev-404-page/':
      return
    default:
      pagePath = page.path
  }

  // Delete the original page
  deletePage(page)

  // TODO: Support pages made with 'name.lang.ext' like 'fancy-post.fr.md'

  // Make a new page for each lang
  langs.forEach((lang) => {
    // Object.assign is used to avoid mutating the page object
    const context = Object.assign({}, page.context, {lang})
    const path = `${prefix(lang)}${pagePath}`
    const newPage = Object.assign({}, page, {path}, {context})
    createPage(newPage)
  })
}
