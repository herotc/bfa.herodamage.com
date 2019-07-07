// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
// Components
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

// TODO: Move into the components for easier i18n
const columnData = [
  { id: 'rank', label: '#', numeric: true, sortable: false },
  { id: 'talents', label: 'Talents', numeric: false, sortable: false },
  { id: 'special', label: 'Azerite', numeric: false, sortable: false },
  { id: 'dps', label: 'DPS', numeric: true, sortable: true },
  { id: 'bossDPS', label: 'Boss DPS', numeric: true, sortable: true },
  { id: 'dpsPercentageDifference', label: '% Diff', numeric: true, sortable: false }
]

class EnhancedTableHead extends React.Component {
  createSortHandler (orderBy) {
    return (event) => { this.props.onRequestSort(event, orderBy) }
  }

  render () {
    const { multiTargets, order, orderBy } = this.props
    return (
      <TableHead>
        <TableRow>
          {columnData.map((column) => {
            const { id, label, numeric, sortable } = column
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

export default EnhancedTableHead
