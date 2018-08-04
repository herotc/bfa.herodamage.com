import React from 'react'
import { renderToString } from 'react-dom/server'
import { JssProvider } from 'react-jss'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import getPageContext from './getPageContext'

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
