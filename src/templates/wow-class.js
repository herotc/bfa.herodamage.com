// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import groupBy from 'lodash/groupBy'
import startCase from 'lodash/startCase'
import { withStyles } from '@material-ui/core/styles'
import { getSpecVariation } from '../utils/wow'
// Components
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import { Trans, DateFormat } from '@lingui/react'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Layout from '../components/layout'

const styles = (theme) => ({
  type: {
    flexDirection: 'column'
  },
  name: {
    padding: theme.spacing.unit,
    '& p': {
      width: '100%',
      '& span': {
        float: 'right'
      }
    }
  }
})

const SpecsList = ({classes, i18nPlugin, specs}) => {
  const {t} = i18nPlugin
  return specs.map(({node}, index) => {
    const {context, path} = node
    const {spec, variation, buildTime} = context
    const buildDate = new Date(buildTime * 1000)
    return (
      <Grid item key={index} xs={12}>
        {index > 0 && <Divider/>}
        <ListItem button component={Link} to={path} className={classes.name}>
          <Typography>
            {getSpecVariation(t, spec, variation)}
            <span><DateFormat value={buildDate} format={{month: 'short', day: '2-digit'}}/></span>
          </Typography>
        </ListItem>
      </Grid>
    )
  })
}

const TiersList = (props) => {
  const {classes, groupedEdgesByTier, i18nPlugin: {t}} = props
  return Object.keys(groupedEdgesByTier).map((tier, index) => {
    const specs = groupedEdgesByTier[tier].sort((a, b) => a.node.context.spec > b.node.context.spec)
    return (
      <Grid item key={index} xs={12} sm={6}>
        <ExpansionPanel defaultExpanded elevation={2}>
          <Divider/>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <h3 style={{margin: 0}}>{t(tier)}</h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.type}>
            <Grid container direction={'column'}>
              <List component={'nav'} disablePadding={true}>
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
  const {data, i18nPlugin, location} = props
  const {allSitePage: {group: simulationTypes}} = data
  const {t} = i18nPlugin
  const {wowClass} = simulationTypes[0].edges[0].node.context
  const pageTitle = startCase(t(wowClass))
  return (
    <Layout location={location}>
      <div>
        <Helmet title={`${pageTitle} | ${data.site.siteMetadata.title}`}/>
        <h1>{pageTitle}</h1>
        <p><Trans>Here you can retrieve all the simulations we run. You will find more details about what they
          represents
          in their respective pages. They are updated on a daily basis.</Trans></p>
        <Grid container spacing={16}>
          {
            simulationTypes.map((group, index) => {
              const {simulationType} = group.edges[0].node.context
              return (
                <Grid item key={index} xs={12} lg={6}>
                  <h2 style={{textAlign: 'center'}}>{capitalize(t(simulationType))}</h2>
                  <Grid container spacing={8} alignItems={'flex-start'} justify={'center'}>
                    <TiersList {...props}
                      groupedEdgesByTier={groupBy(group.edges, (edge) => edge.node.context.tier)}/>
                  </Grid>
                </Grid>
              )
            })
          }
        </Grid>
      </div>
    </Layout>
  )
}

WowClassTemplate.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withStyles(styles)(WowClassTemplate)

export const query = graphql`
  query WowClassTemplate($lang: String!, $wowClass: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {ne: null}, fightStyle: {eq: "1t"}}}, sort: {fields: [context___order, context___spec, context___variation], order: ASC}) {
      group(field: context___simulationType) {
        edges {
          node {
            id
            path
            context {
              wowClass
              simulationType
              tier
              spec
              variation
              buildTime
            }
          }
        }
      }
    }
  }
`
