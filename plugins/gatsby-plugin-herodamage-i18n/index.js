const defaultLang = 'en'
module.exports.defaultLang = defaultLang

const langs = ['en', 'fr']
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
  return `/${lang}`
}

module.exports.prefix = prefix

/**
 *
 * @param path
 * @returns {string}
 */
function deprefix (path) {
  let pathPrefixed
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) pathPrefixed = true
  })
  return pathPrefixed ? path.substr(3) : path
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
 * @param fallback
 * @returns {*|boolean|string|null}
 */
function langFromPath (path, fallback = true) {
  let extractedLang = null
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) extractedLang = lang
  })
  return extractedLang || (fallback && 'en') || null
}

module.exports.langFromPath = langFromPath

/**
 *
 * @param path
 * @returns {boolean}
 */
function isIntlPage (path) {
  return langFromPath(path, false) !== null
}

module.exports.isIntlPage = isIntlPage

/**
 * Until there is a way to figure how to dynamic translate variable from lingui we'll use this
 * @param lang
 * @returns {function(*=): *}
 */
function translation (lang) {
  return (message) => catalogs[lang].messages[message] || message
}

module.exports.translation = translation
