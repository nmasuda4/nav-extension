import React, { useState, useEffect } from "react"
import { Table, Tooltip, Tag, Button } from "antd"
import SearchFilter from "./SearchFilter"
import ScaleFilter from "./ScaleFilter"
import PrecisionFilter from "./PrecisionFilter"
// import Highlighter from "react-highlight-words"
import "antd/dist/antd.css"
import "../App.css"

const CustomTable = ({
  dataSource,
  setExportData,
  setExportHeaders,
  columns,
  width,
  targetKeys,
}) => {
  const [modifiedColumns, setModifiedColumns] = useState()
  const [filteredInfo, setFilteredInfo] = useState({})
  const [hasFilters, setHasFilters] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  // for search filter
  const [searchText, setSearchText] = useState()
  const [searchedColumn, setSearchedColumn] = useState()

  useEffect(() => {
    console.log("filteredInfo", filteredInfo)
    console.log("dataSource", dataSource)

    // change only filter info, not datasource

    // keep only selected columns
    const temp = columns.filter((column) => {
      return (
        targetKeys.indexOf(column.title) !== -1 || column.permanent === "Yes"
      )
    })

    temp.map((column) => {
      const uniqueFormatted = []

      // get unique values for dropdown and scale
      if (column.filter === "Dropdown") {
        const unique = [
          ...new Set(dataSource.map((h) => h[column.dataIndex])),
        ].sort()

        console.log(column.Name, column.sort.length, unique)
        if (column.sort.length === 1 && column.sort.includes("%null%")) {
          // for default sort
          console.log("default", column.Name)
          unique.map((item) => {
            return uniqueFormatted.push({ text: item, value: item })
          })
        } else {
          // for custom sort
          column.sort.map((item) => {
            if (unique.includes(item)) {
              return uniqueFormatted.push({ text: item, value: item })
            }
          })
        }
        column.unique = uniqueFormatted
      }

      if (column.filter === "Scale" || column.filter === "Precise") {
        const unique = [
          ...new Set(dataSource.map((h) => h[column.dataIndex])),
        ].sort()
        unique.map((item) => uniqueFormatted.push({ text: item, value: item }))
        column.unique = uniqueFormatted
      }

      // dropdown example
      if (column.filter === "Dropdown") {
        column.filters = uniqueFormatted

        // render
        column.render = (text) => {
          const formattedText =
            text.toLowerCase() === "null" || text.toLowerCase() === "na"
              ? ""
              : text
          return formattedText
        }

        // filter
        column.onFilter = (value, record) =>
          record[column.dataIndex].indexOf(value) === 0

        // sort
        // const sortByObject = column.sort.reduce(
        //   (obj, item, index) => ({
        //     ...obj,
        //     [item]: index,
        //   }),
        //   {}
        // )

        //   column.sorter =
        //     column.sort.length === 1 && column.sort.includes("%null%")
        //       ? (a, b, sortOrder) => {
        //           // without custom sort
        //           const A = a[column.dataIndex]
        //           const B = b[column.dataIndex]
        //           if (A !== "Null" && B !== "Null") {
        //             a[column.dataIndex].localeCompare(
        //               b[column.dataIndex],
        //               undefined,
        //               {
        //                 numeric: true,
        //                 sensitivity: "base",
        //               }
        //             )
        //           } else if (A === "Null") {
        //             return sortOrder === "ascend" ? 1 : -1
        //           } else if (B === "Null") {
        //             return sortOrder === "ascend" ? -1 : 1
        //           }
        //           return 0
        //         }
        //       : (a, b, sortOrder) => {
        //           // with custom sort
        //           const A = a[column.dataIndex]
        //           const B = b[column.dataIndex]
        //           if (A !== "Null" && B !== "Null") {
        //             return (
        //               sortByObject[a[column.dataIndex]] -
        //               sortByObject[b[column.dataIndex]]
        //             )
        //           } else if (A === "Null") {
        //             return sortOrder === "ascend" ? 1 : -1
        //           } else if (B === "Null") {
        //             return sortOrder === "ascend" ? -1 : 1
        //           }
        //           return 0
        //         }
      }

      // search example
      if (column.filter === "Search") {
        // search onfilter
        column.onFilter = (value, record) =>
          record[column.dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())

        // search sort
        // column.sorter = (a, b) =>
        //   a[column.dataIndex].localeCompare(b[column.dataIndex])

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
            placeholder={column.Name}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            confirm={confirm}
            visible={visible}
          ></SearchFilter>
        )

        // search render highlight
        if (!column.render) {
          column.render = (text) => {
            const formattedText =
              text.toLowerCase() === "null" || text.toLowerCase() === "na"
                ? ""
                : text

            return searchedColumn === column.dataIndex
              ? formattedText
              : // <Highlighter
                //   highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                //   searchWords={[searchText]}
                //   autoEscape
                //   textToHighlight={formattedText.toString()}
                // />
                formattedText
          }
        }
      }

      // scale example
      if (column.filter === "Scale" || column.filter === "Precise") {
        const prefix = uniqueFormatted[0].value[0] === "$" ? "$" : ""
        let missing = ["Null", "Na", "NA", "N/A"]
        console.log(column, uniqueFormatted)
        const values = uniqueFormatted
          .filter((d) => missing.indexOf(d.value) === -1)
          .map((d) => d.value.replace(/\D+/g, ""))

        const min = Math.floor(Math.min(...values))
        const max = Math.ceil(Math.max(...values))
        const step = 1

        column.render = (text) => {
          const formattedText =
            text.toLowerCase() === "null" || text.toLowerCase() === "na"
              ? ""
              : text
          return formattedText
        }

        column.onFilter = (value, record) =>
          record[column.dataIndex].replace(/\D+/g, "") !== "" &&
          record[column.dataIndex].replace(/\D+/g, "") >= value[0] &&
          record[column.dataIndex].replace(/\D+/g, "") <= value[1]

        // sort
        // column.sorter = (a, b, sortOrder) => {
        //   const A = a[column.dataIndex]
        //   const B = b[column.dataIndex]
        //   if (A !== "Null" && B !== "Null") {
        //     return A.localeCompare(B, undefined, {
        //       numeric: true,
        //       sensitivity: "base",
        //     })
        //   } else if (A === "Null") {
        //     return sortOrder === "ascend" ? 1 : -1
        //   } else if (B === "Null") {
        //     return sortOrder === "ascend" ? -1 : 1
        //   }
        //   return 0
        // }

        // scale filter
        column.filterDropdown = ({
          setSelectedKeys,
          selectedKeys,
          clearFilters,
          confirm,
        }) =>
          column.filter === "Scale" ? (
            <ScaleFilter
              prefix={prefix}
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
              prefix={prefix}
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

      // add persona render
      if (column.type === "Persona") {
        column.render = (tag) => (
          <span>
            {column.unique.map((d) => d.value).indexOf(tag) !== -1 ? (
              <Tag
                color={
                  column.colors[column.unique.map((d) => d.value).indexOf(tag)]
                }
                key={tag}
              >
                {tag.toUpperCase()}
              </Tag>
            ) : null}
          </span>
        )
      }

      return column
    })

    setModifiedColumns(
      temp.sort(function (a, b) {
        return a.order - b.order
      })
    )

    const position = document
      .getElementById("addremove")
      .getBoundingClientRect()
    const position2 = document
      .getElementById("download")
      .getBoundingClientRect()
    setPos({ x: position.x - (position2.x - position.x), y: position.y })
  }, [targetKeys, searchText, filteredInfo])

  const handleChange = (pagination, filters, sorter, extra) => {
    setFilteredInfo(filters)
    console.log("extra", extra.currentDataSource)

    const filterValues = Object.values(filters).map((d) => d.length !== 0) || []
    const reducer = (accumulator, currentValue) => accumulator || currentValue

    if (filterValues.reduce(reducer, false)) {
      setHasFilters(true)
    } else {
      setHasFilters(false)
    }

    const temp = modifiedColumns.map((column) => {
      column.filteredValue = filters[column.dataIndex]

      return column
    })

    // set export data
    // const headers = Object.keys(extra.currentDataSource[0])
    // const dat = dataSource.map(d => {
    //   const { tags, ...withoutStuff } = d
    //   return withoutStuff
    // })

    // setExportData(dat)
    // setHeaders(headers)
    // setHeaders(headers.filter((d, i) => i !== headers.length - 1))
    setExportData(extra.currentDataSource)
    setExportHeaders()
    //setCurrentDataSource(extra.currentDataSource)
    setModifiedColumns(temp)
  }

  const clearFilters = () => {
    const temp = modifiedColumns.map((column) => {
      column.filteredValue = []
      return column
    })
    setModifiedColumns(temp)
    setHasFilters(false)
    setSearchText("")
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys ? selectedKeys[0] : "")
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText("")
    setHasFilters(false)
    // const temp = modifiedColumns.map(column => {
    //   column.filteredValue = []
    //   return column
    // })
    // setModifiedColumns(temp)
  }

  function showTotal(total) {
    return `Total ${total} donors`
  }

  const xScroll = width < 1140 ? "xhide" : "xshow"
  const yScroll = dataSource.length < 10 ? "yhide" : "yshow"

  return (
    <>
      {hasFilters ? (
        <Tooltip
          placement='left'
          overlayStyle={{ fontSize: 12 }}
          title='Clear Filters'
          id='clear'
        >
          <Button
            style={{
              position: "absolute",
              zIndex: 1000,
              top: pos.y,
              left: pos.x,
            }}
            type='primary'
            icon='undo'
            shape='circle'
            size='default'
            onClick={clearFilters}
          ></Button>
        </Tooltip>
      ) : null}
      <Table
        searchText={searchText}
        scroll={{ x: width, y: 400 }}
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
    </>
  )
}

export default CustomTable
