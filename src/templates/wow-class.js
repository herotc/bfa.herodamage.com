import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import groupBy from 'lodash/groupBy'
import { DateFormat } from '@lingui/react'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
  title: {
    marginTop: '1rem',
    padding: '2rem 0'
  },
  type: {
    flexDirection: 'column'
  },
  name: {
    width: '100%',
    '& span': {
      float: 'right'
    }
  }
})

const SpecsList = ({classes, lang, specs, t}) => {
  return specs.map(({node}, index) => {
    const {slug, spec, buildTime} = node.context
    const buildDate = new Date(buildTime * 1000)
    return (
      <Grid item key={index} xs={12}>
        {index > 0 && <Divider/>}
        <ListItem button component="a" href={`/${lang}${slug}`}>
          <Typography className={classes.name}>
            {capitalize(t(spec))}
            <span><DateFormat value={buildDate} format={{month: 'short', day: '2-digit'}}/></span>
          </Typography>
        </ListItem>
      </Grid>
    )
  })
}

const TiersList = (props) => {
  const {classes, groupedEdgesByTier, lang} = props
  return Object.keys(groupedEdgesByTier).map((tier, index) => {
    const specs = groupedEdgesByTier[tier].sort((a, b) => a.node.context.spec > b.node.context.spec)
    return (
      <Grid item key={index} xs={12} sm={6}>
        <ExpansionPanel>
          <Divider/>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>{tier.toLocaleUpperCase(lang)}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.type}>
            <Grid container direction={'column'}>
              <List component="nav" disablePadding={true}>
                <SpecsList {...props} specs={specs}/>
              </List>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    )
  })
}

const WowClassTemplate = (props) => {
  const {classes, data, t} = props
  const {wowClass} = data.allSitePage.group[0].edges[0].node.context
  return (
    <div>
      <Typography variant={'title'} className={classes.title}>{capitalize(t(wowClass))}</Typography>
      <Grid container spacing={16}>
        {
          data.allSitePage.group.map((group, index) => {
            const {simulationType} = group.edges[0].node.context
            return (
              <Grid item key={index} xs={12} lg={6}>
                <ExpansionPanel defaultExpanded={true} elevation={2}>
                  <Divider/>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant={'subheading'}>{capitalize(t(simulationType))}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={8} alignItems={'flex-start'}>
                      <TiersList {...props}
                        groupedEdgesByTier={groupBy(group.edges, (edge) => edge.node.context.tier)}/>
                      <TiersList {...props}
                        groupedEdgesByTier={groupBy(group.edges, (edge) => edge.node.context.tier)}/>
                      <TiersList {...props}
                        groupedEdgesByTier={groupBy(group.edges, (edge) => edge.node.context.tier)}/>
                      <TiersList {...props}
                        groupedEdgesByTier={groupBy(group.edges, (edge) => edge.node.context.tier)}/>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            )
          })
        }
      </Grid>
    </div>
  )
}

WowClassTemplate.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  t: PropTypes.func
}

export default withStyles(styles)(WowClassTemplate)

export const query = graphql`
  query WowClassIndex($lang: String!, $wowClass: String!) {
    allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {ne: null}}}, sort: {fields: [context___order], order: ASC}) {
      group(field: context___simulationType) {
        edges {
          node {
            id
            path
            context {
              slug
              wowClass
              name
              simulationType
              fightStyle
              tier
              spec
              variation
              targetError
              resultTime
              version
              build
              buildTime
              gitRevision
            }
          }
        }
      }
    }
  }
`
