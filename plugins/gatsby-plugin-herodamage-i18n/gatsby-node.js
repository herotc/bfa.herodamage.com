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

  let pagePath
  switch (page.path) {
    // Prevent i18n on index, 404, dev pages
    case '/dev-404-page/':
    case '/404/':
    case '/404.html':
    case '/':
      return
    // Rewrite lang-index to index to transform it to '/lang/' instead of '/lang/lang-index/'
    case '/lang-index/':
      pagePath = '/'
      break
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
    const path = `/${lang}${pagePath}`
    const newPage = Object.assign({}, page, {path}, {context})
    createPage(newPage)
  })
}
