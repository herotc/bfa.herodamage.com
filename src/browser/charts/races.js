import load from 'little-loader'
import { formatNumber, excludeEmptyRows, removeLoading, initOverlay } from './common'

export async function racesInit (reportPath, chartTitle, templateDPS) {
  if (!window.google) {
    await new Promise((resolve, reject) => {
      load('https://www.gstatic.com/charts/loader.js', (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  const google = window.google

  const drawChart = async () => {
    const response = await window.fetch(`${reportPath}.json`)
    const json = await response.json()
    const data = new google.visualization.arrayToDataTable(json.results)

    // Sort
    data.sort({column: 1, desc: true})

    // Add Tooltip and Style column
    data.insertColumn(2, {type: 'string', role: 'tooltip', 'p': {'html': true}})
    data.insertColumn(3, {type: 'string', role: 'style'})

    const AllianceRaces = ['Human', 'Dwarf', 'Night Elf', 'Gnome', 'Worgen', 'Draenei', 'Lightforged Draenei', 'Void Elf']
    const HordeRaces = ['Orc', 'Troll', 'Tauren', 'Goblin', 'Undead', 'Blood Elf', 'Highmountain Tauren', 'Nightborne']

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

    // Get content width (to force a min-width on mobile, can't do it in css because of the overflow)
    const googleChartElement = document.getElementById('google-chart')
    const content = googleChartElement.parentElement
    const contentWidth = content.innerWidth - window.getComputedStyle(content, null).getPropertyValue('padding-left') * 2

    // Set chart options
    const chartWidth = document.documentElement.clientWidth >= 768 ? contentWidth : 700
    const bgColor = '#303030'
    const textColor = '#ffffff'
    const options = {
      title: chartTitle,
      backgroundColor: bgColor,
      chartArea: {
        top: 50,
        bottom: 100,
        left: 150,
        right: 50
      },
      hAxis: {
        gridlines: {
          count: 20
        },
        format: '#.#\'%\'',
        textStyle: {
          color: textColor
        },
        title: '% DPS Gain',
        titleTextStyle: {
          color: textColor
        },
        viewWindowMode: 'maximized',
        viewWindow: {
          min: 0
        }
      },
      vAxis: {
        textStyle: {
          fontSize: 12,
          color: textColor
        },
        titleTextStyle: {
          color: textColor
        }
      },
      annotations: {
        highContrast: false,
        stem: {
          color: 'transparent',
          length: -12
        },
        textStyle: {
          fontName: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: '0.875rem',
          bold: true,
          color: bgColor,
          auraColor: 'transparent'
        }
      },
      titleTextStyle: {
        color: textColor
      },
      tooltip: {
        isHtml: true
      },
      legend: {
        position: 'none'
      },
      isStacked: true,
      width: chartWidth
    }

    // Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.BarChart(googleChartElement)
    chart.draw(excludeEmptyRows(data), options)
    removeLoading()
    initOverlay(options.chartArea)
  }

  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)
}
