import React from 'react'
import PropTypes from 'prop-types'

import Helmet from 'react-helmet'
import { Trans } from '@lingui/react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import { refreshWowheadLinks, wowAzeriteLabel, wowTalentsLabel } from '../../utils/wow'

import RelatedSimulations from './common/related'
import Metas from './common/metas'

// TODO: Move into the components for easier i18n
const columnData = [
  {id: 'rank', label: '#', numeric: true, sortable: false},
  {id: 'talents', label: 'Talents', numeric: false, sortable: false},
  {id: 'special', label: 'Azerite Powers', numeric: false, sortable: false},
  {id: 'dps', label: 'DPS', numeric: true, sortable: true},
  {id: 'bossDPS', label: 'Boss DPS', numeric: true, sortable: true},
  {id: 'dpsPercentageDifference', label: '% Diff', numeric: true, sortable: false}
]

function getSorting (order, orderBy) {
  return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy]
}

class EnhancedTableHead extends React.Component {
  createSortHandler (orderBy) {
    return (event) => { this.props.onRequestSort(event, orderBy) }
  }

  render () {
    const {multiTargets, order, orderBy} = this.props
    return (
      <TableHead>
        <TableRow>
          {columnData.map((column) => {
            const {id, label, numeric, sortable} = column
            if (!multiTargets && id === 'bossDPS') return null
            return (
              <TableCell key={id} numeric={numeric} sortDirection={orderBy === id ? order : false}>
                {sortable &&
                <TableSortLabel active={orderBy === id} direction={order} onClick={this.createSortHandler(id)}>
                  {label}
                </TableSortLabel>}
                {!sortable && label}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  multiTargets: PropTypes.bool.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
}

class CombinationsSimulationTemplate extends React.Component {
  constructor (props) {
    super(props)

    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name} = pathContext
    this.state = {
      filepath: `${reportsPath}${name}.json`,
      multiTargets: false,
      results: null,
      order: 'desc',
      orderBy: 'dps',
      page: 0,
      rowsPerPage: 15
    }

    this.getResults = this.getResults.bind(this)
    this.handleRequestSort = this.handleRequestSort.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  async getResults () {
    const {i18nPlugin: {lang}, pathContext} = this.props
    const {spec, wowClass} = pathContext

    const response = await window.fetch(this.state.filepath)
    const {results: jsonResults} = await response.json()

    const results = []
    const multiTargets = jsonResults[0].length === 6
    const maxDPS = jsonResults[0][4]
    for (let row of jsonResults) {
      const talents = row[1]
      const azeritePower = row[3]
      const dps = row[4]
      const result = {
        rank: row[0],
        talents,
        azeritePower,
        dps
      }
      if (multiTargets) result.bossDPS = row[5]
      result.talentsLabel = wowTalentsLabel(talents, wowClass, spec, lang)
      result.azeritePowerLabel = azeritePower !== 'None' ? wowAzeriteLabel(azeritePower, lang) : 'None'
      result.dpsPercentageDifference = (100 * dps / maxDPS - 100).toFixed(1)
      results.push(result)
    }

    this.setState({multiTargets, results})
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
    const {data, i18nPlugin, pathContext} = this.props
    const {filePath, multiTargets, order, orderBy, page, results, rowsPerPage} = this.state
    const {t} = i18nPlugin
    const {buildTime, fightStyle, gitRevision, name, simulationType, spec, targetError, templateDPS, tier, variation, version} = pathContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={filePath}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans><b>Information:</b><br/>These simulations are all based on the default profiles from
          SimulationCraft.<br/>The target error was {targetError}% which means you can consider everything within that
          DPS range to be mostly equal and requiring a more detailed investigation.</Trans></p>
        <p><Trans>The purpose of these simulations is to get a general idea of how different setups will compare with
          each other and not to promote any definitive best builds. Several variables (like different trinkets, WF/TF or
          ingame situations) are not taken into account. This is why you, as always, should <u><b>simulate your own
            character</b></u> to find your optimal setup.</Trans></p>
        <RelatedSimulations data={data} fightStyle={fightStyle} simulationType={simulationType} spec={spec}
          t={t} tier={tier} variation={variation}/>
        <Metas buildTime={buildTime} gitRevision={gitRevision}
          targetError={targetError} templateDPS={templateDPS} version={version}/>
        {!results &&
        <CircularProgress id="results-loader" color="secondary"/>}
        <p style={{textAlign: 'center'}}>
          <span className={'azerite-tier2'}>Inner Ring</span>
          &nbsp;|&nbsp;
          <span className={'azerite-tier3'}>Outer Ring</span>
        </p>
        {results &&
        <div>
          <Table>
            <EnhancedTableHead multiTargets={multiTargets} onRequestSort={this.handleRequestSort}
              order={order} orderBy={orderBy}/>
            <TableBody>
              {results
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((result) => (
                  <TableRow key={result.rank} hover>
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
  pathContext: PropTypes.object.isRequired
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
