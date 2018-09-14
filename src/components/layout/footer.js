import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
  footer: {
    background: theme.custom.color.background.layout,
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  }
})

const Footer = ({ classes, siteMetadata }) => (
  <footer>
    <Paper className={classes.footer} elevation={1}>
      <Typography align={'center'}>
        Copyright © 2017-2018 Hero Damage |&nbsp;
        <a href={siteMetadata.github} title="GitHub Repository">GitHub</a>&nbsp;|&nbsp;
        <a href="https://bfa-prepatch.herodamage.com/" title="BfA PrePatch version of Hero Damage">BfA PrePatch
          Version</a>&nbsp;|&nbsp;
        <a href="https://legion.herodamage.com/" title="Legion version of Hero Damage">Legion Version</a>
      </Typography>
    </Paper>
  </footer>
)

Footer.propTypes = {
  classes: PropTypes.object,
  siteMetadata: PropTypes.object
}

export default withStyles(styles)(Footer)
