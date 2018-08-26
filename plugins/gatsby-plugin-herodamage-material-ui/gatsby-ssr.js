const React = require('react')
const {JssProvider, SheetsRegistry} = require('react-jss')
const {createGenerateClassName, MuiThemeProvider} = require('@material-ui/core/styles')
const CssBaseline = require('@material-ui/core/CssBaseline').default
const {sheetsManager, theme} = require('./theme')

// JSS
const sheets = new SheetsRegistry()
const generateClassName = createGenerateClassName()

// eslint-disable-next-line react/prop-types,react/display-name
exports.wrapRootElement = ({element}) => (
  <JssProvider registry={sheets} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
      <CssBaseline/>
      {element}
    </MuiThemeProvider>
  </JssProvider>
)

exports.onRenderBody = ({setHeadComponents}) => {
  setHeadComponents([
    <style type="text/css" id="server-side-jss" key="server-side-jss"
      dangerouslySetInnerHTML={{__html: sheets.toString()}}/>
  ])
}
