import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import getPageContext from './getPageContext'

// Remove the JSS style tag generated on the server to avoid conflicts with the one added on the client.
export const onInitialClientRender = () => {
  const ssStyles = window.document.getElementById('server-side-jss')
  ssStyles && ssStyles.parentNode.removeChild(ssStyles)
}

// eslint-disable-next-line react/prop-types,react/display-name
export const wrapRootElement = ({ element }) => {
  const { theme, sheetsManager } = getPageContext()
  return (
    <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
      <CssBaseline/>
      {element}
    </MuiThemeProvider>
  )
}
