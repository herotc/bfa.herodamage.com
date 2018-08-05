module.exports.defaultLang = 'en'

const langs = ['en', 'fr']
module.exports.langs = langs

const catalogs = {}
langs.forEach((lang) => {
  catalogs[lang] = {messages: require(`../../src/locales/${lang}/messages.json`)}
})
module.exports.catalogs = catalogs

const prefix = function (lang) {
  return `/${lang}`
}
module.exports.prefix = prefix

const deprefix = function (path) {
  let pathPrefixed
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) pathPrefixed = true
  })
  return pathPrefixed ? path.substr(3) : path
}
module.exports.deprefix = deprefix

module.exports.replacePrefix = function (lang, path) {
  return `${prefix(lang)}${deprefix(path)}`
}

module.exports.langFromPath = function (path) {
  let extractedLang = null
  langs.forEach((lang) => {
    if (path.startsWith(`/${lang}/`)) extractedLang = lang
  })
  return extractedLang || 'en'
}

// Until there is a way to figure how to dynamic translate variable from lingui we'll use this
module.exports.translation = function (lang) {
  return (message) => catalogs[lang].messages[message] || message
}
