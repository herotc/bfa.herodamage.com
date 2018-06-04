# gatsby-plugin-herodamage-i18n
 
A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
[i18next](https://github.com/i18next/i18next) and [react-i18next](https://github.com/i18next/react-i18next).

## Prerequisites

```
npm install --save gatsby-source-filesystem gatsby-transformer-remark
npm install --save i18next react-i18next i18next-browser-languagedetector i18next-node-fs-backend
```

And add an entry for `gatsby-transformer-remark` and `gatsby-source-filesystem` in `gatsby-config.js` (see Gatsby docs) 

## How to use

Edit `gatsby-config.js`:
```javascript
module.exports = {
  plugins: [
    'gatsby-plugin-herodamage-i18n'
  ]
}
```
