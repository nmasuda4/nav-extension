import React, { useState, useEffect } from "react"
import { Button, Tooltip, Tag } from "antd"
import XLSX from "xlsx"
import { saveAs } from "file-saver"
import assignColumns from "../TableConfig"
import CustomTable from "./CustomTable"
import CustomModal from "./CustomModal"
import { fetchNewData, getSelectedColumnsConfig } from "../functions/helpers"
/* global tableau */

const Main = ({ tableConfig, defaultTableData }) => {
  const [loading, setLoading] = useState(true)
  const [reloading, setReloading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const [width, setWidth] = useState(0)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [targetKeys, setTargetKeys] = useState([])
  const [isModal, setIsModal] = useState(false)

  const [exportData, setExportData] = useState([])
  const [exportHeaders, setExportHeaders] = useState([])
  const tempDS = []

  //const allTableHeaders = tableConfig.map((d) => d.Name)
  // const defaulttableHeaders = tableConfig
  //   .filter((col, i) => {
  //     return col.Default === "Yes"
  //   })
  //   .map((d) => d.Name)

  var wb = XLSX.utils.book_new()

  wb.Props = {
    Title: "Alumni",
    Subject: "Test",
    Author: "Guest",
    CreatedDate: new Date(),
  }

  wb.SheetNames.push("Alumni")

  useEffect(() => {
    // default only actions
    const fetchData = () => {
      // format config for Custom Table
      const tempC = []
      const promise = tableConfig.map((d, i) => {
        return tempC.push(assignColumns(d, i))
      })

      // wait for map to finish
      Promise.all(promise).then(function (results) {
        const defaultColumns = tempC.filter((d) => d.default)
        const colNames = defaultColumns.map((d) => d.fieldname)

        // format data for Custom Table (defautls only)
        defaultTableData.data.map((row, i) => {
          // for each donor
          tempDS.push({ key: i })
          return row.map((d, index) => {
            const tableauValue =
              colNames[index] !== "Donor ID"
                ? d.formattedValue.trim()
                : d.nativeValue
            return (tempDS[i][colNames[index]] = tableauValue)
          })
        })

        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        // const active = tempC.filter((d) => d.default)

        // for table width
        setWidth(
          defaultColumns.length > 0
            ? colNames.map((d) => d.width).reduce(reducer) + 200
            : 200
        )

        setColumns(tempC)
        setDataSource(tempDS)
        setTargetKeys(colNames)
        setExportData(tempDS)
        setLoading(false)
      })
    }

    fetchData()
  }, [])

  // functions

  const showModal = () => {
    setIsModal(true)
  }

  const handleExport = () => {
    // const columns = targetKeys.map(d => d.toLowerCase())
    // console.log("selectedKeys", selectedKeys)
    // console.log("targetKeys", targetKeys)
    // console.log("exportData", exportData)

    const finalExport = exportData.map((row) => {
      const result = {}
      const keys = Object.keys(row)
      targetKeys
        .filter((d) => keys.indexOf(d.toLowerCase().replace(/\s+/g, "")) !== -1)
        .map((key) => {
          return (result[key] = row[key.toLowerCase().replace(/\s+/g, "")])
        })

      return result
    })

    const test = Object.keys(finalExport[0])

    var ws = XLSX.utils.json_to_sheet(finalExport, { header: test })
    wb.Sheets["Alumni"] = ws
    var wbout = XLSX.write(wb, { bookType: "csv", type: "binary" })
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length) //convert s to arrayBuffer
      var view = new Uint8Array(buf) //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff //convert to octet
      return buf
    }
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "advancement.csv"
    )
  }

  // const fetchNewData = async (fetchColumns) => {
  //   fetchColumns.push("DonorID")

  //   const result = await tableau.extensions.dashboardContent.dashboard.worksheets
  //     .find((worksheet) => worksheet.name === "tableData")
  //     .getDataSourcesAsync()
  //     .then((datasources) => {
  //       let dataSource = datasources.find(
  //         (datasource) => datasource.name === "he_adv_survey"
  //       )

  //       return dataSource.getUnderlyingDataAsync({
  //         columnsToInclude: fetchColumns,
  //         maxRows: 0,
  //       })

  //       // return dataSource.getLogicalTablesAsync().then((logicalTables) => {
  //       //   return dataSource.getLogicalTableDataAsync(logicalTables[0].id, {
  //       //     columnsToInclude: fetchColumns,
  //       //     // maxRows: 100000,
  //       //   })
  //       // })
  //     })

  //   // format data for Custom Table (defautls only)
  //   result.data.map((row, i) => {
  //     // for each donor
  //     tempDS.push({ key: i })
  //     return row.map((d, index) => {
  //       return (tempDS[i][fetchColumns[index]] = d.formattedValue.trim())
  //     })
  //   })

  //   return tempDS

  //   // setDefaultTableData(result)
  // }

  const appendData = (newData) => {
    let returnedTarget = dataSource.map((item, i) =>
      Object.assign({}, item, newData[i])
    )
    return returnedTarget
  }

  const handleSelectedChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  const handleKeyChange = (nextTargetKeys, direction, moveKeys) => {
    const fetchColumns = nextTargetKeys.filter((x) => !targetKeys.includes(x))

    setTargetKeys(nextTargetKeys)
  }

  const handleOk = () => {
    setReloading(true)
    setIsModal(false)
    const promise = getSelectedColumnsConfig(tableConfig, targetKeys)
    console.log("promise", promise)
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    setWidth(
      promise.length > 0
        ? promise.map((d) => d.width).reduce(reducer) + 200
        : 200
    )
    console.log("started")

    // adding columns
    fetchNewData(promise, dataSource)
      .then((res) => setDataSource(res))
      .then(() => setReloading(false))

    console.log("targetKeys", targetKeys)
  }

  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <div style={{ margin: "0px 16px" }}>
          <CustomModal
            columns={columns}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            handleKeyChange={handleKeyChange}
            handleSelectedChange={handleSelectedChange}
            isModal={isModal}
            setIsModal={setIsModal}
            handleOk={handleOk}
          ></CustomModal>
          <div className='tableButtonContainer'>
            <div className='d-flex flex-row justify-content-around'>
              <Tooltip
                placement='left'
                overlayStyle={{ fontSize: 12 }}
                title='Add or Remove Columns'
              >
                <Button
                  id='addremove'
                  type='primary'
                  icon='edit'
                  shape='circle'
                  size='default'
                  onClick={showModal}
                ></Button>
              </Tooltip>

              <Tooltip
                placement='left'
                overlayStyle={{ fontSize: 12 }}
                title='Export Selection as CSV'
              >
                <Button
                  id='download'
                  type='primary'
                  icon='download'
                  shape='circle'
                  size='default'
                  onClick={handleExport}
                ></Button>
              </Tooltip>
            </div>
          </div>
          <div className='d-flex' style={{ paddingLeft: 8 }}>
            <Tag color='#2db7f5'>Data Appends</Tag>
            <Tag color='#f50'>Survey Data</Tag>
          </div>
          {!reloading ? (
            <CustomTable
              dataSource={dataSource}
              columns={columns}
              width={width}
              targetKeys={targetKeys}
              setExportData={setExportData}
              setExportHeaders={setExportHeaders}
            ></CustomTable>
          ) : (
            <div>wait...</div>
          )}
        </div>
      )}
    </>
  )
}

export default Main
