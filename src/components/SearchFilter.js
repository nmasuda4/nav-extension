import React from "react"
import { Input, Button } from "antd"

const SearchFilter = ({
  setSelectedKeys,
  selectedKeys,
  clearFilters,
  handleReset,
  handleSearch,
  placeholder,
  dataIndex,
  confirm
}) => {
  const selectedKeys1 = selectedKeys || []

  console.log("selectedKeys", selectedKeys)

  return (
    <div
      style={{
        padding: 8,
        position: "absolute",
        left: 20,
        background: "white"
      }}
    >
      <Input
        placeholder={`Search ${placeholder}`}
        value={selectedKeys1[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Button
        type='primary'
        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
        icon='search'
        size='small'
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => handleReset(clearFilters)}
        size='small'
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </div>
  )
}

export default SearchFilter
