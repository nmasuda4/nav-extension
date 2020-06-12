import React from "react"
import "antd/dist/antd.css"
import { Transfer } from "antd"

const TransferList = ({
  columns,
  targetKeys,
  selectedKeys,
  handleKeyChange,
  handleSelectedChange,
}) => {
  const mockData = []
  columns
    .filter((d) => !d.permanent)
    .map((d) => {
      const temp = {
        key: d.fieldname,
        title: d.title,
      }
      return mockData.push(temp)
    })

  return (
    <div>
      <Transfer
        dataSource={mockData}
        titles={["Available Fields", "Selected Fields"]}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleKeyChange}
        onSelectChange={handleSelectedChange}
        render={(item) => item.title}
        showSearch
        listStyle={{
          width: 350,
          height: 350,
        }}
      />
    </div>
  )
}

export default TransferList
