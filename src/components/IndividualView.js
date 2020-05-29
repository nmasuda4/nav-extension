import React, { useEffect } from "react"
import { Spin, Icon } from "antd"
import Main from "./Main"
/* global tableau */

const antIcon = (
  <Icon type='loading' style={{ fontSize: 36, marginBottom: 12 }} spin />
)

const IndividualView = ({
  initialListLoad,
  setInitialListLoad,
  tableConfig,
  setTableConfig,
  defaultTableData,
  setDefaultTableData,
}) => {
  useEffect(() => {
    if (initialListLoad === false) {
      // fetch data from tableau worksheets
      tableau.extensions.initializeAsync().then(() => {
        // fetch config
        const fetchConfig = async () => {
          const result = await tableau.extensions.dashboardContent.dashboard.worksheets
            .find((worksheet) => worksheet.name === "tableConfig")
            .getDataSourcesAsync()
            .then((datasources) => {
              let datasource = datasources.find(
                (datasource) => datasource.name === "Table Configuration"
              )

              return datasource
                .getLogicalTablesAsync()
                .then((logicalTables) => {
                  return datasource.getLogicalTableDataAsync(
                    logicalTables[0].id
                  )
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

          setTableConfig(result)
          return result
        }

        // fetch data
        const fetchData = async (cols) => {
          const defaultCols = cols
            .filter((col, i) => {
              return col.Default === "Yes"
            })
            .map((d) => d.Name)

          const result = await tableau.extensions.dashboardContent.dashboard.worksheets
            .find((worksheet) => worksheet.name === "tableData")
            .getDataSourcesAsync()
            .then((datasources) => {
              let dataSource = datasources.find(
                (datasource) => datasource.name === "he_adv_survey"
              )

              return dataSource
                .getLogicalTablesAsync()
                .then((logicalTables) => {
                  return dataSource.getLogicalTableDataAsync(
                    logicalTables[0].id,
                    {
                      columnsToInclude: defaultCols,
                      maxRows: 100000,
                    }
                  )
                })
            })

          setDefaultTableData(result)
        }

        fetchConfig()
          .then((cols) => fetchData(cols))
          .then(() => setInitialListLoad(true))
      })
    }
  }, [initialListLoad])

  return (
    <div style={{ width: "100%" }}>
      {initialListLoad ? (
        <Main
          tableConfig={tableConfig}
          defaultTableData={defaultTableData}
        ></Main>
      ) : (
        <div
          className='w-100 d-flex justify-content-center align-items-center'
          style={{ height: "80vh" }}
        >
          <div>
            <Spin tip='Retrieving Donors...' indicator={antIcon}></Spin>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndividualView
