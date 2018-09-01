import { SheetsRegistry } from 'jss'
import { createGenerateClassName, createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'

const spacingUnit = 8 // material-ui default, not accessible until the theme is created
export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: grey[900]
    },
    secondary: {
      main: red[900]
    },
    background: {
      default: grey[900]
    }
  },
  overrides: {
    MuiTypography: {
      title: {
        marginTop: spacingUnit * 2,
        marginBottom: spacingUnit * 2
      }
    }
  },
  custom: {
    color: {
      background: {
        layout: '#303030'
      }
    },
    css: {
      transitionFast: 'all 0.1s',
      transitionNormal: 'all 0.2s',
      transitionSlow: 'all 0.3s'
    }
  }
})

function createPageContext () {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  }
}

export default function getPageContext () {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext()
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext()
  }

  return global.__INIT_MATERIAL_UI__
}
