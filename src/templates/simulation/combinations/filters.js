// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getAzeriteClassName } from '../../../utils/wow/ui'
// Components
import { Trans } from '@lingui/react'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Grid from '@material-ui/core/Grid'

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  width: 100%
`

const Talent = styled(Grid)`
  && {
    opacity: ${({ disabled, selected }) => selected ? '1' : disabled ? '0.05' : '0.5'};
  }
`

const AzeritePower = styled(Grid)`
  && {
    opacity: ${({ selected }) => selected ? '1' : '0.5'};
  }
`

class Filters extends React.Component {
  createAzeritePowerSelectHandler (azeritePower) {
    return (event) => { this.props.onAzeritePowerSelect(event, azeritePower) }
  }

  createTalentSelectHandler (rowId, colId) {
    return (event) => { this.props.onTalentSelect(event, rowId, colId) }
  }

  render () {
    const { name, azeritePowersFilter, talentsTree, wowheadLink } = this.props
    return (
      <Grid item xs={12}>
        <ExpansionPanel defaultExpanded elevation={1}>
          <Divider/>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <h3 style={{ margin: 0 }}><Trans>Filters (Click to toggle them on/off from the results)</Trans></h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ padding: '8px 0 24px 0' }}>
            <Container>
              <div>
                {Object.values(talentsTree).map((row, rowId) => (
                  <Grid container key={`${name}-${rowId}`} spacing={8} style={{ width: '135px' }}>
                    {Object.values(row).map(({ disabled, selected, spellId }, colId) => (
                      <Talent item key={`${name}-${rowId}-${colId}`} xs={4} disabled={disabled} selected={selected}
                        onClick={this.createTalentSelectHandler(rowId, colId)}>
                        <a href={`${wowheadLink}spell=${spellId}`} data-wh-rename-link="false"
                          data-wh-icon-size="medium"/>
                      </Talent>
                    ))}
                  </Grid>
                ))}
              </div>
              <Grid container spacing={8} style={{ width: '185px' }}>
                {Object.values(azeritePowersFilter).map((azeritePower) => {
                  const { selected, spellName, spellId, tier, classesId } = azeritePower
                  return (
                    <AzeritePower item key={`${name}-${spellName}`} xs={12} selected={selected}
                      onClick={this.createAzeritePowerSelectHandler(spellName)}>
                      <a href={`${wowheadLink}spell=${spellId}`} className={getAzeriteClassName(tier, classesId)}>
                        <span>{spellName}</span>
                      </a>
                    </AzeritePower>
                  )
                })}
              </Grid>
            </Container>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    )
  }
}

Filters.propTypes = {
  name: PropTypes.string.isRequired,
  onAzeritePowerSelect: PropTypes.func.isRequired,
  onTalentSelect: PropTypes.func.isRequired,
  azeritePowersFilter: PropTypes.object.isRequired,
  talentsTree: PropTypes.object.isRequired,
  wowheadLink: PropTypes.string.isRequired
}

export default Filters
