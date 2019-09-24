import React, { useState } from "react"
import { Layout, Menu, Icon } from "antd"
import Logo from "../HRLogo.png"
import LogoCollapsed from "../HRLogoCollapsed.png"
import MenuItem from "antd/lib/menu/MenuItem"

const { Sider } = Layout
const { SubMenu } = Menu

/* global tableau */

const Nav = ({ data, height }) => {
  console.log("data", data)
  console.log("height", height)

  function onChange(e) {
    // parameter
    tableau.extensions.initializeAsync().then(() => {
      tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
        object
      ) {
        console.log(object.name + ":" + object.id + ":" + object.isVisible)
      })

      const views = tableau.extensions.settings.get("views")

      console.log("get", views)

      let extensionName = ["Nav"]
      let keepName = [e.key]
      let extensionVisibilityObject = {}

      tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
        object
      ) {
        if (views.includes(object.name)) {
          if (
            keepName.includes(object.name) ||
            extensionName.includes(object.name)
          ) {
            // show
            extensionVisibilityObject[object.id] =
              tableau.ZoneVisibilityType.Show
          } else {
            // hide
            extensionVisibilityObject[object.id] =
              tableau.ZoneVisibilityType.Hide
          }
        }
      })

      tableau.extensions.dashboardContent.dashboard
        .setZoneVisibilityAsync(extensionVisibilityObject)
        .then(() => {
          console.log("done")
        })
      setItem([e.key])
    })
  }

  const [item, setItem] = useState([])

  console.log("item", item)

  const primary = [
    { name: "Summary", icon: "fund" },
    { name: "Profile", icon: "user" },
    { name: "List", icon: "table" },
    { name: "Methodology", icon: "setting" }
  ]

  return (
    <Layout style={{ maxHeight: `${height - 52}px` }}>
      <Sider
        style={{
          height: `${height - 52}px`,
          display: "flex",
          flexDirection: "column"
        }}
        theme="dark"
        collapsedWidth={60}
        collapsed={true}
      >
        <img
          src={LogoCollapsed}
          alt="website logo"
          // width={collapsed ? "40" : "135"}
          height={"30"}
          style={{
            margin: "10px auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        />
        <Menu
          theme="dark"
          onClick={onChange}
          all={data}
          inlineCollapsed={true}
          // selectedKeys={item}
          selectable
          mode="inline"
          // defaultSelectedKeys={["Summary"]}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: 60
          }}
        >
          {primary.map((d, i) => {
            return (
              <Menu.Item
                key={d.name}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginTop:
                    i === primary.length - 1 ? "auto" : i === 0 ? "20px" : "0px"
                }}
              >
                <Icon type={d.icon} />
                <span>{d.name}</span>
              </Menu.Item>
            )
          })}
        </Menu>
        {/* <p
          style={{
            color: "#bcbbbb",
            backgroundColor: "transparent",
            fontSize: "11px"
          }}
        >
          Copyright © 2019 Hanover Research
        </p> */}
      </Sider>
    </Layout>
  )
}

export default Nav
