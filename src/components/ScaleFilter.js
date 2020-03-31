import React from "react"
import { Slider, Button } from "antd"

const ScaleFilter = ({
  column,
  confirm,
  clearFilters,
  selectedKeys,
  setSelectedKeys,
  handleSearch,
  handleReset,
  min,
  max,
  step,
  prefix
}) => {
  function formatter(value) {
    if (prefix === "$") {
      return `${prefix}${value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    } else {
      return `${value.toString()}`
    }
  }

  return (
    <div style={{ padding: 8 }}>
      <Slider
        range
        min={min}
        max={max}
        step={step}
        defaultValue={[min, max]}
        onChange={value => setSelectedKeys(value ? [value] : [min, max])}
        tipFormatter={formatter}
      />
      <Button
        type='primary'
        onClick={() => handleSearch(selectedKeys, confirm, column.fieldName)}
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

export default ScaleFilter
