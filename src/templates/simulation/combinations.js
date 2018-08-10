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

import { wowAzeriteLabel } from '../../utils/wow'

import RelatedSimulations from './common/related'
import Metas from './common/metas'

const RANK_INDEX = 0
const TALENTS_INDEX = 1
const SPECIAL_INDEX = 3
const DPS_INDEX = 4
const DPSDIFF_INDEX = 5

const indexFromColumnId = {
  rank: RANK_INDEX,
  talents: TALENTS_INDEX,
  special: SPECIAL_INDEX,
  dps: RANK_INDEX,
  dpsPercentageDifference: RANK_INDEX
}

function getSorting (order, orderBy) {
  const orderByIndex = indexFromColumnId[orderBy]
  return order === 'desc' ? (a, b) => b[orderByIndex] - a[orderByIndex] : (a, b) => a[orderByIndex] - b[orderByIndex]
}

// TODO: Move into the components for i18n
const columnData = [
  {id: 'rank', numeric: true, label: '#'},
  {id: 'talents', numeric: false, label: 'Talents'},
  {id: 'special', numeric: false, label: 'Azerite Powers'},
  {id: 'dps', numeric: true, label: 'DPS'},
  {id: 'dpsPercentageDifference', numeric: true, label: '% Diff'},
]

class EnhancedTableHead extends React.Component {
  createSortHandler (orderBy) {
    return (event) => { this.props.onRequestSort(event, orderBy) }
  }

  render () {
    const {order, orderBy} = this.props
    return (
      <TableHead>
        <TableRow>
          {columnData.map((column) => {
            const {id, numeric, label} = column
            return (
              <TableCell key={id} numeric={numeric} sortDirection={orderBy === id ? order : false}>
                {
                  numeric &&
                  <TableSortLabel active={orderBy === id} direction={order} onClick={this.createSortHandler(id)}>
                    {label}
                  </TableSortLabel>
                }
                {!numeric && label}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
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
      results: null,
      order: 'asc',
      orderBy: 'rank',
      selected: [],
      page: 0,
      rowsPerPage: 15
    }

    this.getResults = this.getResults.bind(this)
    this.handleRequestSort = this.handleRequestSort.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
  }

  async getResults () {
    const response = await window.fetch(this.state.filepath)
    const {results} = await response.json()

    const maxDPS = results[0][DPS_INDEX]
    for (let row of results) {
      // WowHead links
      const specials = row[SPECIAL_INDEX].split(', ')
      let specialsLink = []
      for (let special of specials) {
        specialsLink.push(special !== 'None' ? wowAzeriteLabel(special, true) : 'None')
      }
      row[SPECIAL_INDEX] = specialsLink.join('|')
      // Add the % Diff
      row.push((100 * row[DPS_INDEX] / maxDPS - 100).toFixed(2))
    }

    this.setState({results})
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

  render () {
    const {data, i18nPlugin, pathContext} = this.props
    const {filePath, order, orderBy, page, results, rowsPerPage} = this.state
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
        {results &&
        <div>
          <Table>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort}/>
            <TableBody>
              {results
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row[RANK_INDEX]}>
                    <TableCell component="th" scope="row" numeric>{row[RANK_INDEX]}</TableCell>
                    <TableCell>{row[TALENTS_INDEX]}</TableCell>
                    <TableCell dangerouslySetInnerHTML={{__html: row[SPECIAL_INDEX]}}/>
                    <TableCell numeric>{row[DPS_INDEX]}</TableCell>
                    <TableCell numeric>{row[DPSDIFF_INDEX]}</TableCell>
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
