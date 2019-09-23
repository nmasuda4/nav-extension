import React, { useState } from "react"
import { Layout, Menu, Icon } from "antd"
import "antd/dist/antd.css"
import Logo from "../HRlogo.png"

const { Sider } = Layout
const { SubMenu } = Menu

/* global tableau */

const Nav = ({ data }) => {
  console.log("data", data)

  function onChange(e, all) {
    // parameter
    tableau.extensions.initializeAsync().then(() => {
      tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
        object
      ) {
        console.log(object.name + ":" + object.id + ":" + object.isVisible)
      })

      const views = tableau.extensions.settings.get("views")

      console.log("get", views)
      // setValue(retrieved)

      let extensionName = ["Nav"]
      let keepName = [e.key]
      // let views = ["1", "2", "3", "101", "102"]
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

  const modifiedData = data.filter(d => d !== "Summary")
  const hasSummary = data.includes("Summary")

  console.log("modifiedData", modifiedData)
  console.log("hasSummary", hasSummary)
  const format = [
    { name: "Constructs", options: modifiedData }
    // { name: 2, options: [101, 102] }
  ]

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh" }}>
      <Sider
        width={280}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
        theme="dark"
      >
        <img
          src={Logo}
          alt="website logo"
          width="135"
          height="30"
          className="d-flex justify-content-center align-items-center"
          style={{ margin: "10px" }}
        />
        <Menu
          theme="dark"
          onClick={onChange}
          all={data}
          selectedKeys={item}
          mode="inline"
          defaultSelectedKeys={["Summary"]}
          style={{ flexGrow: 1, height: "100%" }}
        >
          {hasSummary ? (
            <Menu.Item key="Summary">
              <Icon type="fund" theme="filled" style={{ fontSize: "18px" }} />
              <span>Summary</span>
            </Menu.Item>
          ) : null}

          {format.map(d => {
            return (
              <SubMenu
                key={d.name}
                title={
                  <span>
                    <Icon
                      type="tags"
                      theme="filled"
                      style={{ fontSize: "18px" }}
                    />
                    <span>{d.name}</span>
                  </span>
                }
              >
                {d.options.map((f, i) => {
                  return (
                    <Menu.Item key={f} style={{ paddingLeft: "18px" }}>
                      <span>{f}</span>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            )
          })}
        </Menu>
        <p
          style={{
            color: "#bcbbbb",
            backgroundColor: "transparent",
            fontSize: "11px"
          }}
        >
          Copyright © 2019 Hanover Research
        </p>
      </Sider>
    </Layout>
  )
}

export default Nav
