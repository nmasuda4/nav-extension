import React from "react"
import { Layout, Menu, Icon } from "antd"
import WarningPersona from "./WarningPersona"

const { SubMenu } = Menu

const SubNav = ({
  phase,
  onChange,
  onOpenChange,
  openKeysState,
  subMenuKeys
}) => {
  const secondary = [
    { name: "Understand", icon: "pie-chart" },
    { name: "Motivate", icon: "message", options: ["21Summary", "Impact"] },
    { name: "Communicate", icon: "link", options: ["31Summary"] },
    {
      name: "Engage",
      icon: "notification",
      options: ["41Summary", "Giving", "Attitude", "Activity"]
    }
  ]

  return (
    <div className='d-flex h-75'>
      <Layout
        className='subnav'
        style={{
          height: "90vh",
          width: 180,
          margin: "0px",
          backgroundColor: "white"
        }}
      >
        <Menu
          theme='light'
          mode='inline'
          openKeys={openKeysState}
          onClick={onChange}
          onOpenChange={onOpenChange}
          defaultSelectedKeys={subMenuKeys}
          style={{
            display: "flex",
            flexDirection: "column",
            width: 180,
            fontSize: "12px"
          }}
        >
          {secondary.map(view => {
            if (view.hasOwnProperty("options")) {
              return (
                <SubMenu
                  key={view.name}
                  style={{
                    fontSize: "12px"
                  }}
                  title={
                    <span>
                      <Icon type={view.icon} />
                      <span
                        style={{
                          fontSize: "12px"
                        }}
                      >
                        {view.name}
                      </span>
                    </span>
                  }
                >
                  {view.options.map(option => {
                    return (
                      <Menu.Item
                        key={option}
                        style={{
                          fontSize: "12px"
                        }}
                      >
                        {option.replace(/[0-9]/g, "")}
                      </Menu.Item>
                    )
                  })}
                </SubMenu>
              )
            } else {
              return (
                <Menu.Item
                  key={view.name}
                  style={{
                    fontSize: "12px",
                    height: "36px"
                  }}
                >
                  <span>
                    <Icon type={view.icon} />
                    <span>{view.name}</span>
                  </span>
                </Menu.Item>
              )
            }
          })}
        </Menu>
      </Layout>
      {phase !== "3" ? (
        <WarningPersona
          view='Persona'
          phase={phase}
          subMenuKeys={subMenuKeys}
        ></WarningPersona>
      ) : null}
    </div>
  )
}

export default SubNav
