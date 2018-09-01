const fs = require('fs')
const readline = require('readline')

const config = require('../../gatsby-config')

const baseUrl = config.siteMetadata.url
const jsonFiles = []
let urls = []

const diff = readline.createInterface(fs.createReadStream('public/filenames.diff'))

diff.on('line', function (relativeUrl) {
  // Split by chunk, CF limit is 500 per request
  if (urls.length >= 450) {
    jsonFiles.push({ files: urls })
    urls = []
  }
  // Complete filename version, i.e.: https://www.herodamage.com/blog/index.html
  urls.push(`${baseUrl}/${relativeUrl}`)
  // Alternative versions
  const patterns = [
    'index.html', // Indexless version, i.e.: https://www.herodamage.com/blog/
    '/index.html' // Indexless version without trailing slash, i.e.: https://www.herodamage.com/blog
  ]
  const relativeUrlLength = relativeUrl.length
  for (let pattern of patterns) {
    if (relativeUrl.endsWith(pattern)) {
      urls.push(`${baseUrl}/${relativeUrl.slice(0, relativeUrlLength - pattern.length)}`)
    }
  }
  // Special case for the homepage, i.e.: https://www.herodamage.com (baseUrl without trailing slash)
  if (relativeUrl === 'index.html') urls.push(`${baseUrl}`)
})

diff.on('close', function () {
  // Push the remaining urls
  jsonFiles.push({ files: urls })
  // Make the json files that will be attached to each request
  jsonFiles.forEach((jsonFile, index) => {
    const filename = `urls_to_purge_${index + 1}.json`
    fs.writeFile(filename, JSON.stringify(jsonFile), (err) => { if (err) console.err(err) })
  })
})
