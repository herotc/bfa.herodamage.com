import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = (theme) => ({
  main: {
    background: theme.custom.color.background.layout,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  }
})

const Main = ({classes, ...props}) => {
  const {children} = props
  return (
    <main>
      <Paper className={classes.main} elevation={1}>
        {children(props)}
      </Paper>
    </main>
  )
}

Main.propTypes = {
  children: PropTypes.func,
  classes: PropTypes.object
}

export default withStyles(styles)(Main)
