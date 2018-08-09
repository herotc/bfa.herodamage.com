import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans } from '@lingui/react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import GoogleAd from '../../components/google-ad'

const RANK_INDEX = 0
const TALENTS_INDEX = 1
const SPECIAL_INDEX = 3
const DPS_INDEX = 4

const indexFromColumnId = {
  rank: RANK_INDEX,
  talents: TALENTS_INDEX,
  special: SPECIAL_INDEX,
  dps: DPS_INDEX,
  dpsPercentageDifference: DPS_INDEX
}

function getSorting (order, orderBy) {
  const orderByIndex = indexFromColumnId[orderBy]
  return order === 'desc' ? (a, b) => b[orderByIndex] - a[orderByIndex] : (a, b) => a[orderByIndex] - b[orderByIndex]
}

const columnData = [
  {id: 'rank', numeric: true, label: '#'},
  {id: 'talents', numeric: false, label: 'Talents'},
  {id: 'special', numeric: false, label: 'Azerite Powers'},
  {id: 'dps', numeric: true, label: 'DPS'},
  {id: 'dpsPercentageDifference', numeric: true, label: '% Diff'},
]

class EnhancedTableHead extends React.Component {
  createSortHandler (property) {
    return (event) => { this.props.onRequestSort(event, property) }
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
          }, this)}
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

    this.state = {
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
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name} = pathContext
    const response = await window.fetch(`${reportsPath}${name}.json`)
    const json = await response.json()
    this.setState({results: json.results})
  }

  handleRequestSort (event, property) {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
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
    const {data, i18nPlugin, location, pathContext} = this.props
    const {t} = i18nPlugin
    const {name, fightStyle, targetError} = pathContext
    const {results, order, orderBy, page, rowsPerPage} = this.state
    const maxDPS = results && results[0][DPS_INDEX]
    return (
      <div>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans><b>Information:</b><br/>These simulations are all based on the default profiles from
          SimulationCraft.<br/>The target error was {targetError}% which means you can consider everything within that
          DPS range to be mostly equal and requiring a more detailed investigation.</Trans></p>
        <p><Trans>The purpose of these simulations is to get a general idea of how different setups will compare with
          each other and not to promote any definitive best builds. Several variables (like different trinkets, WF/TF or
          ingame situations) are not taken into account. This is why you, as always, should <u><b>simulate your own
            character</b></u> to find your optimal setup.</Trans></p>
        <div style={{textAlign: 'center'}}>
          {
            data.allSitePage.edges.map((edge, index) => {
              const {node} = edge
              const {fightStyle: nodeFightStyle} = node.context
              return (
                <Button key={index} variant="contained" color="primary" disabled={fightStyle === nodeFightStyle}
                  component={Link} to={node.path} style={{margin: 8}}>
                  {t(nodeFightStyle)}
                </Button>
              )
            })
          }
        </div>
        <GoogleAd location={location} type="inarticle"/>
        {
          !results &&
          <CircularProgress id="results-loader" color="secondary"/>
        }
        {
          results &&
          <div>
            <Table>
              <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={this.handleRequestSort}/>
              <TableBody>
                {results
                  .sort(getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const rowId = row[RANK_INDEX]
                    const rowDPS = row[DPS_INDEX]
                    return (
                      <TableRow key={rowId}>
                        <TableCell component="th" scope="row" numeric>{rowId}</TableCell>
                        <TableCell>{row[TALENTS_INDEX]}</TableCell>
                        <TableCell>{row[SPECIAL_INDEX]}</TableCell>
                        <TableCell numeric>{rowDPS}</TableCell>
                        <TableCell numeric>{(100 * rowDPS / maxDPS - 100).toFixed(2)}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>

            </Table>
            <TablePagination component="div" count={results.length} rowsPerPage={rowsPerPage} page={page}
              backIconButtonProps={{'aria-label': 'Previous Page'}} nextIconButtonProps={{'aria-label': 'Next Page'}}
              onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
          </div>
        }
      </div>
    )
  }
}

CombinationsSimulationTemplate.propTypes = {
  data: PropTypes.object,
  i18nPlugin: PropTypes.object,
  location: PropTypes.object,
  pathContext: PropTypes.object
}

export default CombinationsSimulationTemplate

export const query = graphql`
  query CombinationsSimulation($lang: String!, $wowClass: String!, $spec: String!, $simulationType: String!, $tier: String!, $variation: String!) {
    site {
      siteMetadata {
        reportsPath
      }
    }
    allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, spec: {eq: $spec}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, variation: {eq: $variation}}}) {
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
