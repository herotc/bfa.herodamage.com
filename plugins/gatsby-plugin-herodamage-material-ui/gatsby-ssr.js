const React = require('react')
const JssProvider = require('react-jss').JssProvider
const MuiThemeProvider = require('@material-ui/core/styles').MuiThemeProvider
const CssBaseline = require('@material-ui/core/CssBaseline').default
const getPageContext = require('./getPageContext').default

// We need to share the context for each request.
let muiPageContext

// eslint-disable-next-line react/prop-types,react/display-name
module.exports.wrapRootElement = ({element}) => {
  muiPageContext = getPageContext()
  const {sheetsRegistry, generateClassName, theme, sheetsManager} = muiPageContext
  return (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        <CssBaseline/>
        {element}
      </MuiThemeProvider>
    </JssProvider>
  )
}

module.exports.onRenderBody = ({setHeadComponents}) => {
  // Makes sure we got a context during develop mode.
  if (!muiPageContext) muiPageContext = getPageContext()
  setHeadComponents([
    <style type="text/css" id="server-side-jss" key="server-side-jss"
      dangerouslySetInnerHTML={{__html: muiPageContext.sheetsRegistry.toString()}}/>
  ])
}
