import React from "react"
import { Modal, Tag, Tooltip } from "antd"
import TransferList from "./TransferList"
import { appendTooltip } from "../functions/helpers"

const CustomModal = ({
  columns,
  targetKeys,
  handleKeyChange,
  setIsModal,
  isModal,
  handleOk,
}) => {
  const uniqueDataTypes = [
    ...new Set(
      columns.filter((d) => d.dataType !== "%null%").map((d) => d.dataType)
    ),
  ]
  const handleCancel = (e) => {
    setIsModal(false)
  }

  return (
    <div>
      <Modal
        title={
          <>
            <div style={{ paddingBottom: 8 }}>Add or Remove Columns</div>

            {uniqueDataTypes ? (
              <div className='d-flex customModal'>
                {uniqueDataTypes.map((d) => {
                  return (
                    <Tooltip
                      key={d}
                      placement='bottom'
                      overlayStyle={{ fontSize: 12 }}
                      title={appendTooltip(d)}
                    >
                      <Tag
                        key={d}
                        className={`ant-tag-${d
                          .toLowerCase()
                          .replace(/\s+/g, "")}`}
                      >
                        {d}
                      </Tag>
                    </Tooltip>
                  )
                })}
              </div>
            ) : null}
          </>
        }
        visible={isModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        bodyStyle={{ height: 380 }}
        style={{ top: 16 }}
      >
        <TransferList
          columns={columns}
          targetKeys={targetKeys}
          handleKeyChange={handleKeyChange}
        ></TransferList>
      </Modal>
    </div>
  )
}

export default CustomModal
