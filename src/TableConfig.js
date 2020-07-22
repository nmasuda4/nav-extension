import React from "react"
import { Tag, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const assignColumns = function (column, i) {
  const {
    Name,
    DataSource,
    DataType,
    FilterType,
    ColumnOrder,
    ColumnWidth,
    Identifier,
    DropdownSortOrder,
    MenuCategory,
    SortEnabled,
  } = column

  // add width (with default)
  function addWidth(defaultWidth) {
    return ColumnWidth !== "%null%" ? ColumnWidth : defaultWidth
  }

  // add filter icon based on filter
  function addFilterIcon() {
    if (FilterType === "Search") {
      return (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1890ff" : undefined,
          }}
        />
      )
    }
  }

  // function addSort() {
  //   return SortEnabled !== "%null%" && SortEnabled.toLowerCase() === "true"
  //     ? (a, b, dropdownSortOrder) => {
  //         if (dropdownSortOrder === "descend") {
  //           return a[column.dataIndex].localeCompare(b[column.dataIndex])
  //         } else {
  //           return b[column.dataIndex].localeCompare(a[column.dataIndex])
  //         }
  //       }
  //     : null
  // }

  // enable/disable sort
  function addSorter(SortEnabled, Name) {
    return SortEnabled !== "%null%"
      ? (a, b) => a[Name].value - b[Name].value
      : null
  }

  // function addDefaultSortOrder(DefaultSortOrder, DefaultSortDirection) {
  //   return DefaultSortDirection !== "%null%" && DefaultSortOrder !== "%null%"
  //     ? DefaultSortDirection.toLowerCase()
  //     : null
  // }

  // sort order for dropdowns
  function addCustomDropdownSort() {
    return DropdownSortOrder !== "%null%"
      ? DropdownSortOrder.includes("|")
        ? DropdownSortOrder.split("|").map((item) => item.trim())
        : DropdownSortOrder.trim()
      : []
  }

  // enable/disable filter
  function addFilter() {
    return FilterType !== "%null%" ? [] : null
  }

  // add color coded source tag
  function addTagHeader() {
    return (
      <Tag className={`ant-tag-${DataType.toLowerCase().replace(/\s+/g, "")}`}>
        {Name}
      </Tag>
    )
  }

  // blanks instead of nulls
  function replaceNull() {
    let nullValues = ["Null", "Na", "NA", "N/A"]
    return (text) => {
      const rightText = typeof text === "object" ? text.formattedValue : text
      const formattedText = nullValues.indexOf(rightText) > -1 ? "" : rightText

      return formattedText
    }
  }

  return {
    key: Name,
    name: Name,
    dataIndex: Name,
    width: addWidth(220),
    dataSource: DataSource,
    columnOrder: ColumnOrder,
    sorter: addSorter(SortEnabled, Name),
    dropdownSortOrder: addCustomDropdownSort(),
    // defaultSortOrder: addDefaultSortOrder(
    //   DefaultSortOrder,
    //   DefaultSortDirection
    // ),
    // sortDirections: ["descend", "ascend"],
    menuCategory: MenuCategory,
    render: replaceNull(),
    permanent: Identifier == true,
    filters: addFilter(),
    filterIcon: addFilterIcon(),
    filter: FilterType,
    dataType: DataType,
    title: addTagHeader(),
  }
}

export default assignColumns
