import assignColumns from "../TableConfig"
import XLSX from "xlsx"
import { saveAs } from "file-saver"
/* global tableau */

export const fetchConfig = async (sheetName, dataSourceName) => {
  const result = await tableau.extensions.dashboardContent.dashboard.worksheets
    .find((worksheet) => worksheet.name === sheetName)
    .getDataSourcesAsync()
    .then((datasources) => {
      let datasource = datasources.find(
        (datasource) => datasource.name === dataSourceName
      )

      return datasource.getLogicalTablesAsync().then((logicalTables) => {
        return datasource.getLogicalTableDataAsync(logicalTables[0].id)
      })
    })

    .then(
      (dataTable) => {
        const tableNames = dataTable.columns.map((column, i) => {
          return column.fieldName
        })

        const table = dataTable.data.map((d, i) => {
          const tableValues = []
          const result = {}

          d.map((e, i) => {
            return tableValues.push(e.value)
          })

          tableNames.forEach((name, i) => (result[name] = tableValues[i]))

          return result
        })
        return table
      },
      function (err) {
        // called on any error, such as when the extension
        // doesn’t have full data permission
        console.log("error", err)
      }
    )
  return result
}

// fetch default data
export const fetchDefaultData = async (cols, rowLimit) => {
  const defaultCols = cols
    .filter((col, i) => {
      return col.dataSource === "Default"
    })
    .map((d) => d.name)

  const result = await tableau.extensions.dashboardContent.dashboard.worksheets
    .find((worksheet) => worksheet.name === "Default")
    .getDataSourcesAsync()
    .then((datasources) => {
      let dataSource = datasources.find(
        (datasource) => datasource.name === "Default"
      )

      return dataSource.getLogicalTablesAsync().then((logicalTables) => {
        return dataSource.getLogicalTableDataAsync(logicalTables[0].id, {
          columnsToInclude: defaultCols,
          maxRows: rowLimit,
        })
      })
    })
  return result
}

// get new column config
export const getSelectedColumnsConfig = (tableConfig, selectedColumns) => {
  // get columns then append datasources based on master config
  // console.log("selectedColumns :>> ", selectedColumns)
  // console.log("tableConfig :>> ", tableConfig)
  const tempC = []
  selectedColumns.map((column, i) => {
    const ind = tableConfig.map((d) => d.Name).indexOf(column)
    if (ind !== -1) {
      return tempC.push(assignColumns(tableConfig[ind], i))
    }
  })

  return tempC
}

export const groupByTransferList = function (xs, key) {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key]
    let el = rv.find((r) => r && r.key === v)
    if (el) {
      el.children.push({ key: x["name"], title: x["title"] })
    } else {
      rv.push({
        key: v,
        title: v,
        checkable: false,
        selectable: false,
        children: [{ key: x["name"], title: x["title"] }],
      })
    }
    return rv
  }, [])
}

