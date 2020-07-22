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
          // console.log("datasources searched :>> ", datasources)
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
        // 1. get column names
        const columnNames = await dataTable.columns.map((column) => {
          return column.fieldName
        })
        // 2. convert to this format first
        const tempDS = () => {
          const dat = []
          dataTable.data.map((row, i) => {
            dat.push({})

            // for each donor
            return row.map((d, index) => {
              const tableauValue =
                ["int", "float"].includes(dataTable.columns[index].dataType) &&
                dataTable.columns[index].fieldName !== ID
                  ? d
                  : d.formattedValue.trim()
              return (dat[i][columnNames[index]] = tableauValue)
            })
          })
          return dat
        }
        return tempDS()
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
      console.log("newDataTables :>> ", newDataTables)
      return formatNewData(newDataTables, ID)
    })
    .then((res) => {
      // console.log("formatNewData (res) :>> ", res)
      return appendFormattedData(currentDataSource, res, ID)
    })
}

export const appendFormattedData = (
  currentDataSource,
  formattedDataTables,
  ID
) => {
  //const dataArray = [currentDataSource, ...formattedDataTables]

  const mergeById2 = (currentDataSource, formattedDataTables, ID) => {
    // console.log("currentDataSource :>> ", currentDataSource)
    // console.log("formattedDataTables :>> ", formattedDataTables)

    let merged = []

    currentDataSource.map((d, i) => {
      merged.push({ ...d })

      formattedDataTables.map((ds, di) => {
        Object.assign(
          merged[i],
          ds.find((itmInner) => itmInner[ID] === currentDataSource[i][ID])
        )
      })
    })

    return merged
  }

  return mergeById2(currentDataSource, formattedDataTables, ID)
}

export const appendDefaultData = (currentDataSource, defaultData, ID) => {
  // const dataArray = [currentDataSource, defaultData]

  // console.log("dataArray for appending :>> ", dataArray)

  const mergeById2 = (currentDataSource, defaultData, ID) => {
    // sort all by Donor ID
    // dataArray.forEach((arr) => {
    //   arr.sort((a, b) => {
    //     return a["DonorID"] - b["DonorID"]
    //   })
    // })
    // console.log("currentDataSource :>> ", currentDataSource)

    // const temp = currentDataSource.map(d => d.)

    //
    // const numberOfDataSources = dataArray.length - 1
    // return dataArray[0].map((item, i) => {
    //   if (numberOfDataSources === 1) {
    //     return Object.assign({}, item, dataArray[1][i])
    //   } else {
    //     console.log("Sorry, missing data")
    //   }
    // })

    // if(currentTargetKeys ) {} else{
    // console.log("currentDataSource :>> ", currentDataSource)
    // console.log("defaultData :>> ", defaultData)

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

// export const formatDataTable = (dataTable) => {
//   const formattedData = []
//   dataTable.data.map((row, i) => {
//     // for each donor
//     formattedData.push({ key: i })
//     return row.map((d, index) => {
//       return (formattedData[i][fetchColumns[index]] = d.formattedValue.trim())
//     })
//   })

//   return formattedData
// }
