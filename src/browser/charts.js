// Hero Damage main script
(function (hd) {
  // Avoid initializing it twice
  if (hd.hasInitialized) return;

  /*
   * Utils
  */

  // Copy the content to the clipboard
  hd.copyToClipboard = function copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId);
    copyText.select();
    document.execCommand("Copy");
  };

  /*
   * Data Helpers
  */

  // Format number the US way
  function formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
  }

  // Remove the loading message
  function removeLoading () {
    var el = document.getElementById("herodamage-loading");
    el.parentNode.removeChild(el)
  }

  // Google Charts: Exclude empty rows
  function excludeEmptyRows(dataTable) {
    var view = new google.visualization.DataView(dataTable);
    var rowIndexes = view.getFilteredRows([{column: 1, value: null}]);
    view.hideRows(rowIndexes);
    return view.toDataTable();
  }

  // Google Charts:  Put rows whereas first column match array items at the top (last item will be displayed first)
  function putAtTheTop(data, specialRows) {
    var i, col, row;
    for (i = 0; i < specialRows.length; i++) {
      for (row = 0; row < data.getNumberOfRows(); row++) {
        if (data.getValue(row, 0) == specialRows[i]) {
          // Do nothing if it's already the first row
          if ( row != 0 ) {
            // Insert an empty row at the top, copy the wanted row properties in the first one
            data.insertRows(0, 1); // Be careful, it shiftes the index
            row = row + 1;
            data.setRowProperties(0, data.getRowProperties(row));
            for (col = 0; col < data.getNumberOfColumns(); col++) {
              data.setValue(0, col, data.getValue(row, col));
            }
            data.removeRow(row);
          }
          break;
        }
      }
    }
    return data;
  }

  function initOverlay(chartArea) {
    var chartEl = document.getElementById('google-chart');
    var overlayEl = document.getElementById("chart-overlay");
    chartEl.onmousemove = function(e) {
      var bounds = chartEl.getBoundingClientRect();
      var areaLeft = bounds.left + chartArea.left + window.scrollX;
      var areaRight = bounds.right - chartArea.right + window.scrollX;
      var areaTop = bounds.top + chartArea.top + window.scrollY;
      var areaBottom = bounds.bottom - chartArea.bottom + window.scrollY;
      if (e.pageX >= areaLeft && e.pageX <= areaRight && e.pageY >= areaTop && e.pageY <= areaBottom) {
        overlayEl.style.display = "block";
        overlayEl.style.top = areaTop + "px";
        overlayEl.style.left = e.pageX + "px";
        overlayEl.style.height = chartEl.offsetHeight - chartArea.top - chartArea.bottom + "px";
      } else {
        overlayEl.style.display = "none";
      }
    }
  }

  /*
   * Data Loaders
  */

  // Combinations
  // Wrap is due to variable having function scope (could implement OOP at some point)
  (function () {
    var combinationsData;
    var maxDPS = 0;
    var hasBossDPS = false;
    var setSelect, legoSelect;

    hd.combinationsUpdate = function combinationsUpdate() {
      if (!combinationsData)
        return;
      var entriesPerPage = 15;
      var filterTalents = document.getElementById("combinations-table-filter-talents").value;
      var filterTalentsRegex = new RegExp("^" + filterTalents.replace(new RegExp("x|\\*", "ig"), "[0-3]"), "i");
      var filterSets = setSelect.val();
      var filterLegendaries = legoSelect.val();
      var combinationsRows = $.grep(combinationsData, function (columns) {
        if (filterTalents !== "" && !filterTalentsRegex.test(columns[1]))
          return false;
        if (filterSets.indexOf(columns[2]) < 0)
          return false;
        var legos = columns[3].split(", ");
        if ($(filterLegendaries).filter(legos).length < legos.length && columns[3] !== "None")
          return false;
        return true;
      });
      var tableData = document.getElementById("combinations-table-data");
      var $tableNav = $(document.getElementById("combinations-table-nav"));
      if ($tableNav.data("twbs-pagination"))
        $tableNav.twbsPagination("destroy");
      $tableNav.twbsPagination({
        totalPages: Math.max(1, Math.ceil(combinationsRows.length / entriesPerPage)),
        visiblePages: 3,
        onPageClick: function (event, page) {
          var html = "";
          combinationsRows.slice((page - 1) * entriesPerPage, page * entriesPerPage).forEach(function (columns) {
            html += "<tr>";
            html += "<td>" + columns[0] + "</td>";
            html += "<td>" + columns[1] + "</td>";
            html += "<td>" + columns[2] + "</td>";
            html += "<td>" + columns[3] + "</td>";
            html += "<td>" + formatNumber(columns[4]) + "</td>";
            if (hasBossDPS) {
              html += "<td>";
              if (columns.length === 6)
                html += formatNumber(columns[5]);
              html += "</td>";
            }
            if (columns[4] == maxDPS)
              html += "<td></td>";
            else
              html += "<td>" + (100 * columns[4] / maxDPS - 100).toFixed(1) + "%</td>";
            html += "</tr>";
          });
          tableData.innerHTML = html;
        }
      });
    };

    hd.combinationsInit = function combinationsInit(reportPath) {
      $.get("/" + reportPath, function (data) {
        var sets = [];
        var legos = [];
        var beltIdx;

        combinationsData = data.results;
        combinationsData.forEach(function (columns) {
          if ($.inArray(columns[2], sets) < 0) {
            sets.push(columns[2]);
          }
          columns[3].split(", ").forEach(function (lego) {
            if (lego !== "None" && $.inArray(lego, legos) < 0) {
              legos.push(lego);
            }
          });
          if (columns[4] > maxDPS)
            maxDPS = columns[4];
          if (!hasBossDPS && columns.length === 6)
            hasBossDPS = true;
        });
        // Sets
        sets.sort().reverse();
        sets.forEach(function (set) {
          document.getElementById("combinations-table-filter-sets").insertAdjacentHTML("beforeend", "<option>" + set + "</option>");
        });
        setSelect = $("#combinations-table-filter-sets");
        setSelect.selectpicker("val", sets);
        setSelect.selectpicker("refresh");
        // Legendaries
        legos.sort();
        legos.forEach(function (lego) {
          document.getElementById("combinations-table-filter-legendaries").insertAdjacentHTML("beforeend", "<option>" + lego + "</option>");
        });
        legoSelect = $("#combinations-table-filter-legendaries");
        // Don't show Cinidaria by default
        beltIdx = legos.indexOf("Cinidaria");
        if (beltIdx > -1) {
          legos.splice(beltIdx, 1);
        }
        legoSelect.selectpicker("val", legos);
        legoSelect.selectpicker("refresh");
        var headerSection = document.getElementById("combinations-table-headers");
        var filterSection = document.getElementById("combinations-table-filters");
        // Boss DPS
        if (hasBossDPS) {
          headerSection.insertAdjacentHTML("beforeend", "<th>Boss DPS</th>");
          filterSection.insertAdjacentHTML("beforeend", "<th></th>");
        }
        // Add relative % comparison column
        headerSection.insertAdjacentHTML("beforeend", "<th></th>");
        filterSection.insertAdjacentHTML("beforeend", "<th></th>");
        hd.combinationsUpdate();
        removeLoading();
      });
    };
  })();

  // Races
  hd.racesInit = function racesInit(reportPath, chartTitle, templateDPS) {
    function drawChart() {
      $.get("/" + reportPath, function (data) {
        var data = new google.visualization.arrayToDataTable(data.results);
        var row;

        // Sort
        data.sort({column: 1, desc: true});

        // Add Tooltip and Style column
        data.insertColumn(2, {type: "string", role: "tooltip", "p": {"html": true}});
        data.insertColumn(3, {type: "string", role: "style"});

        var AllianceRaces = ["Human", "Dwarf", "Night Elf", "Gnome", "Worgen", "Draenei", "Lightforged Draenei", "Void Elf"];
        var HordeRaces = ["Orc", "Troll", "Tauren", "Goblin", "Undead", "Blood Elf", "Highmountain Tauren", "Nightborne"];

        // Process data
        for (row = 0; row < data.getNumberOfRows(); row++) {
          var raceStyle = "";
          var rowName = data.getValue(row, 0);
          if ($.inArray(rowName, AllianceRaces) >= 0) {
            raceStyle = "stroke-width: 3; stroke-color: #1144AA; color: #3366CC";
          } else if ($.inArray(rowName, HordeRaces) >= 0) {
            raceStyle = "stroke-width: 3; stroke-color: #770000; color: #AA0000";
          } else {
            raceStyle = "stroke-width: 3; stroke-color: #4d4d4d; color: #808080";
          }
          var curAbsVal = data.getValue(row, 1);
          var curVal = 100 * ((templateDPS + curAbsVal) / templateDPS - 1);
          var tooltip = "<div class=\"chart-tooltip\"><b>" + rowName +
            "</b><br><b>Increase:</b> " + formatNumber(curVal.toFixed(2)) + "% (" + formatNumber(curAbsVal) + ")</div>";
          data.setValue(row, 3, raceStyle);
          data.setValue(row, 2, tooltip);
          data.setValue(row, 1, curVal);
        }

        // Get content width (to force a min-width on mobile, can't do it in css because of the overflow)
        var content = document.getElementById("simulations-metas");
        var contentWidth = content.innerWidth - window.getComputedStyle(content, null).getPropertyValue("padding-left") * 2;

        // Set chart options
        var chartWidth = document.documentElement.clientWidth >= 768 ? contentWidth : 700;
        var bgColor = "#222222";
        var textColor = "#cccccc";
        var options = {
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
            format: "#.#'%'",
            textStyle: {
              color: textColor
            },
            title: "% DPS Gain",
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
              color: "transparent",
              length: -12
            },
            textStyle: {
              fontName: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 10,
              bold: true,
              color: bgColor,
              auraColor: "transparent"
            }
          },
          titleTextStyle: {
            color: textColor
          },
          tooltip: {
            isHtml: true
          },
          legend: {
            position: "none"
          },
          isStacked: true,
          width: chartWidth
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById("google-chart"));
        chart.draw(excludeEmptyRows(data), options);
        removeLoading();
        initOverlay(options.chartArea);
      });
    }

    google.charts.load("current", {"packages": ["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
  };

  // Trinkets
  hd.trinketsInit = function trinketsInit(reportPath, chartTitle, templateDPS) {
    function drawChart() {
      $.get("/" + reportPath, function (data) {
        var data = new google.visualization.arrayToDataTable(data.results);
        var col, row;

        // Sorting
        var sortCol = data.addColumn("number");
        for (row = 0; row < data.getNumberOfRows(); row++) {
          var biggestTotalValue = 0;
          for (col = 1; col < sortCol; col++) {
            if (data.getValue(row, col) > biggestTotalValue)
              biggestTotalValue = data.getValue(row, col);
          }
          data.setValue(row, sortCol, biggestTotalValue);
        }
        data.sort([{column: sortCol, desc: true}]);
        data.removeColumn(sortCol);

        // Add Tooltip columns
        for (col = 2; col <= data.getNumberOfColumns(); col += 2) {
          data.insertColumn(col, {type: "string", role: "tooltip", "p": {"html": true}});
        }

        // Calculate Differences
        for (row = 0; row < data.getNumberOfRows(); row++) {
          var prevVal = 0;
          var prevAbsVal = 0;
          for (col = 1; col < data.getNumberOfColumns(); col += 2) {
            var curAbsVal = data.getValue(row, col);
            var absStepVal = curAbsVal - prevAbsVal;
            var curVal = 100 * ((templateDPS + curAbsVal) / templateDPS - 1);
            var stepVal = curVal - prevVal;
            var tooltip = "<div class=\"chart-tooltip\"><b>" + data.getValue(row, 0) +
              "<br> Item Level " + data.getColumnLabel(col) + "</b>" +
              "<br><b>Total:</b> " + formatNumber(curVal.toFixed(2)) + "% (" + formatNumber(curAbsVal.toFixed()) +
              ")<br><b>Increase:</b> " + formatNumber(stepVal.toFixed(2)) + "% (" + formatNumber(absStepVal.toFixed()) + ")</div>";
            data.setValue(row, col + 1, tooltip);
            data.setValue(row, col, stepVal);
            prevVal = curVal > prevVal ? curVal : prevVal;
            prevAbsVal = curAbsVal > prevAbsVal ? curAbsVal : prevAbsVal;
          }
        }

        // Get content width (to force a min-width on mobile, can't do it in css because of the overflow)
        var content = document.getElementById("simulations-metas");
        var contentWidth = content.innerWidth - window.getComputedStyle(content, null).getPropertyValue("padding-left") * 2;

        // Set chart options
        var chartWidth = document.documentElement.clientWidth >= 768 ? contentWidth : 700;
        var bgColor = "#222222";
        var textColor = "#cccccc";
        var options = {
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
            format: "#.#'%'",
            textStyle: {
              color: textColor
            },
            title: "% DPS Gain",
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
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById("google-chart"));
        chart.draw(excludeEmptyRows(data), options);
        removeLoading();
        initOverlay(options.chartArea);
      });
    }

    google.charts.load("current", {"packages": ["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
  };

  // Prevent further initialization
  hd.hasInitialized = true;

  window.herodamage = hd;

}(window.herodamage || {}));
