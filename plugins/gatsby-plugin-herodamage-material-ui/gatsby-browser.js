const React = require('react')
const MuiThemeProvider = require('@material-ui/core/styles').MuiThemeProvider
const CssBaseline = require('@material-ui/core/CssBaseline').default
const getPageContext = require('./getPageContext').default

// Remove the JSS style tag generated on the server to avoid conflicts with the one added on the client.
module.exports.onInitialClientRender = () => {
  const ssStyles = window.document.getElementById('server-side-jss')
  ssStyles && ssStyles.parentNode.removeChild(ssStyles)
}

// eslint-disable-next-line react/prop-types,react/display-name
module.exports.wrapRootElement = ({ element }) => {
  const { theme, sheetsManager } = getPageContext()
  return (
    <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
      <CssBaseline/>
      {element}
    </MuiThemeProvider>
  )
}
