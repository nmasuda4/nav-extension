import React, { useEffect } from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import Main from "./Main"
import { fetchConfig, fetchDefaultData } from "../functions/helpers"
/* global tableau */

const antIcon = (
  <LoadingOutlined style={{ fontSize: 36, marginBottom: 12 }} spin />
)

const IndividualView = ({
  URL,
  initialListLoad,
  setInitialListLoad,
  tableConfig,
  setTableConfig,
  defaultTableData,
  setDefaultTableData,
}) => {
  useEffect(() => {
    if (initialListLoad === false) {
      // fetch data from tableau worksheets
      tableau.extensions.initializeAsync().then(() => {
        fetchConfig("Table Configuration", "Table Configuration")
          .then(function (res) {
            setTableConfig(res)
            return fetchDefaultData(res, 200000)
          })
          .then((res) => setDefaultTableData(res))
          .then(() => setInitialListLoad(true))
      })
    }
  }, [initialListLoad])

  return (
    <div style={{ width: "100%" }}>
      {initialListLoad ? (
        <Main
          URL={URL}
          tableConfig={tableConfig}
          defaultTableData={defaultTableData}
        ></Main>
      ) : (
        <div
          className='w-100 d-flex justify-content-center align-items-center'
          style={{ height: "80vh" }}
        >
          <div>
            <Spin tip='Retrieving Donors...' indicator={antIcon}></Spin>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndividualView
