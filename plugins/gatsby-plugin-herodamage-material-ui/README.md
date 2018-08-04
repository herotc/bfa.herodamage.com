# gatsby-plugin-herodamage-material-ui

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for [material-ui](https://github.com/mui-org/material-ui).
Gatsby plugin to add material-ui support.
Based on the [official example](https://github.com/mui-org/material-ui/tree/master/examples/gatsby).

## Prerequisites

```
npm install --save react react-dom prop-types
npm install --save @material-ui/core @material-ui/icons jss react-jss
npm install --save styled-components gatsby-plugin-styled-components
```
**Makes sure `gatsby-plugin-styled-components` is loaded first.**

## How to use

Edit `gatsby-config.js`:
```javascript
module.exports = {
  plugins: [
    'gatsby-plugin-herodamage-material-ui'
  ]
}
```

## Notes
Since we do use [styled-components](https://github.com/styled-components/styled-components) and its [Gatsby plugin](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-styled-components), we do have to reimplement their SSR code because gatsby cannot have two replaceRenderer overrides.
