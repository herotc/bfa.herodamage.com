const langs = ['en', 'fr']
const catalogs = {}
langs.forEach((lang) => {
  catalogs[lang] = {messages: require(`../../src/locales/${lang}/messages.json`)}
})

module.exports.defaultLang = 'en'
module.exports.langs = langs
module.exports.catalogs = catalogs
module.exports.prefix = (lang) => `/${lang}`
module.exports.deprefix = (pathname) => pathname.startsWith('/fr/') ? pathname.substr(4) : pathname
module.exports.langFromPath = (pathname) => pathname.startsWith('/fr/') ? 'fr' : 'en'
