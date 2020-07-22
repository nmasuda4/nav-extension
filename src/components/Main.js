import React, { useState, useEffect } from "react"
import { Button, Tooltip, Tag, Spin } from "antd"
import {
  LoadingOutlined,
  DownloadOutlined,
  EditOutlined,
  UndoOutlined,
} from "@ant-design/icons"
import assignColumns from "../TableConfig"
import CustomTable from "./CustomTable"
import CustomModal from "./CustomModal"
import {
  fetchNewData,
  getSelectedColumnsConfig,
  appendDefaultData,
  handleExport,
} from "../functions/helpers"

const antIcon = (
  <LoadingOutlined style={{ fontSize: 36, marginBottom: 12 }} spin />
)

const Main = ({ tableConfig, defaultTableData }) => {
  const [loading, setLoading] = useState(true)
  const [reloading, setReloading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const [width, setWidth] = useState(0)
  const [legend, setLegend] = useState()
  const [isFetchRequired, setIsFetchRequired] = useState(false)
  const [defaultData, setDefaultData] = useState()
  const [currentTargetKeys, setCurrentTargetKeys] = useState([])
  const [allTargetKeysOrder, setAllTargetKeysOrder] = useState()
  const [hasFilters, setHasFilters] = useState()
  const [modifiedColumns, setModifiedColumns] = useState()
  const [isModal, setIsModal] = useState(false)
  const [filtersToClear, setFiltersToClear] = useState([])

  const [exportData, setExportData] = useState([])
  // const [exportHeaders, setExportHeaders] = useState([])
  const tempDS = []

  var ID = tableConfig.filter((d) => d.Identifier == true)[0].Name
  var Sort = tableConfig.filter((d) => d.SortEnabled == true)[0].Name

  useEffect(() => {
    // default only actions
    const fetchData = () => {
      // format config for Custom Table
      const tempC = []
      const promise = tableConfig.map((d, i) => {
        return tempC.push(assignColumns(d, i))
      })

      // wait for map to finish
      Promise.all(promise)
        .then(function (results) {
          const uniqueDataTypes = [
            ...new Set(
              tempC
                .filter((d) => d.dataType !== "%null%")
                .map((d) => d.dataType)
            ),
          ]
          // console.log("uniqueDataTypes :>> ", uniqueDataTypes)
          // console.log("defaultTableData :>> ", defaultTableData)

          // table config results
          const tableConfigColumns = tempC.filter(
            (d) => d.dataSource === "Default"
          )
          const tableConfigNames = tableConfigColumns.map((d) => d.name)
          const allTableConfigNames = tempC.map((d) => d.name)

          // default data columns
          const defaultDataColumnNames = defaultTableData.columns.map(
            (d) => d.fieldName
          )
          // sort config columns and initialload columns
          const initialColNames = tableConfigNames.filter(
            (d) => defaultDataColumnNames.indexOf(d) > -1
          )

          // format data for Custom Table (defautls only)
          defaultTableData.data.map((row, i) => {
            // for each donor
            tempDS.push({ key: i })
            return row.map((d, index) => {
              // if (d.)
              const tableauValue =
                ["int", "float"].includes(
                  defaultTableData.columns[index].dataType
                ) && defaultTableData.columns[index].fieldName !== ID
                  ? d
                  : d.formattedValue.trim()
              if (
                tableConfigNames.indexOf(defaultDataColumnNames[index]) > -1
              ) {
                return (tempDS[i][defaultDataColumnNames[index]] = tableauValue)
              }
            })
          })

          const reducer = (accumulator, currentValue) =>
            accumulator + currentValue

          // const active = tempC.filter((d) => d.default)

          // for table width
          setWidth(
            tableConfigColumns.length > 0
              ? tableConfigColumns.map((d) => d.width).reduce(reducer) + 200
              : 200
          )

          setLegend(uniqueDataTypes)
          setColumns(tempC)
          setDataSource(tempDS)
          setDefaultData(tempDS)
          setCurrentTargetKeys(initialColNames)
          setAllTargetKeysOrder(allTableConfigNames)
          setExportData(tempDS)
        })
        .then(() => setLoading(false))
    }

    fetchData()
  }, [])

  // functions

  const showModal = () => {
    setIsModal(true)
  }

  const appendData = (newData) => {
    let returnedTarget = dataSource.map((item, i) =>
      Object.assign({}, item, newData[i])
    )
    return returnedTarget
  }

  const clearFilters = () => {
    const temp = modifiedColumns.map((column) => {
      // if() {
      column.filteredValue = null
      // }
      return column
    })

    setModifiedColumns(
      temp.sort(function (a, b) {
        return a.columnOrder - b.columnOrder
      })
    )
    setHasFilters(false)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
  }

  const handleKeyChange = (targetKeys, direction, moveKeys) => {
    const initialColNames = defaultTableData.columns.map((d) => d.fieldName)

    const isRequired = targetKeys.some(function (d) {
      return [...currentTargetKeys, ...initialColNames].indexOf(d) === -1
    })

    const orderedTargetKeys = allTargetKeysOrder.filter((d) =>
      targetKeys.includes(d)
    )

    const diff = currentTargetKeys.filter((d) => targetKeys.indexOf(d) === -1)
    console.log("diff :>> ", diff)
    console.log("modifiedColumns :>> ", modifiedColumns)

    const filteredColumns = modifiedColumns.filter((column) => {
      return column.filteredValue !== null && diff.indexOf(column.name) > -1
    })
    console.log("filteredColumns :>> ", filteredColumns)

    // filteredColumns
    setFiltersToClear(filteredColumns)
    setIsFetchRequired(isRequired)
    setCurrentTargetKeys(orderedTargetKeys)
  }

  const handleOk = () => {
    setReloading(true)
    setIsModal(false)
    const promise = getSelectedColumnsConfig(tableConfig, currentTargetKeys)

    const reducer = (accumulator, currentValue) => accumulator + currentValue
    setWidth(
      promise.length > 0
        ? promise.map((d) => d.width).reduce(reducer) + 220
        : 220
    )
    console.log("started")
    // console.log("promise :>> ", promise)

    const initialColNames = defaultTableData.columns.map((d) => d.fieldName)
    const isMergeRequired = currentTargetKeys.some(function (d) {
      return initialColNames.indexOf(d) === -1
    })
    const emptyPromise = new Promise((resolve) => {
      resolve("Success!")
    })

    console.log("modifiedColumns at handleOK:>> ", modifiedColumns)
    console.log("filtersToClear:>> ", filtersToClear)

    if (isFetchRequired) {
      // adding columns
      fetchNewData(promise, dataSource, ID)
        .then((res) => {
          setDataSource(res)
        })
        .then(setIsFetchRequired(false))
        .then(() => setReloading(false))
        .catch((err) => alert(err))
    } else {
      emptyPromise
        .then(() =>
          setModifiedColumns(
            // FIX HERE
            modifiedColumns.map((column) => {
              if (filtersToClear.includes(column)) {
                console.log("hit on filterClears :>>")
                column.filteredValue = null
              }
              return column
            })
          )
        ) //clear filter
        .then(() => {
          // setFiltersToClear()
          setReloading(false)
        })
    }
  }

  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <div style={{ margin: "0px 12px" }}>
          <CustomModal
            columns={columns}
            targetKeys={currentTargetKeys}
            // selectedKeys={selectedKeys}
            // handleSelectedChange={handleSelectedChange}
            handleKeyChange={handleKeyChange}
            isModal={isModal}
            setIsModal={setIsModal}
            handleOk={handleOk}
          ></CustomModal>
          <div className='tableButtonContainer' id='btnContainer'>
            <div className='d-flex flex-row justify-content-around'>
              {hasFilters ? (
                <Tooltip
                  placement='left'
                  overlayStyle={{ fontSize: 12 }}
                  title='Clear Filters'
                  id='clear'
                >
                  <Button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0px 6px",
                    }}
                    type='primary'
                    icon={<UndoOutlined />}
                    shape='circle'
                    size='default'
                    onClick={clearFilters}
                  ></Button>
                </Tooltip>
              ) : null}
              <Tooltip
                placement='left'
                overlayStyle={{ fontSize: 12 }}
                title='Add or Remove Columns'
              >
                <Button
                  style={{
                    margin: "0px 6px",
                  }}
                  id='addremove'
                  type='primary'
                  icon={<EditOutlined />}
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
                  style={{
                    margin: "0px 6px",
                  }}
                  id='download'
                  type='primary'
                  icon={<DownloadOutlined />}
                  shape='circle'
                  size='default'
                  onClick={() => handleExport(currentTargetKeys, exportData)}
                ></Button>
              </Tooltip>
            </div>
          </div>
          {legend ? (
            <div
              className='d-flex legend-container'
              style={{ paddingLeft: 8, paddingBottom: 12 }}
            >
              {legend.map((d) => {
                return (
                  <Tooltip
                    key={d}
                    placement='bottom'
                    overlayStyle={{ fontSize: 12 }}
                    title='placeholder'
                  >
                    <Tag
                      key={d}
                      className={`ant-tag-${d
                        .toLowerCase()
                        .replace(/\s+/g, "")}`}
                    >
                      {d}
                    </Tag>
                  </Tooltip>
                )
              })}
            </div>
          ) : null}
          {/* Institutional Data Augmented Updated Data Append Flags Survey Data */}
          {!reloading ? (
            <CustomTable
              ID={ID}
              dataSource={dataSource}
              columns={columns}
              width={width}
              targetKeys={currentTargetKeys}
              setDataSource={setDataSource}
              setExportData={setExportData}
              setHasFilters={setHasFilters}
              modifiedColumns={modifiedColumns}
              setModifiedColumns={setModifiedColumns}
              clearFilters={clearFilters}
              handleReset={handleReset}
              filtersToClear={filtersToClear}
              // setExportHeaders={setExportHeaders}
            ></CustomTable>
          ) : (
            <div
              className='w-100 d-flex justify-content-center align-items-center'
              style={{ height: 450 }}
            >
              <div>
                <Spin tip='Retrieving Donors...' indicator={antIcon}></Spin>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Main
