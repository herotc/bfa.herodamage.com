# gatsby-plugin-herodamage-i18n
 
A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
[js-lingui](https://github.com/lingui/js-lingui)

## Prerequisites

```
npm install --save gatsby-plugin-react-next react react-dom
npm install --save gatsby-source-filesystem gatsby-transformer-remark
npm install --save @lingui/react @lingui/babel-preset-react
```

And add an entry for `gatsby-plugin-react-next`, `gatsby-transformer-remark` and `gatsby-source-filesystem` in `gatsby-config.js` (see Gatsby docs)  
**Makes sure `gatsby-plugin-react-next` is loaded first.**

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

```
npm install --save-dev @lingui/cli @babel/core @babel/preset-react
npm install --save-dev @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
```

Then make a .babelrc (or append to your existing one):
```json
{
  "plugins": [
    "@lingui/babel-plugin-transform-js",
    "@lingui/babel-plugin-transform-react"
  ],
  "env": {
    "extract": {
      "presets": [
        "@babel/preset-react"
      ],
      "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties"
      ]
    }
  }
}
```

After that, you need to set the `extract` env when you run the extract command, i.e.: `BABEL_ENV=extract lingui extract`  
You can use `cross-env` if you use Windows.

Finally, configure the lingui object in your package.json (see the [lingui documentation](https://lingui.github.io/js-lingui/ref/lingui-conf.html)).
