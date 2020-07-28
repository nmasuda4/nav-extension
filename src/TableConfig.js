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

  // enable/disable sort
  function addSorter(SortEnabled, Name) {
    return SortEnabled !== "%null%"
      ? (a, b) => a[Name].value - b[Name].value
      : null
  }

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
    let nullValues = new Set(["%null%", "Null", "Na", "NA", "N/A"])
    return (text) => {
      return nullValues.has(text.formattedValue) ? "" : text.formattedValue
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
