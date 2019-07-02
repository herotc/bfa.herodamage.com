import load from 'little-loader'

import { refreshWowheadLinks, wowAzeriteEssenceLabel, wowAzeriteLabel, wowTrinketLabel } from '../../utils/wow/ui'
import { excludeEmptyRows, formatNumber, initOverlay, removeLoading } from './common'
import { getTalentsMappingFromSpellIds } from '../../utils/wow/core'

/**
 *
 * @param data
 * @param templateDPS
 * @returns {*}
 */
function processRacesData (data, templateDPS) {
  // Sort
  let maxDPS = 0
  for (let row = 0; row < data.getNumberOfRows(); row++) {
    const dps = data.getValue(row, 1)
    if (dps > maxDPS) maxDPS = dps
  }
  data.sort({ column: 1, desc: true })

  // Add Tooltip and Style column
  data.insertColumn(2, { type: 'string', role: 'tooltip', 'p': { 'html': true } })
  data.insertColumn(3, { type: 'string', role: 'style' })

  const AllianceRaces = ['Human', 'Dwarf', 'Night Elf', 'Night Elf (Day)', 'Night Elf (Night)', 'Gnome', 'Worgen', 'Draenei', 'Lightforged Draenei', 'Void Elf', 'Dark Iron Dwarf', 'Kul Tiran']
  const HordeRaces = ['Orc', 'Troll', 'Tauren', 'Goblin', 'Undead', 'Blood Elf', 'Highmountain Tauren', 'Nightborne', 'Mag\'har Orc', 'Zandalari Troll (Pa\'ku)', 'Zandalari Troll (Kimbul)', 'Zandalari Troll (Bwonsamdi)']

  // Process data
  for (let row = 0; row < data.getNumberOfRows(); row++) {
    let raceStyle = ''
    const rowName = data.getValue(row, 0)
    if (AllianceRaces.includes(rowName)) {
      raceStyle = 'stroke-width: 3; stroke-color: #1144AA; color: #3366CC'
    } else if (HordeRaces.includes(rowName)) {
      raceStyle = 'stroke-width: 3; stroke-color: #770000; color: #AA0000'
    } else {
      raceStyle = 'stroke-width: 3; stroke-color: #4d4d4d; color: #808080'
    }
    const curAbsVal = data.getValue(row, 1)
    const curVal = 100 * ((templateDPS + curAbsVal) / templateDPS - 1)
    const tooltip = `
      <div class="chart-tooltip">
          <b>${rowName}</b><br/>
          <b>Increase:</b> ${formatNumber(curVal.toFixed(2))}% (${formatNumber(curAbsVal)} )
      </div>`
    data.setValue(row, 3, raceStyle)
    data.setValue(row, 2, tooltip)
    data.setValue(row, 1, curVal)
  }

  return { data, maxDPS }
}

/**
 *
 * @param simulationType
 * @param data
 * @param wowClass
 * @param spec
 * @param talentsMapping
 * @param templateDPS
 * @param lang
 * @returns {*}
 */
function processData (simulationType, data, wowClass, spec, talentsMapping, templateDPS, lang) {
  // Sorting
  const sortCol = data.addColumn('number')
  let maxDPS = 0
  for (let row = 0; row < data.getNumberOfRows(); row++) {
    let dps = 0
    for (let col = 1; col < sortCol; col++) {
      if (data.getValue(row, col) > dps) dps = data.getValue(row, col)
    }
    if (dps > maxDPS) maxDPS = dps
    data.setValue(row, sortCol, dps)
  }
  data.sort([{ column: sortCol, desc: true }])
  data.removeColumn(sortCol)

  // Add Tooltip columns
  for (let col = 2; col <= data.getNumberOfColumns(); col += 2) {
    data.insertColumn(col, { type: 'string', role: 'tooltip', 'p': { 'html': true } })
  }

  // Calculate Differences
  for (let row = 0; row < data.getNumberOfRows(); row++) {
    let prevVal = 0
    let prevAbsVal = 0
    for (let col = 1; col < data.getNumberOfColumns(); col += 2) {
      const curAbsVal = data.getValue(row, col)
      const absStepVal = curAbsVal - prevAbsVal
      const curVal = 100 * ((templateDPS + curAbsVal) / templateDPS - 1)
      const stepVal = curVal - prevVal
      const tooltip = `
        <div class="chart-tooltip">
          <b>${data.getValue(row, 0).split('--')[0]}<br/> ${simulationType === 'azerite-stacks' ? 'Stack' : 'Item Level'} ${data.getColumnLabel(col)}</b><br/>
          <b>Total:</b> ${formatNumber(curVal.toFixed(2))} % (${formatNumber(curAbsVal.toFixed())})<br/>
          <b>Increase:</b> ${formatNumber(stepVal.toFixed(2))}% (${formatNumber(absStepVal.toFixed())} )
        </div>`
      data.setValue(row, col + 1, tooltip)
      data.setValue(row, col, stepVal)
      prevVal = curVal > prevVal ? curVal : prevVal
      prevAbsVal = curAbsVal > prevAbsVal ? curAbsVal : prevAbsVal
    }
  }

  // Remove labels from data to add interactive ones in HTML
  const labels = []
  switch (simulationType) {
    case 'azerite-levels':
    case 'azerite-stacks':
      for (let row = 0; row < data.getNumberOfRows(); row++) {
        const wowLabel = data.getValue(row, 0)
        labels.push(wowAzeriteLabel(wowLabel, wowClass, spec, talentsMapping, lang))
        data.setValue(row, 0, '')
      }
      break
    case 'essences':
      for (let row = 0; row < data.getNumberOfRows(); row++) {
        const wowLabel = data.getValue(row, 0)
        labels.push(wowAzeriteEssenceLabel(wowLabel, wowClass, spec, talentsMapping, lang))
        data.setValue(row, 0, '')
      }
      break
    case 'trinkets':
      for (let row = 0; row < data.getNumberOfRows(); row++) {
        const wowLabel = data.getValue(row, 0)
        labels.push(wowTrinketLabel(wowLabel, wowClass, spec, talentsMapping, lang))
        data.setValue(row, 0, '')
      }
      break
  }
  const interactiveLabels = document.getElementById('google-chart-labels')
  for (let label of labels) {
    interactiveLabels.innerHTML += label
  }

  return { data, maxDPS }
}

