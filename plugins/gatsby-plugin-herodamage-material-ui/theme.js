import { createMuiTheme } from '@material-ui/core/styles/index'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'

export const sheetsManager = new Map()

const spacingUnit = 8 // MUI default, not accessible until the theme is created
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
