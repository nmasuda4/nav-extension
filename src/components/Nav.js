import React from "react"
import { Layout, Menu, Icon } from "antd"
import LogoCollapsed from "../HRLogoCollapsed.png"
import SubNav from "./SubNav"
import WarningSummary from "./WarningSummary"
import IndividualView from "./IndividualView"

const { Sider } = Layout

const primary = [
  { name: "Summary", icon: "fund" },
  { name: "Persona", icon: "user" },
  { name: "Individual", icon: "table" },
  { name: "Methodology", icon: "tool" }
]

const Nav = ({
  phase,
  view,
  sheets,
  height,
  onViewChange,
  onSubViewChange,
  onOpenChange,
  openKeysState,
  subMenuKeys,
  initialListLoad,
  setInitialListLoad,
  tableConfig,
  setTableConfig,
  tableData,
  setTableData
}) => {
  return (
    <>
      <Layout
        style={{
          height: "100vh",
          width: "60px",
          margin: "0px",
          backgroundColor: "white"
        }}
      >
        <Sider
          width={60}
          style={{
            // height: `${height - 52}px`,
            width: "60px",
            display: "flex",
            flexDirection: "column"
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
              alignItems: "center"
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
              width: 60
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
                        : "0px"
                  }}
                >
                  <Icon type={d.icon} />
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
            tableData={tableData}
            setTableData={setTableData}
          ></IndividualView>
        ) : (
          <div style={{ width: "100px" }}></div>
        )}
      </div>
    </>
  )
}

export default Nav
