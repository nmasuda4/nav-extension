import React, { useState, useEffect } from "react"
import { Table } from "antd"
import SearchFilter from "./SearchFilter"
import ScaleFilter from "./ScaleFilter"
import PrecisionFilter from "./PrecisionFilter"
import "antd/dist/antd.css"
import "../App.css"

const CustomTable = ({
  dataSource,
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
  setFiltersToClear,
}) => {
  const [filteredInfo, setFilteredInfo] = useState({})
  useEffect(() => {
    // keep only selected columns
    const temp = columns.filter((column) => {
      return targetKeys.indexOf(column.name) !== -1 || column.permanent
    })

    // all table configurations that are based on data
    temp.map((column) => {
      if (filtersToClear.length > 0) {
        if (filtersToClear.indexOf(column.dataIndex) !== -1) {
          column.filteredValue = null
          const test = filtersToClear.filter(
            (d) => column.dataIndex.indexOf(d) === -1
          )
          // remove the column added
          setFiltersToClear(test)
        }
      }

      // get unique values for dropdown
      if (column.filter === "Dropdown") {
        const formattedValues = new Set(
          dataSource.map((d) => d[column.dataIndex].formattedValue)
        )
        const values = new Set(dataSource.map((d) => d[column.dataIndex].value))

        // formattedValues.delete("Null")
        // values.delete("%null%")

        let uniqueFormatted = []
        const arrFormattedValues = [...formattedValues]
        const arrValues = [...values]

        if (arrFormattedValues.includes("Null")) {
          arrFormattedValues[arrFormattedValues.indexOf("Null")] = "(Blanks)"
        }

        // format for dropdown {text, value}
        for (let i = 0, l = arrFormattedValues.length; i < l; i++) {
          uniqueFormatted[i] = {
            text: arrFormattedValues[i],
            value: arrValues[i],
          }
        }
        let filters

        if (column.dropdownSortOrder.length === 0) {
          filters = uniqueFormatted.sort(function (a, b) {
            // equal items sort equally
            if (a.text === b.text) {
              return 0
            }
            // nulls sort after anything else
            else if (a.text === "(Blanks)") {
              return 1
            } else if (b.text === "(Blanks)") {
              return -1
            } else {
              return a.text < b.text ? -1 : 1
            }
          })
        } else {
          let dat = column.dropdownSortOrder.map((d) => {
            return {
              text: d,
              value: d,
            }
          })
          if (arrFormattedValues.includes("(Blanks)")) {
            dat.push({ text: "(Blanks)", value: "%null%" })
          }
          filters = dat
        }

        //  if (column.dropdownSortOrder.length > 0) {
        //    const customDropdown = column.dropdownSortOrder.map((d) => {
        //      return {
        //        text: d,
        //        value: d,
        //      }
        //    })
        //    customDropdown.push({ text: "(Blanks)", value: "%null%" })
        //  }
        column.filters = filters

        // filter
        column.onFilter = (value, record) => {
          return record[column.dataIndex].value === value
        }

        column.className = column.source
      }

      // search example
      if (column.filter === "Search") {
        // search onfilter
        column.onFilter = (value, record) => {
          return record[column.dataIndex].formattedValue
            .toLowerCase()
            .includes(value.toLowerCase())
          // if (typeof record[column.dataIndex] === "string") {
          //   return record[column.dataIndex]
          //     .toString()
          //     .toLowerCase()
          //     .includes(value.toLowerCase())
          // } else {
          //   return record[column.dataIndex].formattedValue
          //     .toLowerCase()
          //     .includes(value.toLowerCase())
          // }
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
        const unique = new Set(dataSource.map((d) => d[column.dataIndex].value))
        unique.delete("%null%")

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
  }, [dataSource, filteredInfo])

  const handleChange = (pagination, filters, sorter, extra) => {
    const emptyPromise = new Promise((resolve) => {
      resolve("Success!")
    })

    emptyPromise
      .then(() => setFilteredInfo(filters))
      .then(() => {
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

        const temp = modifiedColumns.map((column) => {
          // console.log(column, filtersToClear.indexOf(column.dataIndex) === -1)
          column.filteredValue =
            filtersToClear.indexOf(column.dataIndex) === -1
              ? filters[column.dataIndex]
              : null

          // if (filtersToClear.includes(column)) {
          //   column.filteredValue = null
          // } else {
          //   column.filteredValue = filters[column.dataIndex]
          // }
          return column
        })

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
