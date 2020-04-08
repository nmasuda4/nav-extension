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
  tableData,
  setTableData
}) => {
  useEffect(() => {
    if (initialListLoad === false) {
      // fetch data from tableau worksheets
      tableau.extensions.initializeAsync().then(() => {
        const fetchConfig = async () => {
          const result = await tableau.extensions.dashboardContent.dashboard.worksheets
            .find(worksheet => worksheet.name === "tableConfig")
            .getSummaryDataAsync()
            .then(dataTable => {
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
        }

        const fetchData = async () => {
          const result = await tableau.extensions.dashboardContent.dashboard.worksheets
            .find(worksheet => worksheet.name === "tableData")
            .getSummaryDataAsync()
            .then(dataTable => {
              function columnTitle(column) {
                return column.includes("MAX")
                  ? column.replace(/MAX|\(|\)/g, "")
                  : column
              }

              dataTable.columns.map((d, i) => {
                return (d.properFieldName = columnTitle(d.fieldName))
              })

              return dataTable
            })

          setTableData(result)
        }

        fetchConfig()
        fetchData().then(() => setInitialListLoad(true))
      })
    }
  }, [initialListLoad])

  return (
    <div
      style={{
        paddingTop: "12px",
        width: "100%"
        // maxHeight: 400,
        // height: 400
        // height: 460,
        // backgroundColor: "blue"
      }}
    >
      {initialListLoad ? (
        <Main tableConfig={tableConfig} tableData={tableData}></Main>
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
