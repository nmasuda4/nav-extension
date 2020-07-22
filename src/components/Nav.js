import React, { useState } from "react"
import { Layout, Menu } from "antd"
import {
  FundOutlined,
  UserOutlined,
  TableOutlined,
  ToolOutlined,
} from "@ant-design/icons"
import LogoCollapsed from "../images/HRLogoCollapsed.png"
import SubNav from "./SubNav"
import WarningSummary from "./WarningSummary"
import IndividualView from "./IndividualView"

const { Sider } = Layout

const primary = [
  { name: "Summary", icon: <FundOutlined /> },
  { name: "Persona", icon: <UserOutlined /> },
  { name: "Individual", icon: <TableOutlined /> },
  { name: "Methodology", icon: <ToolOutlined /> },
]

const Nav = ({
  phase,
  view,
  onViewChange,
  onSubViewChange,
  onOpenChange,
  openKeysState,
  subMenuKeys,
  initialListLoad,
  setInitialListLoad,
}) => {
  const [tableConfig, setTableConfig] = useState([])
  const [defaultTableData, setDefaultTableData] = useState([])

  return (
    <>
      <Layout
        style={{
          height: "100vh",
          width: "60px",
          margin: "0px",
          backgroundColor: "white",
        }}
      >
        <Sider
          width={60}
          style={{
            // height: `${height - 52}px`,
            width: "60px",
            display: "flex",
            flexDirection: "column",
          }}
          theme='dark'
          collapsedWidth={60}
          collapsed={true}
        >
          <img
            src={LogoCollapsed}
            alt='website logo'
            height={"30"}
            style={{
              margin: "10px auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <Menu
            theme='dark'
            onClick={onViewChange}
            selectedKeys={view}
            selectable
            mode='inline'
            style={{
              display: "flex",
              flexDirection: "column",
              width: 60,
            }}
          >
            {primary.map((d, i) => {
              return (
                <Menu.Item
                  key={d.name}
                  id={d.name}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop:
                      i === primary.length - 1
                        ? "auto"
                        : i === 0
                        ? "20px"
                        : "0px",
                  }}
                  icon={d.icon}
                >
                  <span>{d.name}</span>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
      </Layout>
      <div className='secondary'>
        {phase === "3" && view[0] === "Summary" ? null : (
          <p className='view'>{`${view}`}</p>
        )}
        {view[0] === "Summary" ? (
          <WarningSummary phase={phase}></WarningSummary>
        ) : null}
        {view[0] === "Persona" ? (
          <SubNav
            phase={phase}
            onChange={onSubViewChange}
            onOpenChange={onOpenChange}
            openKeysState={openKeysState}
            subMenuKeys={subMenuKeys}
          ></SubNav>
        ) : null}
        {view[0] === "Individual" ? (
          <IndividualView
            initialListLoad={initialListLoad}
            setInitialListLoad={setInitialListLoad}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            defaultTableData={defaultTableData}
            setDefaultTableData={setDefaultTableData}
          ></IndividualView>
        ) : (
          <div style={{ width: "100px" }}></div>
        )}
      </div>
    </>
  )
}

export default Nav
