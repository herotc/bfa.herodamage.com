const defaultLang = 'en'

const langs = ['en', 'fr']

const catalogs = {}
langs.forEach((lang) => {
  catalogs[lang] = {messages: require(`../../src/locales/${lang}/messages.json`)}
})

const prefix = (lang) => `/${lang}`

const deprefix = (path) => {
  let pathPrefixed
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) pathPrefixed = true
  })
  return pathPrefixed ? path.substr(3) : path
}

const replacePrefix = (lang, path) => {
  return `${prefix(lang)}${deprefix(path)}`
}

const langFromPath = (path) => {
  let extractedLang
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) extractedLang = lang
  })
  return extractedLang || 'en'
}

module.exports.defaultLang = defaultLang
module.exports.langs = langs
module.exports.catalogs = catalogs
module.exports.prefix = prefix
module.exports.deprefix = deprefix
module.exports.replacePrefix = replacePrefix
module.exports.langFromPath = langFromPath
