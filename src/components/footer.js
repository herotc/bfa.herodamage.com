import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
  footer: {
    background: theme.palette.custom.layout,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  }
})

const Footer = ({classes, siteMetadata}) => (
  <footer>
    <Paper className={classes.footer} elevation={1}>
      <Typography>
        Copyright © 2017-2018 Hero Damage |&nbsp;
        <a href={siteMetadata.github} title="Hero Damage GitHub Repository" target="_blank"
          rel="noopener noreferrer nofollow">GitHub</a>
      </Typography>
    </Paper>
  </footer>
)

Footer.propTypes = {
  classes: PropTypes.object,
  siteMetadata: PropTypes.object
}

export default withStyles(styles)(Footer)