// fetch new data
export const fetchNewData = async (
  selectecColumnsConfig,
  currentDataSource,
  ID
) => {
  function equalSets(as, bs) {
    if (as.size !== bs.size) return false
    for (var a of as) if (!bs.has(a)) return false
    return true
  }

  const appendFormattedData = (currentDataSource, formattedDataTables, ID) => {
    // validate here
    const uniqueCurrentDataSource = new Set(
      currentDataSource.map((d) => d[ID].value)
    )

    // original order
    currentDataSource.map((d, i) => (d.sortIndex = i))

    const mergeById = (currentDataSource, formattedDataTables, ID) => {
      // sort current table
      currentDataSource.sort((a, b) =>
        a[ID].value < b[ID].value ? -1 : a[ID].value > b[ID].value ? 1 : 0
      )

      // sort new tables
      for (let i = 0, l = formattedDataTables.length; i < l; i++) {
        formattedDataTables[i].sort((a, b) =>
          a[ID].value < b[ID].value ? -1 : a[ID].value > b[ID].value ? 1 : 0
        )

        const unique = new Set(formattedDataTables[i].map((d) => d[ID].value))

        if (equalSets(uniqueCurrentDataSource, unique)) {
          for (let j = 0, l = currentDataSource.length; j < l; j++) {
            currentDataSource[j] = {
              ...formattedDataTables[i][j],
              ...currentDataSource[j],
            }
          }
        } else {
          console.log("inconsistent data sets")
        }
      }
      return currentDataSource.sort((a, b) => a.sortIndex - b.sortIndex)
    }

    return mergeById(currentDataSource, formattedDataTables, ID)
  }

  const groupByArray = function (xs, key) {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key]
      let el = rv.find((r) => r && r.key === v)
      if (el) {
        el.values.push(x["name"])
      } else {
        rv.push({ key: v, values: [x["name"]] })
      }
      return rv
    }, [])
  }

  // need to loop for all data sources
  const temp = await groupByArray(selectecColumnsConfig, "dataSource")
  const uniqueDataSources = temp.filter((d) => d.key !== "Default")

  // also filter out columns in existing datasources
  const functionWithPromise = (columns, dataSource, ID) => {
    //a function that returns a promise
    return new Promise(function (resolve, reject) {
      const result = tableau.extensions.dashboardContent.dashboard.worksheets
        .find((worksheet) => worksheet.name === dataSource)
        .getDataSourcesAsync()
        .then((datasources) => {
          let dataSourceFound = datasources.find(
            (datasource) => datasource.name === dataSource
          )

          return dataSourceFound
            .getLogicalTablesAsync()
            .then((logicalTables) => {
              return dataSourceFound.getLogicalTableDataAsync(
                logicalTables[0].id,
                {
                  columnsToInclude: [ID, ...columns],
                }
              )
            })
        })

      resolve(result)
      reject(new Error("fail"))
    })
  }

  const anAsyncFunction = async (columns, dataSource, ID) => {
    return functionWithPromise(columns, dataSource, ID)
  }

  const formatNewData = async (newDataTables, ID) => {
    // for each dataTable
    return await Promise.all(
      newDataTables.map(async (dataTable) => {
        let dat = []
        const columnNames = dataTable.columns.map((d) => d.fieldName)

        for (let i = 0, l = dataTable.data.length; i < l; i++) {
          const temp = {}
          for (let j = 0, l = dataTable.data[i].length; j < l; j++) {
            temp[columnNames[j]] = dataTable.data[i][j]
          }
          dat.push(temp)
        }

        return dat
      })
    )
  }

  const getData = async (ID) => {
    return await Promise.all(
      uniqueDataSources.map((d, i) => anAsyncFunction(d.values, d.key, ID))
    )
  }

  // append data
  return getData(ID)
    .then((newDataTables) => {
      return formatNewData(newDataTables, ID)
    })
    .then((res) => {
      return appendFormattedData(currentDataSource, res, ID)
    })
}

export const appendDefaultData = (currentDataSource, defaultData, ID) => {
  const mergeById2 = (currentDataSource, defaultData, ID) => {
    let merged = []

    currentDataSource.map((d, i) => {
      merged.push({ ...d })

      defaultData.map((ds) => {
        Object.assign(
          merged[i],
          ds.find((itmInner) => itmInner[ID] === currentDataSource[i][ID])
        )
      })
    })

    return merged
  }

  return mergeById2(currentDataSource, defaultData, ID)
}

export const handleExport = (currentTargetKeys, exportData) => {
  var wb = XLSX.utils.book_new()

  wb.Props = {
    Title: "Donor List",
    Subject: "Hanover Research Export",
    Author: "Guest",
    CreatedDate: new Date(),
  }

  wb.SheetNames.push("Donor List")

  // console.log("export currentTargetKeys :>> ", currentTargetKeys)
  // console.log("exportData :>> ", exportData)

  const finalExport = exportData.map((row) => {
    const result = {}

    currentTargetKeys.map((d) => {
      let val = typeof row[d] === "object" ? row[d].formattedValue : row[d]
      return (result[d] = val)
    })

    return result
  })

  const keys = Object.getOwnPropertyNames(finalExport[0])
  // console.log("keys :>> ", keys)
  // console.log("finalExport :>> ", finalExport)
  var ws = XLSX.utils.json_to_sheet(finalExport, { header: keys })
  wb.Sheets["Donor List"] = ws
  var wbout = XLSX.write(wb, { bookType: "csv", type: "binary" })
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length) //convert s to arrayBuffer
    var view = new Uint8Array(buf) //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff //convert to octet
    return buf
  }
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "donorlist.csv"
  )
}

export const appendTooltip = (tag) => {
  switch (tag) {
    case "Institutional Data":
      return "These data fields are drawn directly from the data you provided to Hanover."
      break
    case "Augmented Data":
      return "These data fields are the appended data fields from the third-party vendor. The information in these fields is provided entirely by the third-party vendor."
      break
    case "Updated Data":
      return "These data fields are based on fields like contact information that were initially provided by you and have been updated with information from the third-party data vendor."
      break
    case "Data Append Flags":
      return "These data fields summarize the results of the third-party data append and help flag the records that were updated in that process."
      break
    case "Hanover":
      return "These data fields are computed by Hanover based on a combination of inputs."
      break
    case "Survey Data":
      return "These data fields are drawn from the donor survey conducted by Hanover on your behalf."
      break
    default:
      break
  }
}
