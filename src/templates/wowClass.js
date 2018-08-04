import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { DateFormat, Trans, withI18n } from '@lingui/react'
import { translation } from '../../plugins/gatsby-plugin-herodamage-i18n'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

const SimPanelDetails = styled(ExpansionPanelDetails)`
  flex-direction: column;
`

const TierExpansionPanel = styled(ExpansionPanel)`
  @media (min-width: 768px) {
    width: 50%;
  }
`

const SimName = styled(Typography)`
  width: 100%;
  
  span {
    float: right;
  }
`

const WowClassTemplate = (props) => {
  const {lang, data} = props
  const t = translation(lang)
  const {wowClass} = data.allSitePage.group[0].edges[0].node.context
  return (
    <div>
      <Typography variant={'headline'}>{_.capitalize(t(wowClass))}</Typography>
      {
        data.allSitePage.group.map((group, index) => {
          const {simulationType} = group.edges[0].node.context
          const groupedEdgesByTier = _.groupBy(group.edges, (edge) => edge.node.context.tier)
          return (
            <ExpansionPanel key={index} defaultExpanded={true}>
              <Divider/>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>{_.capitalize(t(simulationType))}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {
                  Object.keys(groupedEdgesByTier).map((tier, index) => {
                    const specs = groupedEdgesByTier[tier].sort((a, b) => a.node.context.spec > b.node.context.spec)
                    return (
                      <TierExpansionPanel key={index}>
                        <Divider/>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography>{tier.toLocaleUpperCase(lang)}</Typography>
                        </ExpansionPanelSummary>
                        <SimPanelDetails>
                          {
                            specs.map(({node}, index) => {
                              const {slug, spec, buildTime} = node.context
                              const buildDate = new Date(buildTime * 1000)
                              return (
                                <div key={index}>
                                  {index > 0 && <Divider/>}
                                  <List component="nav">
                                    <ListItem button component="a" href={`/${lang}${slug}`}>
                                      <SimName>
                                        {_.capitalize(t(spec))}
                                        <span>
                                          <DateFormat value={buildDate} format={{month: 'short', day: '2-digit'}}/>
                                        </span>
                                      </SimName>
                                    </ListItem>
                                  </List>
                                </div>
                              )
                            })
                          }
                        </SimPanelDetails>
                      </TierExpansionPanel>
                    )
                  })
                }
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        })
      }
    </div>
  )
}

WowClassTemplate.propTypes = {
  lang: PropTypes.string,
  data: PropTypes.object
}

export default WowClassTemplate

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
