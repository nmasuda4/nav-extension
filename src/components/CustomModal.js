import React from "react"
import { Modal } from "antd"
import TransferList from "./TransferList"

const CustomModal = ({
  columns,
  targetKeys,
  selectedKeys,
  handleKeyChange,
  handleSelectedChange,
  setIsModal,
  isModal
}) => {
  const handleOk = e => {
    setIsModal(false)
  }

  const handleCancel = e => {
    setIsModal(false)
  }

  return (
    <div>
      <Modal
        title='Add or Remove Columns'
        visible={isModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        bodyStyle={{ height: 400 }}
        style={{ top: 16 }}
      >
        <TransferList
          columns={columns}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          handleKeyChange={handleKeyChange}
          handleSelectedChange={handleSelectedChange}
        ></TransferList>
      </Modal>
    </div>
  )
}

export default CustomModal
