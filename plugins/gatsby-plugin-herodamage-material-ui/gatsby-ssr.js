import React from 'react'
import { renderToString } from 'react-dom/server'
import { JssProvider } from 'react-jss'
import getPageContext from './getPageContext'

module.exports.replaceRenderer = ({bodyComponent, replaceBodyHTMLString, setHeadComponents}) => {
  // Get the context of the page to collected side effects.
  const pageContext = getPageContext()

  const body = renderToString(
    <JssProvider registry={pageContext.sheetsRegistry} generateClassName={pageContext.generateClassName}>
      {React.cloneElement(bodyComponent, {pageContext})}
    </JssProvider>
  )
  replaceBodyHTMLString(body)

  const jssStyle = (
    <style type="text/css" id="server-side-jss" key="server-side-jss"
      dangerouslySetInnerHTML={{__html: pageContext.sheetsRegistry.toString()}}/>
  )
  setHeadComponents([jssStyle])
}
