import assignColumns from "../TableConfig"
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
    .then((dataTable) => {
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
    })
  return result
}

// fetch default data
export const fetchDefaultData = async (cols, rowLimit) => {
  const defaultCols = cols
    .filter((col, i) => {
      return col.Default === "Yes"
    })
    .map((d) => d.Name)

  const result = await tableau.extensions.dashboardContent.dashboard.worksheets
    .find((worksheet) => worksheet.name === "0")
    .getDataSourcesAsync()
    .then((datasources) => {
      let dataSource = datasources.find((datasource) => datasource.name === "0")

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
  console.log("selectedColumns :>> ", selectedColumns)
  console.log("tableConfig :>> ", tableConfig)
  const tempC = []
  selectedColumns.map((column, i) => {
    const ind = tableConfig.map((d) => d.Name).indexOf(column)
    if (ind !== -1) {
      return tempC.push(assignColumns(tableConfig[ind], i))
    }
  })
  console.log("tempC", tempC)
  return tempC
}

// fetch new data
export const fetchNewData = async (
  selectecColumnsConfig,
  currentDataSource
) => {
  const groupByArray = function (xs, key) {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key]
      let el = rv.find((r) => r && r.key === v)
      if (el) {
        el.values.push(x["Name"])
      } else {
        rv.push({ key: v, values: [x["Name"]] })
      }
      return rv
    }, [])
  }

  // need to loop for all data sources
  const temp = await groupByArray(selectecColumnsConfig, "indexSource")
  const uniqueDataSources = temp.filter((d) => d.key !== "0")

  //also filter out columns in existing datasources

  const functionWithPromise = (columns, indexSource) => {
    //a function that returns a promise
    return new Promise(function (resolve, reject) {
      const result = tableau.extensions.dashboardContent.dashboard.worksheets
        .find((worksheet) => worksheet.name === indexSource)
        .getDataSourcesAsync()
        .then((datasources) => {
          let dataSource = datasources.find(
            (datasource) => datasource.name === indexSource
          )

          return dataSource.getLogicalTablesAsync().then((logicalTables) => {
            return dataSource.getLogicalTableDataAsync(logicalTables[0].id, {
              columnsToInclude: ["Donor ID", ...columns],
              // maxRows: 10,
            })
          })
        })
      resolve(result)
    })
  }

  const anAsyncFunction = async (columns, indexSource) => {
    return functionWithPromise(columns, indexSource)
  }

  const formatNewData = async (newDataTables) => {
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
                columnNames[index] !== "Donor ID"
                  ? d.formattedValue.trim()
                  : d.nativeValue
              return (dat[i][columnNames[index]] = tableauValue)
            })
          })
          return dat
        }
        return tempDS()
      })
    )
  }

  const appendFormattedData = (formattedDataTables) => {
    // console.log("formattedDataTables", formattedDataTables)
    // console.log("currentDataSource", currentDataSource)
    const dataArray = [currentDataSource, ...formattedDataTables]

    const mergeById2 = (dataArray) => {
      // sort all by Donor ID
      dataArray.forEach((arr) => {
        arr.sort((a, b) => {
          return a["Donor ID"] - b["Donor ID"]
        })
      })

      return dataArray[0].map((item, i) =>
        Object.assign({}, item, dataArray[1][i], dataArray[2][i])
      )
    }

    return mergeById2(dataArray)
  }

  const getData = async () => {
    return await Promise.all(
      uniqueDataSources.map((d, i) => anAsyncFunction(d.values, d.key))
    )
  }

  // append data
  return getData()
    .then((newDataTables) => {
      return formatNewData(newDataTables)
    })
    .then((res) => appendFormattedData(res))
  // .then((res) => console.log("res", res))
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
