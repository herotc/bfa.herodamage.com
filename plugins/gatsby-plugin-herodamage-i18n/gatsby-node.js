// Add Babel preset
try {
  require.resolve('@lingui/babel-preset-react')
} catch (err) {
  throw new Error(
    '\'@lingui/babel-preset-react\' is not installed which is needed by plugin \'gatsby-plugin-herodamage-i18n\''
  )
}
module.exports.onCreateBabelConfig = ({actions}) => {
  actions.setBabelPreset({
    name: '@lingui/babel-preset-react'
  })
}

// Create i18n routes
const langs = require('./index').langs
const prefix = require('./index').prefix
module.exports.onCreatePage = function ({page, actions}) {
  const {createPage, deletePage} = actions

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
