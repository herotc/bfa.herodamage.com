// Add Babel preset
let babelPresetExists = false
try {
  require.resolve('@lingui/babel-preset-react')
  babelPresetExists = true
} catch (e) {
  // Ignore
}

exports.modifyBabelrc = ({babelrc}) => {
  if (babelPresetExists) {
    return {
      ...babelrc,
      presets: babelrc.presets.concat(['@lingui/babel-preset-react'])
    }
  }

  return babelrc
}

// Create i18n routes
const langs = require('./index').langs

exports.onCreatePage = async ({page, boundActionCreators}) => {
  const {createPage, deletePage} = boundActionCreators

  // Prevent i18n on dev pages
  if (page.path === '/dev-404-page/') return

  // Delete the original page
  deletePage(page)

  // Make a new page for each lang
  langs.forEach((lang) => {
    // Make a new page object from the original page and override the path to add the lang prefix
    const newPage = Object.assign({}, page, {path: `/${lang}${page.path}`})

    createPage(newPage)
  })
}
