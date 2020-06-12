import React from "react"
import { Modal, Tag } from "antd"
import TransferList from "./TransferList"

const CustomModal = ({
  columns,
  targetKeys,
  selectedKeys,
  handleKeyChange,
  handleSelectedChange,
  setIsModal,
  isModal,
  handleOk,
}) => {
  // const handleOk = (e) => {
  //   setIsModal(false)
  // }

  const handleCancel = (e) => {
    setIsModal(false)
  }

  return (
    <div>
      <Modal
        title={
          <>
            <div style={{ paddingBottom: 8 }}>Add or Remove Columns</div>
            <div className='d-flex'>
              <Tag color='#2db7f5'>Data Appends</Tag>
              <Tag color='#f50'>Survey Data</Tag>
            </div>
          </>
        }
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
