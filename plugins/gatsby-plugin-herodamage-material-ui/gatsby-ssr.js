import React from 'react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import getPageContext from './getPageContext'

// We need to share the context for each request.
let muiPageContext

// eslint-disable-next-line react/prop-types,react/display-name
export const wrapRootElement = ({ element }) => {
  muiPageContext = getPageContext()
  const { sheetsRegistry, generateClassName, theme, sheetsManager } = muiPageContext
  return (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        <CssBaseline/>
        {element}
      </MuiThemeProvider>
    </JssProvider>
  )
}

export const onRenderBody = ({ setHeadComponents }) => {
  // Makes sure we got a context during develop mode.
  if (!muiPageContext) muiPageContext = getPageContext()
  setHeadComponents([
    <style type="text/css" id="server-side-jss" key="server-side-jss"
      dangerouslySetInnerHTML={{ __html: muiPageContext.sheetsRegistry.toString() }}/>
  ])
}
