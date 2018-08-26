// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { refreshWowheadLinks } from '../../utils/wow'
import { getResultsStates } from './combinations/get-results-states'
// Components
import Helmet from 'react-helmet'
import { Trans } from '@lingui/react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import RelatedSimulations from './common/related'
import Metas from './common/metas'
import Filters from './combinations/filters'
import EnhancedTableHead from './combinations/enhanced-table-head'

class CombinationsSimulationTemplate extends React.Component {
  constructor (props) {
    super(props)

    const {data, pageContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name} = pageContext
    this.state = {
      filepath: `${reportsPath}${name}.json`,
      multiTargets: false,
      results: null,
      order: 'desc',
      orderBy: 'dps',
      page: 0,
      rowsPerPage: 15,
      selectedAzeritePowers: null,
      talentsTree: null
    }

    this.handleAzeritePowerSelect = this.handleAzeritePowerSelect.bind(this)
    this.handleTalentSelect = this.handleTalentSelect.bind(this)
    this.handleRequestSort = this.handleRequestSort.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  async getResults () {
    const state = await getResultsStates(this.props, this.state.filepath)
    this.setState(state)
  }

  handleAzeritePowerSelect (event, spellName) {
    event.preventDefault()

    const {selectedAzeritePowers} = this.state
    selectedAzeritePowers[spellName].selected = !selectedAzeritePowers[spellName].selected
    this.setState({selectedAzeritePowers})
  }

  handleTalentSelect (event, rowId, colId) {
    event.preventDefault()

    const {talentsTree} = this.state
    const row = talentsTree[rowId]
    const talent = row[colId]

    // Prevent the talent to be unselected if it's disabled
    if (!talent.disabled) {
      // Prevent the talent to be unselected if it's the last one on this row
      let inactiveCount = 0
      for (let col = 0; col < 3; col++) {
        if (col === colId) continue
        const talent = row[col]
        if (talent.disabled || !talent.selected) {
          inactiveCount += 1
        }
      }
      if (inactiveCount < 2) {
        talent.selected = !talent.selected
        this.setState({talentsTree})
      }
    }
  }

  isValidResult (result) {
    const {talents, azeritePower} = result
    const {selectedAzeritePowers, talentsTree} = this.state
    if (talents) {
      for (let row = 0; row < talents.length; row++) {
        const talentChar = parseInt(talents.charAt(row))
        if (talentChar !== 0) {
          const col = talentChar - 1
          if (!talentsTree[row][col].selected) return false
        }
      }
    }
    if (azeritePower && azeritePower !== 'None') {
      if (!selectedAzeritePowers[azeritePower].selected) return false
    }
    return true
  }

  handleRequestSort (event, orderBy) {
    let order = 'desc'
    if (this.state.orderBy === orderBy && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({order, orderBy})
  }

  handleChangePage (event, page) {
    this.setState({page})
  }

  handleChangeRowsPerPage (event) {
    this.setState({rowsPerPage: event.target.value})
  }

  componentDidMount () {
    this.getResults().catch((err) => { console.error(err) })
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    refreshWowheadLinks()
  }

  render () {
    const {data, i18nPlugin, pageContext} = this.props
    const {filePath, multiTargets, order, orderBy, page, results, rowsPerPage, selectedAzeritePowers, talentsTree} = this.state
    const {t, wowheadLink} = i18nPlugin
    const {buildTime, fightStyle, gitRevision, name, simulationType, spec, targetError, templateDPS, tier, variation, version} = pageContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={filePath}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans><b>Information:</b><br/>These simulations are all based on the default profiles from
          SimulationCraft.<br/>You can consider everything within the target error DPS range to be mostly equal and
          requiring a more detailed investigation.</Trans></p>
        <p><Trans>The purpose of these simulations is to get a general idea of how different setups will compare with
          each other and not to promote any definitive best builds. Several variables (like different trinkets, WF/TF
          or
          ingame situations) are not taken into account. This is why you, as always, should <u><b>simulate your own
            character</b></u> to find your optimal setup.</Trans></p>
        <p><Trans>The fact that generic azerite powers are not included is intended. The goal of such simulations is
          not
          to find the best possibilities out of millions possible combinations but rather let you know <b>if a given
            azerite power alone could impact talents choices</b>. One of the caveat is that it could happen with
          further
          stacks or a combination of two of them, those cases are not covered there. You might find more information
          about such events on your class resources.</Trans></p>
        <p><Trans>Of course, you can also check how the talents compare each other without any azerite power (just
          unselect all of them). Which is ideal in case you are using only generic azerite powers for example.</Trans>
        </p>
        <RelatedSimulations data={data} fightStyle={fightStyle} simulationType={simulationType} spec={spec}
          t={t} tier={tier} variation={variation}/>
        <Metas buildTime={buildTime} gitRevision={gitRevision}
          targetError={targetError} templateDPS={templateDPS} version={version}/>
        {!results &&
        <CircularProgress id="results-loader" color="secondary"/>}
        {results &&
        <div>
          <Filters name={name} onAzeritePowerSelect={this.handleAzeritePowerSelect}
            onTalentSelect={this.handleTalentSelect}
            selectedAzeritePowers={selectedAzeritePowers} talentsTree={talentsTree} wowheadLink={wowheadLink}/>
          <p style={{textAlign: 'center'}}>
            <span className={'azerite-tier2'}>Inner Ring</span>
            &nbsp;|&nbsp;
            <span className={'azerite-tier3'}>Outer Ring</span>
          </p>
          <Table>
            <EnhancedTableHead multiTargets={multiTargets} onRequestSort={this.handleRequestSort}
              order={order} orderBy={orderBy}/>
            <TableBody>
              {results
                .filter((result) => this.isValidResult(result))
                .sort(order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((result) => (
                  <TableRow key={`${name}-${result.rank}`} hover>
                    <TableCell component="th" scope="row" numeric>{result.rank}</TableCell>
                    <TableCell dangerouslySetInnerHTML={{__html: result.talentsLabel}}/>
                    <TableCell dangerouslySetInnerHTML={{__html: result.azeritePowerLabel}}/>
                    <TableCell numeric>{result.dps}</TableCell>
                    {multiTargets && <TableCell numeric>{result.bossDPS}</TableCell>}
                    <TableCell numeric>{result.dpsPercentageDifference}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>

          </Table>
          <TablePagination component="div" count={results.length}
            rowsPerPage={rowsPerPage} page={page} rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100, 1000]}
            backIconButtonProps={{'aria-label': 'Previous Page'}} nextIconButtonProps={{'aria-label': 'Next Page'}}
            onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
        </div>}
      </div>
    )
  }
}

CombinationsSimulationTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
}

export default CombinationsSimulationTemplate

export const query = graphql`
  query CombinationsSimulation($lang: String!, $wowClass: String!, $simulationType: String!, $tier: String!, $spec: String!, $fightStyle: String!, $variation: String!) {
    site {
      siteMetadata {
        reportsPath
      }
    }
    relatedSimulationTypes: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, tier: {eq: $tier}, spec: {eq: $spec}, fightStyle: {eq: $fightStyle}, variation: {eq: $variation}}}, sort: {fields: [context___order], order: ASC}) {
      edges {
        node {
          path
          context {
            simulationType
          }
        }
      }
    }
    relatedTiers: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, spec: {eq: $spec}, fightStyle: {eq: $fightStyle}, variation: {eq: $variation}}}, sort: {fields: [context___tier], order: ASC}) {
      edges {
        node {
          path
          context {
            tier
          }
        }
      }
    }
    relatedSpecs: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, fightStyle: {eq: $fightStyle}}}, sort: {fields: [context___spec, context___variation], order: ASC}) {
      edges {
        node {
          path
          context {
            spec
            variation
          }
        }
      }
    }
    relatedFightStyles: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, spec: {eq: $spec}, variation: {eq: $variation}}}, sort: {fields: [context___fightStyle], order: ASC}) {
      edges {
        node {
          path
          context {
            fightStyle
          }
        }
      }
    }
  }
`
