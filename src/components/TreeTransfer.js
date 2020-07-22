import React from "react"
import { Transfer, Tree } from "antd"

const TreeTransfer = ({
  dataSource,
  targetKeys,
  onChange,
  filterOption,
  ...restProps
}) => {
  // console.log("targetKeys :>> ", targetKeys)
  const transferDataSource = []

  function flatten(list = []) {
    list.forEach((item) => {
      transferDataSource.push(item)
      flatten(item.children)
    })
  }

  flatten(dataSource)

  // Customize Table Transfer
  const isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1
  }

  const generateTree = (treeNodes = [], checkedKeys = []) => {
    return treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key),
      children: generateTree(children, checkedKeys),
    }))
  }

  return (
    <Transfer
      {...restProps}
      // showSearch
      filterOption={filterOption}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      onChange={onChange}
      className='tree-transfer'
      render={(item) => item.title}
      showSelectAll={true}
      selectAllLabels={[
        ({ totalCount }) => <span>{totalCount} Fields</span>,
        ({ totalCount }) => <span>{totalCount} Fields</span>,
      ]}
      titles={["Available Fields", "Selected Fields"]}
      listStyle={{
        width: 350,
        height: 350,
      }}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === "left") {
          const checkedKeys = [...selectedKeys, ...targetKeys]
          return (
            <Tree
              height={312}
              blockNode
              checkStrictly
              checkable
              checkedKeys={checkedKeys}
              treeData={generateTree(dataSource, targetKeys)}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key))
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key))
              }}
            />
          )
        }
        // if (direction === "right") {
        //   return <div>hello</div>
        // }
      }}
    </Transfer>
  )
}

export default TreeTransfer
