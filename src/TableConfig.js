import React from "react"
import { Icon } from "antd"

const assignColumns = function (column, settings, i) {
  const { properFieldName } = column
  const type = settings.Type
  const filter = settings.Filter
  const width = settings.Width

  const tagColors = [
    "#3C786E",
    "#939598",
    "#FFBD9C",
    "#3C786E",
    "#FC4C02",
    "#484E66",
    "#00594C",
    "#1F2A44",
  ]

  function addWidth(defaultWidth) {
    const formattedWidth = width !== "%null%" ? width : defaultWidth
    return formattedWidth
  }

  // dataIndex (lowercase, no space)
  function addDataIndex(properFieldName) {
    return properFieldName.toLowerCase().replace(/\s+/g, "")
  }

  function addRender(properFieldName) {
    if (type === "Id") {
      return (text, record, index) => {
        const formattedText = text === "Null" ? "" : text
        return formattedText
      }

      // (
      // <div>
      //   <span
      //     id={record.id}
      //     profileid={record}
      //     onClick={showDrawer}
      //     style={{ color: "#1890ff" }}
      //   >
      //     {text}
      //   </span>
      // </div>
      //)
    } else if (
      filter === "Scale" ||
      filter === "Dropdown" ||
      filter === "Precise"
    ) {
      return (text) => {
        const formattedText = text === "Null" ? "" : text
        return formattedText
      }
    }
  }

  function addFilterIcon() {
    if (filter === "Search") {
      return (filtered) => (
        <Icon
          type='search'
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      )
    }
  }

  function addCustomSort() {
    const sort = settings.Sort.split("|").map(function (item) {
      return item.trim()
    })
    console.log("temp", sort)
    return sort
  }

  const dataIndex = addDataIndex(properFieldName)

  return {
    Name: settings.Name,
    fieldname: column.fieldName,
    title: properFieldName,
    width: addWidth(180),
    indexOriginal: i,
    filters: [],
    filterIcon: addFilterIcon(),
    // sorter: customSorter,
    sort: addCustomSort(),
    sortDirections: ["descend", "ascend"],
    render: addRender(properFieldName),
    dataIndex: dataIndex,
    permanent: settings.Permanent === "Yes" ? true : false,
    filter: settings.Filter,
    type: settings.Type,
    default: settings.Default === "Yes" ? true : false,
    order: settings.Order,
    source: settings.Source.toLowerCase(),
    colors: settings.Type === "Persona" ? tagColors : [],
  }
}

export default assignColumns
