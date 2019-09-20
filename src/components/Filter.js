import React from "react"
import { Select, Input } from "antd"
import "antd/dist/antd.css"

const { TextArea } = Input

/* global tableau */

const { Option } = Select

function onChange(value, all) {
  console.log(`selected ${value}`)
  console.log("all", all.props.all)

  // filter
  // tableau.extensions.initializeAsync().then(() => {
  //   const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  //   worksheets[0].applyFilterAsync('Customer Name',[value], 'replace')
  // })

  // parameter
  tableau.extensions.initializeAsync().then(() => {
    const parameters = tableau.extensions.dashboardContent.dashboard
      .getParametersAsync()
      .then(d => {
        d.map(parameter => {
          return parameter.changeValueAsync(value)
        })
      })

    // wtf
    tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
      object
    ) {
      console.log(object.name + ":" + object.id + ":" + object.isVisible)
    })

    let extensionName = ["extension"]
    let keepName = [value]
    let hideName = all.props.all
    let extensionVisibilityObject = {}

    tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
      object
    ) {
      if (
        keepName.includes(object.name) ||
        extensionName.includes(object.name)
      ) {
        extensionVisibilityObject[object.id] = tableau.ZoneVisibilityType.Show
      } else if (hideName.includes(object.name)) {
        extensionVisibilityObject[object.id] = tableau.ZoneVisibilityType.Hide
      }
    })

    console.log("extensionVisibilityObject", extensionVisibilityObject)
    tableau.extensions.dashboardContent.dashboard
      .setZoneVisibilityAsync(extensionVisibilityObject)
      .then(() => {
        console.log("done")
      })

    console.log("parameter", parameters)
  })
}

function onBlur() {
  console.log("blur")
}

function onFocus() {
  console.log("focus")
}

function onSearch(val) {
  console.log("search:", val)
}

const Filter = ({ data }) => {
  return (
    <div>
      <TextArea></TextArea>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a state"
        optionFilterProp="children"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {data.map((d, i) => {
          return (
            <Option key={i} value={d} all={data}>
              {d}
            </Option>
          )
        })}
      </Select>
    </div>
  )
}

export default Filter
