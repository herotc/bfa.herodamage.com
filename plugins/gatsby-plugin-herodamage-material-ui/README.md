# gatsby-plugin-herodamage-material-ui

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for [material-ui](https://github.com/mui-org/material-ui).
Add material-ui support.
Based on the [official example](https://github.com/mui-org/material-ui/tree/master/examples/gatsby).

## Prerequisites

```
npm install --save @material-ui/core @material-ui/icons jss react-jss
```

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

If you're using another CSS-in-JS solution (like [styled-components](https://github.com/styled-components/styled-components)), then you'll need to implement the ssr part in the website `gatsby-ssr.js`.
For example, we do use both material-ui and styled-components, so we have to combine both solutions into the same `replaceRenderer` function that we export in our `gatsby-ssr.js`.
