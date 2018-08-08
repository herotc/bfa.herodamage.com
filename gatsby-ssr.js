/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react'
import { renderToString } from 'react-dom/server'
import { JssProvider } from 'react-jss'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import getPageContext from './plugins/gatsby-plugin-herodamage-material-ui/getPageContext'

module.exports.replaceRenderer = ({bodyComponent, replaceBodyHTMLString, setHeadComponents}) => {
  // Get the context of the page to collected side effects.
  const pageContext = getPageContext()
  const sheet = new ServerStyleSheet()

  const body = renderToString(
    <JssProvider registry={pageContext.sheetsRegistry} generateClassName={pageContext.generateClassName}>
      <StyleSheetManager sheet={sheet.instance}>
        {React.cloneElement(bodyComponent, {pageContext})}
      </StyleSheetManager>
    </JssProvider>
  )
  replaceBodyHTMLString(body)

  const jssStyle = (
    <style type="text/css" id="server-side-jss" key="server-side-jss"
      dangerouslySetInnerHTML={{__html: pageContext.sheetsRegistry.toString()}}/>
  )
  setHeadComponents([jssStyle, sheet.getStyleElement()])
}
