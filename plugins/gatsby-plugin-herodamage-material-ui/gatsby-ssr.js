import React from 'react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import getPageContext from './getPageContext'

// We need to share the context for each request.
const muiPageContextManager = new Map()

// eslint-disable-next-line react/prop-types,react/display-name
export const wrapRootElement = ({ element, pathname }) => {
  const muiPageContext = getPageContext()
  muiPageContextManager.set(pathname, muiPageContext)
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

export const onRenderBody = ({ pathname, setHeadComponents }) => {
  const muiPageContext = muiPageContextManager.get(pathname)
  if (muiPageContext) {
    setHeadComponents([
      <style type="text/css" id="server-side-jss" key="server-side-jss"
        dangerouslySetInnerHTML={{ __html: muiPageContext.sheetsRegistry.toString() }}/>
    ])
  }
}
