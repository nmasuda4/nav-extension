import React from "react"
import { Slider, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"

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
  prefix,
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

  function stepFormatter(min, max) {
    let step = Math.round((max - min) / 1000)
    let rounded = Math.ceil(step / 5) * 5

    return rounded < 1 ? 1 : rounded
  }

  return (
    <div style={{ width: 500, padding: 8 }}>
      <div className='scale d-flex w-100'>
        <p className='d-flex justify-content-center align-items-center'>
          {formatter(min)}
        </p>
        <Slider
          range
          min={min}
          max={max}
          step={stepFormatter(min, max)}
          defaultValue={[min, max]}
          onChange={(value) => setSelectedKeys(value ? [value] : [min, max])}
          tipFormatter={formatter}
        />
        <p className='d-flex justify-content-center align-items-center'>
          {formatter(max)}
        </p>
      </div>
      <Button
        type='primary'
        onClick={() => handleSearch(selectedKeys, confirm, column.fieldName)}
        icon={<SearchOutlined />}
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
