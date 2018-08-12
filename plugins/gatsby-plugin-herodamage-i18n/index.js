const defaultLang = 'en'
module.exports.defaultLang = defaultLang

// ['de', 'en', 'es', 'fr', 'it', 'ko', 'pt', 'ru', 'zh']
// limited to 1 lang until upgrade to Gatsby V2 since it runs out of memory after ~2k5 pages
const langs = process.env.NODE_ENV === 'production' ? ['en'] : ['en']
module.exports.langs = langs

const catalogs = {}
langs.forEach((lang) => {
  catalogs[lang] = {messages: require(`../../src/locales/${lang}/messages.json`)}
})
module.exports.catalogs = catalogs

/**
 *
 * @param lang
 * @returns {string}
 */
function prefix (lang) {
  return lang !== defaultLang ? `/${lang}` : ''
}

module.exports.prefix = prefix

/**
 *
 * @param path
 * @returns {string}
 */
function deprefix (path) {
  let pathPrefixed = false
  let langLength = 2
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) {
      pathPrefixed = true
      langLength = lang.length
    }
  })
  return pathPrefixed ? path.substr(1 + langLength) : path
}

module.exports.deprefix = deprefix

/**
 *
 * @param lang
 * @param path
 * @returns {string}
 */
function replacePrefix (lang, path) {
  return `${prefix(lang)}${deprefix(path)}`
}

module.exports.replacePrefix = replacePrefix

/**
 *
 * @param path
 * @returns {*|boolean|string|null}
 */
function langFromPath (path) {
  let extractedLang = null
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) extractedLang = lang
  })
  return extractedLang || defaultLang
}

module.exports.langFromPath = langFromPath

/**
 * Until there is a way to figure how to dynamic translate variable from lingui we'll use this
 * @param lang
 * @returns {function(*=): *}
 */
function translation (lang) {
  return (message) => catalogs[lang].messages[message] || (lang !== defaultLang && catalogs[defaultLang].messages[message]) || message
}

module.exports.translation = translation
