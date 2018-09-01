export const defaultLang = 'en'

// ['de', 'en', 'es', 'fr', 'it', 'ko', 'pt', 'ru', 'zh']
// Limited to 1 lang in development to save warmup time
export const langs = process.env.NODE_ENV === 'production' ? ['de', 'en', 'fr', 'ko', 'ru', 'zh'] : ['en']

export const catalogs = {}
for (const lang of langs) {
  catalogs[lang] = { messages: require(`../../src/locales/${lang}/messages.json`) }
}

/**
 *
 * @param lang
 * @returns {string}
 */
export function prefix (lang) {
  return lang !== defaultLang ? `/${lang}` : ''
}

/**
 *
 * @param path
 * @returns {string}
 */
export function deprefix (path) {
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

/**
 *
 * @param lang
 * @param path
 * @returns {string}
 */
export function replacePrefix (lang, path) {
  return `${prefix(lang)}${deprefix(path)}`
}

/**
 *
 * @param path
 * @returns {*|boolean|string|null}
 */
export function langFromPath (path) {
  let extractedLang = null
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) extractedLang = lang
  })
  return extractedLang || defaultLang
}

/**
 * Until there is a way to figure how to dynamic translate variable from lingui we'll use this
 * @param lang
 * @returns {function(*=): *}
 */
export function translation (lang) {
  return (message) => catalogs[lang].messages[message] || (lang !== defaultLang && catalogs[defaultLang].messages[message]) || message
}
