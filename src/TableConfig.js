import React from "react"
import { Icon, Tag } from "antd"

const assignColumns = function (column, i) {
  const { Name, Type, Filter, Width, Source, Sort, Permanent, Default } = column

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

  // add width (with default)
  function addWidth(defaultWidth) {
    const formattedWidth = Width !== "%null%" ? Width : defaultWidth
    return formattedWidth
  }

  // dataIndex (lowercase, no space)
  function addDataIndex(Name) {
    return Name.toLowerCase().replace(/\s+/g, "")
  }

  // if null then blank
  function addRender() {
    if (Type === "Id") {
      return (text) => {
        const formattedText = text === "Null" ? "" : text
        return formattedText
      }
    }
  }

  // add filter icon based on filter
  function addFilterIcon() {
    if (Filter === "Search") {
      return (filtered) => (
        <Icon
          type='search'
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      )
    }
  }

  // sort order for dropdowns
  function addCustomSort() {
    const sort =
      Sort !== "%null%" ? Sort.split("|").map((item) => item.trim()) : []
    return sort
  }

  // add color coded source tag
  function addTagHeader() {
    if (Source === "Append") {
      return <Tag color='#2db7f5'>{Name}</Tag>
    } else if (Source === "Survey") {
      return <Tag color='#f50'>{Name}</Tag>
    } else {
      return <span style={{ fontSize: 12, fontWeight: 400 }}>{Name}</span>
    }
  }

  return {
    Name: Name,
    fieldname: Name,
    dataIndex: Name,
    width: addWidth(180),
    indexOriginal: i,
    filters: [],
    filterIcon: addFilterIcon(),
    sort: addCustomSort(),
    sortDirections: ["descend", "ascend"],
    render: addRender(),
    //dataIndex: addDataIndex(Name),
    permanent: Permanent === "Yes",
    filter: Filter,
    type: Type,
    default: Default === "Yes",
    source: Source.toLowerCase(),
    title: addTagHeader(),
    colors: Type === "Persona" ? tagColors : [],
    key: addDataIndex(Name),
  }
}

export default assignColumns
