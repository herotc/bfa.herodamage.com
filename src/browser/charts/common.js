/**
 * Format number the US way
 * @param number
 * @returns {*}
 */
export function formatNumber (number) {
  return new Intl.NumberFormat('en-US').format(number)
}

/**
 * Remove the loading message
 */
export function removeLoading () {
  const el = document.getElementById('results-loader')
  el.parentNode.removeChild(el)
}

/**
 * Google Charts: Exclude empty rows
 * @param dataTable
 * @returns {*}
 */
export function excludeEmptyRows (dataTable) {
  const view = new window.google.visualization.DataView(dataTable)
  const rowIndexes = view.getFilteredRows([{ column: 1, value: null }])
  view.hideRows(rowIndexes)
  return view.toDataTable()
}

/**
 * Google Charts:  Put rows whereas first column match array items at the top (last item will be displayed first)
 * @param data
 * @param specialRows
 * @returns {*}
 */
export function putAtTheTop (data, specialRows) {
  let i, col, row
  for (i = 0; i < specialRows.length; i++) {
    for (row = 0; row < data.getNumberOfRows(); row++) {
      if (data.getValue(row, 0) === specialRows[i]) {
        // Do nothing if it's already the first row
        if (row !== 0) {
          // Insert an empty row at the top, copy the wanted row properties in the first one
          data.insertRows(0, 1) // Be careful, it shiftes the index
          row = row + 1
          data.setRowProperties(0, data.getRowProperties(row))
          for (col = 0; col < data.getNumberOfColumns(); col++) {
            data.setValue(0, col, data.getValue(row, col))
          }
          data.removeRow(row)
        }
        break
      }
    }
  }
  return data
}

/**
 *
 * @param chartArea
 */
export function initOverlay (chartArea) {
  const chartEl = document.getElementById('google-chart')
  const overlayEl = document.getElementById('chart-overlay')
  chartEl.onmousemove = function (e) {
    const bounds = chartEl.getBoundingClientRect()
    const areaLeft = bounds.left + chartArea.left + window.scrollX
    const areaRight = bounds.right - chartArea.right + window.scrollX
    const areaTop = bounds.top + chartArea.top + window.scrollY
    const areaBottom = bounds.bottom - chartArea.bottom + window.scrollY
    if (e.pageX >= areaLeft && e.pageX <= areaRight && e.pageY >= areaTop && e.pageY <= areaBottom) {
      overlayEl.style.display = 'block'
      overlayEl.style.top = areaTop + 'px'
      overlayEl.style.left = e.pageX + 'px'
      overlayEl.style.height = chartEl.offsetHeight - chartArea.top - chartArea.bottom + 'px'
    } else {
      overlayEl.style.display = 'none'
    }
  }
}
