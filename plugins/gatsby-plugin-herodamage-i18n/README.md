# gatsby-plugin-herodamage-i18n
 
A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for [js-lingui](https://github.com/lingui/js-lingui)

## Prerequisites

```
npm install --save gatsby-source-filesystem gatsby-transformer-remark
npm install --save @lingui/react @lingui/babel-preset-react
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


## Use the lingui CLI

See `scripts/i18n` and `lingui.config.js`.
