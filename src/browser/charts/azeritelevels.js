import load from 'little-loader'
import { formatNumber, excludeEmptyRows, removeLoading, initOverlay } from './common'

export async function azeriteLevelsInit (reportPath, chartTitle, templateDPS) {
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

    // Sorting
    const sortCol = data.addColumn('number')
    for (let row = 0; row < data.getNumberOfRows(); row++) {
      let biggestTotalValue = 0
      for (let col = 1; col < sortCol; col++) {
        if (data.getValue(row, col) > biggestTotalValue) { biggestTotalValue = data.getValue(row, col) }
      }
      data.setValue(row, sortCol, biggestTotalValue)
    }
    data.sort([{column: sortCol, desc: true}])
    data.removeColumn(sortCol)

    // Add Tooltip columns
    for (let col = 2; col <= data.getNumberOfColumns(); col += 2) {
      data.insertColumn(col, {type: 'string', role: 'tooltip', 'p': {'html': true}})
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
          <b>${data.getValue(row, 0)}<br/> Item Level ${data.getColumnLabel(col)}</b><br/>
          <b>Total:</b> ${formatNumber(curVal.toFixed(2))} % (${formatNumber(curAbsVal.toFixed())})<br/>
          <b>Increase:</b> ${formatNumber(stepVal.toFixed(2))}% (${formatNumber(absStepVal.toFixed())} )
        </div>`
        data.setValue(row, col + 1, tooltip)
        data.setValue(row, col, stepVal)
        prevVal = curVal > prevVal ? curVal : prevVal
        prevAbsVal = curAbsVal > prevAbsVal ? curAbsVal : prevAbsVal
      }
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
        right: 150,
        left: 200
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
      legend: {
        textStyle: {
          color: textColor
        }
      },
      titleTextStyle: {
        color: textColor
      },
      tooltip: {
        isHtml: true
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
