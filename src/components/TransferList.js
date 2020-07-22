import React from "react"
import "antd/dist/antd.css"
// import { Transfer } from "antd"
import TreeTransfer from "./TreeTransfer"
import { groupByTransferList } from "../functions/helpers"

const TransferList = ({ columns, targetKeys, handleKeyChange }) => {
  // const mockData = []
  // columns
  //   .filter((d) => !d.permanent)
  //   .map((d) => {
  //     const temp = {
  //       key: d.name,
  //       title: d.title,
  //     }
  //     return mockData.push(temp)
  //   })

  const dat = groupByTransferList(
    columns.filter((d) => !d.permanent),
    "menuCategory"
  )

  const handleFilterOption = (inputValue, option) =>
    option.key.toLowerCase().indexOf(inputValue.toLowerCase()) > -1

  return (
    <div>
      {/* <Transfer
        dataSource={mockData}     
        render={(item) => item.title}   
      > */}
      <TreeTransfer
        dataSource={dat}
        targetKeys={targetKeys}
        onChange={handleKeyChange}
        // selectedKeys={selectedKeys}
        // onSelectChange={handleSelectedChange}
        filterOption={handleFilterOption}
      />
      {/* </Transfer> */}
    </div>
  )
}

export default TransferList
