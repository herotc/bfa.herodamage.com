import {formatNumber, excludeEmptyRows, removeLoading, initOverlay} from './common'

export function racesInit (reportPath, chartTitle, templateDPS) {
  const google = window.google

  const drawChart = async () => {
    const response = await window.fetch(`/${reportPath}`,)
    const json = response.json()
    const data = new google.visualization.arrayToDataTable(json.results)
    let row

    // Sort
    data.sort({column: 1, desc: true})

    // Add Tooltip and Style column
    data.insertColumn(2, {type: 'string', role: 'tooltip', 'p': {'html': true}})
    data.insertColumn(3, {type: 'string', role: 'style'})

    const AllianceRaces = ['Human', 'Dwarf', 'Night Elf', 'Gnome', 'Worgen', 'Draenei', 'Lightforged Draenei', 'Void Elf']
    const HordeRaces = ['Orc', 'Troll', 'Tauren', 'Goblin', 'Undead', 'Blood Elf', 'Highmountain Tauren', 'Nightborne']

    // Process data
    for (row = 0; row < data.getNumberOfRows(); row++) {
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
      const tooltip = '<div class="chart-tooltip"><b>' + rowName +
        '</b><br><b>Increase:</b> ' + formatNumber(curVal.toFixed(2)) + '% (' + formatNumber(curAbsVal) + ')</div>'
      data.setValue(row, 3, raceStyle)
      data.setValue(row, 2, tooltip)
      data.setValue(row, 1, curVal)
    }

    // Get content width (to force a min-width on mobile, can't do it in css because of the overflow)
    const content = document.getElementById('simulations-metas')
    const contentWidth = content.innerWidth - window.getComputedStyle(content, null).getPropertyValue('padding-left') * 2

    // Set chart options
    const chartWidth = document.documentElement.clientWidth >= 768 ? contentWidth : 700
    const bgColor = '#222222'
    const textColor = '#cccccc'
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
          fontName: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 10,
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
    const chart = new google.visualization.BarChart(document.getElementById('google-chart'))
    chart.draw(excludeEmptyRows(data), options)
    removeLoading()
    initOverlay(options.chartArea)
  }

  google.charts.load('current', {'packages': ['corechart']})
  google.charts.setOnLoadCallback(drawChart)
}
