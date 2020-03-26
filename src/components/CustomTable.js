import React from "react"
import { Icon } from "antd"

const antIcon = (
  <Icon type='loading' style={{ fontSize: 36, marginBottom: 12 }} spin />
)

const CustomTable = () => {
  return <>{antIcon}</>
}

export default CustomTable