/**
 *
 * @param pageContext
 * @param chartTitle
 * @param lang
 * @returns {Promise<void>}
 */
export async function stackedChart (pageContext, chartTitle, lang) {
  if (!window.google) {
    await new Promise((resolve, reject) => {
      load('https://www.gstatic.com/charts/loader.js', (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }
  const google = window.google
  const googleChartElement = document.getElementById('google-chart')

  const { resultsRaw, simulationType, spec, templateTalents, templateDPS, wowClass } = pageContext
  const results = JSON.parse(resultsRaw)
  const talentsMapping = getTalentsMappingFromSpellIds(templateTalents)

  const drawChart = () => {
    const rawData = new google.visualization.arrayToDataTable(results)

    // Process data
    let rawDataProcessed
    switch (simulationType) {
      case 'races':
        rawDataProcessed = processRacesData(rawData, templateDPS)
        break
      case 'azerite-levels':
      case 'azerite-stacks':
      case 'essences':
      case 'trinkets':
        rawDataProcessed = processData(simulationType, rawData, wowClass, spec, talentsMapping, templateDPS, lang)
    }
    refreshWowheadLinks()
    const { data, maxDPS } = rawDataProcessed

    // Compute the horizontal axis stacks value
    const maxPercentageGain = Math.floor(100 * ((templateDPS + maxDPS) / templateDPS - 1))
    const maxPercentageGainHAxis = maxPercentageGain % 2 === 0 ? maxPercentageGain : maxPercentageGain + 1
    const hAxisStacks = []
    switch (simulationType) {
      case 'races':
        // A gridline every 0.5%
        for (let i = 1; i <= maxPercentageGainHAxis * 2; i++) {
          hAxisStacks.push(i * 0.5)
        }
        break
      case 'azerite-levels':
      case 'azerite-stacks':
      case 'essences':
      case 'trinkets':
        // A gridline every 2%
        for (let i = 1; i <= maxPercentageGainHAxis / 2; i++) {
          hAxisStacks.push(i * 2)
        }
    }

    // Get content width (to force a min-width on mobile, can't do it in css because of the overflow)
    const content = googleChartElement.parentElement
    const contentWidth = content.innerWidth - window.getComputedStyle(content, null).getPropertyValue('padding-left') * 2

    // Set chart options
    const chartWidth = document.documentElement.clientWidth >= 768 ? contentWidth : 700
    const bgColor = '#303030'
    const textColor = 'white'
    const options = {
      title: chartTitle,
      backgroundColor: bgColor,
      height: 130 + results.length * 25.5,
      width: chartWidth,
      isStacked: simulationType !== 'races',
      chartArea: {
        top: 50,
        bottom: 100,
        right: 100,
        left: 410
      },
      fontName: '"Roboto", "Helvetica", "Arial", sans-serif',
      titleTextStyle: {
        fontSize: 18,
        color: textColor
      },
      vAxis: {
        textStyle: {
          fontSize: 14,
          color: textColor
        }
      },
      hAxis: {
        gridlines: {
          count: hAxisStacks.length
        },
        format: '#.#\'%\'',
        textStyle: {
          fontSize: 14,
          color: textColor
        },
        ticks: hAxisStacks,
        title: '% DPS Gain',
        titleTextStyle: {
          fontSize: 18,
          color: textColor
        },
        viewWindowMode: 'maximized',
        viewWindow: {
          min: 0
        }
      },
      legend: {
        position: simulationType === 'races' ? 'none' : 'right',
        textStyle: {
          fontSize: 14,
          color: textColor
        }
      },
      tooltip: {
        isHtml: true
      }
    }

    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.BarChart(googleChartElement)
    chart.draw(excludeEmptyRows(data), options)
    removeLoading()
    initOverlay(options.chartArea)
  }

  google.charts.load('current', { 'packages': ['corechart'] })
  google.charts.setOnLoadCallback(drawChart)
}
