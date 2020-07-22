import React, { useState, useEffect } from "react"
import { Table } from "antd"
import SearchFilter from "./SearchFilter"
import ScaleFilter from "./ScaleFilter"
import PrecisionFilter from "./PrecisionFilter"
import "antd/dist/antd.css"
import "../App.css"

const CustomTable = ({
  ID,
  dataSource,
  setDataSource,
  setExportData,
  filtersToClear,
  columns,
  width,
  targetKeys,
  hasFilters,
  setHasFilters,
  modifiedColumns,
  setModifiedColumns,
  handleReset,
}) => {
  const [filteredInfo, setFilteredInfo] = useState({})
  useEffect(() => {
    console.log("filtersToClear useEffect:>> ", filtersToClear)
    // console.log("dataSource :>> ", dataSource)
    // console.log("columns :>> ", columns)
    // console.log("targetKeys :>> ", targetKeys)
    // keep only selected columns
    const temp = columns.filter((column) => {
      return targetKeys.indexOf(column.name) !== -1 || column.permanent
    })

    // all table configurations that are based on data
    temp.map((column) => {
      // const uniqueFormatted = []

      // get unique values for dropdown
      if (column.filter === "Dropdown") {
        // const unique = [
        //   ...new Set(
        //     dataSource.map(
        //       (h) => h[column.dataIndex].value || h[column.dataIndex]
        //     ).map( d => {

        //     })
        //   ),
        // ]

        const unique = []
        const map = new Map()

        // for (const item of dataSource) {
        //   if (
        //     !map.has(
        //       item[column.dataIndex].formattedValue || item[column.dataIndex]
        //     )
        //   ) {
        //     map.set(
        //       item[column.dataIndex].formattedValue || item[column.dataIndex],
        //       true
        //     ) // set any value to Map
        //     unique.push({
        //       text:
        //         item[column.dataIndex].formattedValue || item[column.dataIndex],
        //       value: item[column.dataIndex].value || item[column.dataIndex],
        //     })
        //   }
        // }

        dataSource.map((d) => {
          let properText =
            typeof d[column.dataIndex] === "object"
              ? d[column.dataIndex].formattedValue
              : d[column.dataIndex]

          let properValue =
            typeof d[column.dataIndex] === "object"
              ? d[column.dataIndex].value
              : d[column.dataIndex]

          if (!map.has(properText)) {
            map.set(properText, true) // set any value to Map
            unique.push({
              text: properText,
              value: properValue,
            })
          }
        })

        // unique.filter((d) => d.text !== "Null")

        // .sort()

        const uniqueFormatted =
          column.dropdownSortOrder.length === 0
            ? unique.filter((d) => d.text !== "Null") // default sort
            : unique
                .sort(function (a, b) {
                  // for custom sort
                  return (
                    column.dropdownSortOrder.indexOf(a.text) -
                    column.dropdownSortOrder.indexOf(b.text)
                  )
                })
                .filter((d) => d.text !== "Null")

        column.unique = uniqueFormatted

        // dropdown example
        // if (column.filter === "Dropdown") {
        column.filters = uniqueFormatted

        // filter
        column.onFilter = (value, record) => {
          if (typeof record[column.dataIndex] === "string") {
            return record[column.dataIndex].indexOf(value) === 0
          } else {
            return record[column.dataIndex].value === value
          }
        }

        column.className = column.source
      }

      // search example
      if (column.filter === "Search") {
        // search onfilter
        column.onFilter = (value, record) => {
          if (typeof record[column.dataIndex] === "string") {
            return record[column.dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          } else {
            return record[column.dataIndex].formattedValue
              .toLowerCase()
              .includes(value.toLowerCase())
          }
        }

        column.className = column.source

        // search box filter
        column.filterDropdown = ({
          setSelectedKeys,
          selectedKeys,
          clearFilters,
          confirm,
          visible,
        }) => (
          <SearchFilter
            clearFilters={clearFilters}
            handleReset={handleReset}
            handleSearch={handleSearch}
            dataIndex={column.dataIndex}
            placeholder={column.name}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            confirm={confirm}
            visible={visible}
          ></SearchFilter>
        )
      }

      // scale example
      if (column.filter === "Scale" || column.filter === "Precise") {
        const unique = [
          ...new Set(dataSource.map((h) => h[column.dataIndex].value)),
        ]

        const min = Math.floor(Math.min(...unique))
        const max = Math.ceil(Math.max(...unique))

        const step = 1

        column.onFilter = (value, record) => {
          return (
            record[column.dataIndex].value >= value[0] &&
            record[column.dataIndex].value <= value[1]
          )
        }

        // scale filter
        column.filterDropdown = ({
          setSelectedKeys,
          selectedKeys,
          clearFilters,
          confirm,
        }) =>
          column.filter === "Scale" ? (
            <ScaleFilter
              column={column}
              min={min}
              max={max}
              step={step}
              clearFilters={clearFilters}
              dataIndex={column.dataIndex}
              selectedKeys={[selectedKeys]}
              setSelectedKeys={setSelectedKeys}
              confirm={confirm}
              handleReset={handleReset}
              handleSearch={handleSearch}
            ></ScaleFilter>
          ) : (
            <PrecisionFilter
              column={column}
              min={min}
              max={max}
              dataIndex={column.dataIndex}
              selectedKeys={[selectedKeys]}
              setSelectedKeys={setSelectedKeys}
              confirm={confirm}
              handleReset={handleReset}
              handleSearch={handleSearch}
              hasFilters={hasFilters}
              clearFilters={clearFilters}
            ></PrecisionFilter>
          )
      }

      return column
    })

    setModifiedColumns(
      temp.sort(function (a, b) {
        return a.columnOrder - b.columnOrder
      })
    )
  }, [dataSource, targetKeys, filteredInfo])

  const handleChange = (pagination, filters, sorter, extra) => {
    console.log("filters :>> ", filters)
    const emptyPromise = new Promise((resolve) => {
      resolve("Success!")
    })

    emptyPromise
      .then(() => setFilteredInfo(filters))
      .then(() => {
        console.log("filters :>> ", filters)
        const filterValues = Object.values(filters).map((d) => !d) || null
        const reducer = (accumulator, currentValue) =>
          accumulator || currentValue
        // console.log("filterValues :>> ", filterValues)

        if (filterValues.reduce(reducer, false)) {
          // console.log("filtered :>> ", "must be")
          setHasFilters(true)
        }

        // else {
        //   setHasFilters(false)
        // }

        console.log("filtersToClear :>> ", filtersToClear)
        const temp = modifiedColumns.map((column) => {
          column.filteredValue = filters[column.dataIndex]

          // if (filtersToClear.includes(column)) {
          //   column.filteredValue = null
          // } else {
          //   column.filteredValue = filters[column.dataIndex]
          // }
          return column
        })
        console.log("temp 99 :>> ", temp)

        // console.log("extra", extra.currentDataSource)
        // console.log("filters :>> ", filters)

        setModifiedColumns(
          temp.sort(function (a, b) {
            return a.columnOrder - b.columnOrder
          })
        )
      })
      .then(() => setExportData(extra.currentDataSource))
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // console.log("selectedKeys :>> ", selectedKeys)
    confirm()
  }

  function showTotal(total) {
    return `Total ${total} donors`
  }

  const xScroll = width < 1140 ? "xhide" : "xshow"
  const yScroll = dataSource.length < 10 ? "yhide" : "yshow"

  console.log("modifiedColumns :>> ", modifiedColumns)

  return (
    <>
      {modifiedColumns ? (
        <Table
          scroll={{ x: width, y: 360 }}
          columns={modifiedColumns}
          dataSource={dataSource}
          onChange={handleChange}
          size={"middle"}
          className={`smallFont ${xScroll} ${yScroll}`}
          pagination={{
            position: "bottom",
            defaultPageSize: 500,
            size: "small",
            showTotal: showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["100", "500", "1000"],
          }}
        />
      ) : (
        <div></div>
      )}
    </>
  )
}

export default CustomTable
