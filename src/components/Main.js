import React, { useState, useEffect } from "react"
import { Button, Tooltip } from "antd"
import XLSX from "xlsx"
import { saveAs } from "file-saver"
import assignColumns from "../TableConfig"
import CustomTable from "./CustomTable"
import CustomModal from "./CustomModal"

const Main = ({ tableConfig, tableData }) => {
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const [width, setWidth] = useState(0)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [targetKeys, setTargetKeys] = useState([])
  const [isModal, setIsModal] = useState(false)

  const [exportData, setExportData] = useState([])
  const [exportHeaders, setExportHeaders] = useState([])
  const tempC = []
  const tempDS = []

  const tableHeaders = tableConfig.map(d => d.Name)

  var wb = XLSX.utils.book_new()

  wb.Props = {
    Title: "Alumni",
    Subject: "Test",
    Author: "Guest",
    CreatedDate: new Date()
  }

  wb.SheetNames.push("Alumni")

  /* global tableau */

  useEffect(() => {
    fetchData()
  }, [])

  // functions
  const fetchData = () => {
    tableData.columns.map((column, i) => {
      const ind = tableHeaders.indexOf(column.properFieldName)
      if (ind !== -1) {
        return tempC.push(assignColumns(column, tableConfig[ind], i))
      }
      if (ind === -1) {
        return console.log(
          `Error! Make sure all columns are equal in the configuration csv and tableData worksheet. Check ${column.properFieldName}.`
        )
      }
    })

    const colNames = tempC
      .sort((a, b) => {
        return a.indexOriginal - b.indexOriginal
      })
      .map((d, i) => {
        return d.dataIndex
      })

    // format data for Custom Table
    tableData.data.map((row, i) => {
      tempDS.push({ key: i })
      return row.map((d, index) => {
        return (tempDS[i][colNames[index]] = d.formattedValue.trim())
      })
    })

    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const active = tempC.filter(d => d.default)

    setWidth(
      active.length > 0 ? active.map(d => d.width).reduce(reducer) + 200 : 200
    )

    setColumns(tempC)
    setDataSource(tempDS)
    setTargetKeys(active.sort((a, b) => a.order - b.order).map(d => d.title))
    setExportData(tempDS)
    setLoading(false)
  }

  const showModal = () => {
    setIsModal(true)
  }

  const handleExport = () => {
    // const columns = targetKeys.map(d => d.toLowerCase())
    console.log("selectedKeys", selectedKeys)
    console.log("targetKeys", targetKeys)
    console.log("exportData", exportData)

    const finalExport = exportData.map(row => {
      const result = {}
      const keys = Object.keys(row)
      targetKeys
        .filter(d => keys.indexOf(d.toLowerCase().replace(/\s+/g, "")) !== -1)
        .map(key => {
          return (result[key] = row[key.toLowerCase().replace(/\s+/g, "")])
        })

      return result
    })

    const test = Object.keys(finalExport[0])

    var ws = XLSX.utils.json_to_sheet(finalExport, { header: test })
    wb.Sheets["Alumni"] = ws
    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length) //convert s to arrayBuffer
      var view = new Uint8Array(buf) //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff //convert to octet
      return buf
    }
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "advancement.xlsx"
    )
  }

  const handleKeyChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys)

    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const active = columns.filter(d => nextTargetKeys.includes(d.title))
    setWidth(
      active.length > 0 ? active.map(d => d.width).reduce(reducer) + 200 : 200
    )
  }

  const handleSelectedChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
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

          <CustomTable
            dataSource={dataSource}
            columns={columns}
            width={width}
            targetKeys={targetKeys}
            setExportData={setExportData}
            setExportHeaders={setExportHeaders}
          ></CustomTable>
        </div>
      )}
    </>
  )
}

export default Main
