const React = require('react')
const MuiThemeProvider = require('@material-ui/core/styles').MuiThemeProvider
const CssBaseline = require('@material-ui/core/CssBaseline').default
const {sheetsManager, theme} = require('./theme')

// remove the JSS style tag generated on the server to avoid conflicts with the one added on the client
exports.onInitialClientRender = () => {
  const ssStyles = window.document.getElementById('server-side-jss')
  ssStyles && ssStyles.parentNode.removeChild(ssStyles)
}

// eslint-disable-next-line react/prop-types,react/display-name
exports.wrapRootElement = ({element}) => (
  <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
    <CssBaseline/>
    {element}
  </MuiThemeProvider>
)
