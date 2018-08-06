let combinationsData
let maxDPS = 0
let hasBossDPS = false
let setSelect, legoSelect

hd.combinationsUpdate = function combinationsUpdate () {
  if (!combinationsData) { return }
  const entriesPerPage = 15
  const filterTalents = document.getElementById('combinations-table-filter-talents').value
  const filterTalentsRegex = new RegExp('^' + filterTalents.replace(new RegExp('[x*]', 'ig'), '[0-3]'), 'i')
  const filterSets = setSelect.val()
  const filterLegendaries = legoSelect.val()
  const combinationsRows = $.grep(combinationsData, function (columns) {
    if (filterTalents !== '' && !filterTalentsRegex.test(columns[1])) { return false }
    if (filterSets.indexOf(columns[2]) < 0) { return false }
    const legos = columns[3].split(', ')
    if ($(filterLegendaries).filter(legos).length < legos.length && columns[3] !== 'None') { return false }
    return true
  })
  const tableData = document.getElementById('combinations-table-data')
  const $tableNav = $(document.getElementById('combinations-table-nav'))
  if ($tableNav.data('twbs-pagination')) { $tableNav.twbsPagination('destroy') }
  $tableNav.twbsPagination({
    totalPages: Math.max(1, Math.ceil(combinationsRows.length / entriesPerPage)),
    visiblePages: 3,
    onPageClick: function (event, page) {
      let html = ''
      combinationsRows.slice((page - 1) * entriesPerPage, page * entriesPerPage).forEach(function (columns) {
        html += '<tr>'
        html += '<td>' + columns[0] + '</td>'
        html += '<td>' + columns[1] + '</td>'
        html += '<td>' + columns[2] + '</td>'
        html += '<td>' + columns[3] + '</td>'
        html += '<td>' + formatNumber(columns[4]) + '</td>'
        if (hasBossDPS) {
          html += '<td>'
          if (columns.length === 6) { html += formatNumber(columns[5]) }
          html += '</td>'
        }
        if (columns[4] === maxDPS) { html += '<td></td>' } else { html += '<td>' + (100 * columns[4] / maxDPS - 100).toFixed(1) + '%</td>' }
        html += '</tr>'
      })
      tableData.innerHTML = html
    }
  })
}

hd.combinationsInit = function combinationsInit (reportPath) {
  $.get('/' + reportPath, function (data) {
    const sets = []
    const legos = []
    let beltIdx

    combinationsData = data.results
    combinationsData.forEach(function (columns) {
      if ($.inArray(columns[2], sets) < 0) {
        sets.push(columns[2])
      }
      columns[3].split(', ').forEach(function (lego) {
        if (lego !== 'None' && $.inArray(lego, legos) < 0) {
          legos.push(lego)
        }
      })
      if (columns[4] > maxDPS) { maxDPS = columns[4] }
      if (!hasBossDPS && columns.length === 6) { hasBossDPS = true }
    })
    // Sets
    sets.sort().reverse()
    sets.forEach(function (set) {
      document.getElementById('combinations-table-filter-sets').insertAdjacentHTML('beforeend', '<option>' + set + '</option>')
    })
    setSelect = $('#combinations-table-filter-sets')
    setSelect.selectpicker('val', sets)
    setSelect.selectpicker('refresh')
    // Legendaries
    legos.sort()
    legos.forEach(function (lego) {
      document.getElementById('combinations-table-filter-legendaries').insertAdjacentHTML('beforeend', '<option>' + lego + '</option>')
    })
    legoSelect = $('#combinations-table-filter-legendaries')
    // Don't show Cinidaria by default
    beltIdx = legos.indexOf('Cinidaria')
    if (beltIdx > -1) {
      legos.splice(beltIdx, 1)
    }
    legoSelect.selectpicker('val', legos)
    legoSelect.selectpicker('refresh')
    const headerSection = document.getElementById('combinations-table-headers')
    const filterSection = document.getElementById('combinations-table-filters')
    // Boss DPS
    if (hasBossDPS) {
      headerSection.insertAdjacentHTML('beforeend', '<th>Boss DPS</th>')
      filterSection.insertAdjacentHTML('beforeend', '<th></th>')
    }
    // Add relative % comparison column
    headerSection.insertAdjacentHTML('beforeend', '<th></th>')
    filterSection.insertAdjacentHTML('beforeend', '<th></th>')
    hd.combinationsUpdate()
    removeLoading()
  })
}
