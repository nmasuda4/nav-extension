import React, { useState } from "react"
import { InputNumber, Button } from "antd"

const PrecisionFilter = ({
  column,
  confirm,
  selectedKeys,
  setSelectedKeys,
  handleSearch,
  handleReset,
  min,
  max,
  prefix,
  hasFilters,
  clearFilters,
}) => {
  // for precision filter
  const [minSelect, setMinSelect] = useState()
  const [maxSelect, setMaxSelect] = useState()

  if (!hasFilters) {
    console.log("should have resetted")
    setMinSelect(min)
    setMaxSelect(max)
  }

  // useEffect(() => {
  //   if (!hasFilters) {
  //     console.log("should have resetted")
  //     setMinSelect(min)
  //     setMaxSelect(max)
  //   }
  // }, [hasFilters])

  const onMinChange = (value) => {
    setMinSelect(value)
    setSelectedKeys(value ? [[value, maxSelect]] : [[min, max]])
  }
  const onMaxChange = (value) => {
    setMaxSelect(value)
    setSelectedKeys(value ? [[minSelect, value]] : [[min, max]])
  }
  const onPrecisionClear = () => {
    setMinSelect(min)
    setMaxSelect(max)
    handleReset(clearFilters)
  }

  function formatter(value) {
    if (prefix === "$") {
      return `${prefix}${value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    } else {
      return `${value.toString()}`
    }
  }

  console.log("range", [minSelect, maxSelect])

  return (
    <div className='d-flex w-100 m-2 justify-content-center flex-column'>
      <div className='scale d-flex w-100 m-2 justify-content-start'>
        <p className='d-flex justify-content-center align-items-center'>Min.</p>
        <InputNumber
          min={min}
          max={max - 1}
          value={minSelect}
          // defaultValue={min}
          onChange={onMinChange}
          formatter={formatter}
        />
        <p className='d-flex justify-content-center align-items-center'>
          {formatter(min)}
        </p>
      </div>
      <div className='scale d-flex w-100 m-2 justify-content-start'>
        <p className='d-flex justify-content-center align-items-center'>Max.</p>
        <InputNumber
          min={min + 1}
          max={max}
          value={maxSelect}
          // defaultValue={maxSelect}
          onChange={onMaxChange}
          formatter={formatter}
        />
        <p className='d-flex justify-content-center align-items-center'>
          {formatter(max)}
        </p>
      </div>
      <div className='scale d-flex w-100 m-2 justify-content-start'>
        <Button
          type='primary'
          onClick={() => handleSearch(selectedKeys, confirm, column.fieldName)}
          icon='search'
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={onPrecisionClear} size='small' style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export default PrecisionFilter
