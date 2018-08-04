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

Edit `gatsby-ssr.js`
```javascript
import React from 'react'
import { renderToString } from 'react-dom/server'
import { JssProvider } from 'react-jss'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import getPageContext from './plugins/gatsby-plugin-herodamage-material-ui/getPageContext'

module.exports.replaceRenderer = ({bodyComponent, replaceBodyHTMLString, setHeadComponents}) => {
  // Get the context of the page to collected side effects.
  const pageContext = getPageContext()
  const sheet = new ServerStyleSheet()

  const app = renderToString(
    <JssProvider registry={pageContext.sheetsRegistry} generateClassName={pageContext.generateClassName}>
      <StyleSheetManager sheet={sheet.instance}>
        {React.cloneElement(bodyComponent, {pageContext})}
      </StyleSheetManager>
    </JssProvider>
  )
  const body = renderToString(app)
  replaceBodyHTMLString(body)

  const jssStyleComponent = (
    <style type="text/css" id="server-side-jss" key="server-side-jss"
      dangerouslySetInnerHTML={{__html: pageContext.sheetsRegistry.toString()}}/>
  )
  setHeadComponents([
    jssStyleComponent,
    sheet.getStyleElement()
  ])
}

```

## Notes
Since we do use [styled-components](https://github.com/styled-components/styled-components) and its [Gatsby plugin](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-styled-components), we do have to reimplement their SSR code because gatsby cannot have two replaceRenderer overrides.
