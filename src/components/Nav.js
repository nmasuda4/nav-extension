import React, { useState } from "react"
import { Layout, Menu, Icon } from "antd"
import LogoCollapsed from "../HRLogoCollapsed.png"

const { Sider } = Layout

/* global tableau */

const Nav = ({ dashboard, profile, height }) => {
  console.log("profile", profile)

  function onChange(e) {
    tableau.extensions.initializeAsync().then(() => {
      tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
        object
      ) {
        console.log(
          object.name +
            ":" +
            object.id +
            ":" +
            object.isVisible +
            ":" +
            object.type
        )
      })

      const profileViews = profile.map(d => {
        return d._formattedValue
      })

      let extensionName = ["Nav"]
      let keepName = [e.key]
      let dash = tableau.extensions.dashboardContent.dashboard
      let extensionVisibilityObject = {}
      const currentProfile = []

      const promises = dash.findParameterAsync("Profile").then(parameter => {
        dash.objects.forEach(function(obj) {
          if (obj.name === parameter.currentValue._formattedValue) {
            return currentProfile.push(obj.id)
          }
        })
      })

      console.log("currentProfile", currentProfile)
      promises.then(() => {
        tableau.extensions.dashboardContent.dashboard.objects.forEach(function(
          object
        ) {
          if (
            dashboard.includes(object.name) ||
            profileViews.includes(object.name) ||
            object.name === "Understand"
          ) {
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

          if (keepName.includes("Profile")) {
            console.log("id", currentProfile[0])

            extensionVisibilityObject[currentProfile[0]] =
              tableau.ZoneVisibilityType.Show
          }
        })

        console.log("obj", extensionVisibilityObject)
        tableau.extensions.dashboardContent.dashboard
          .setZoneVisibilityAsync(extensionVisibilityObject)
          .then(() => {
            console.log("done")
          })
        setItem([e.key])
      })
    })
  }

  const [item, setItem] = useState([])

  console.log("item", item)

  const primary = [
    { name: "Summary", icon: "fund" },
    { name: "Profile", icon: "user" },
    { name: "List", icon: "table" },
    { name: "Methodology", icon: "tool" }
  ]

  return (
    <Layout
      style={{ height: "100vh", margin: "0px", backgroundColor: "white" }}
    >
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
          // all={data}
          // inlineCollapsed={true}
          selectedKeys={item}
          selectable
          mode="inline"
          defaultSelectedKeys={["Summary"]}
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
                <span
                  style={{
                    background: "green"
                  }}
                >
                  {d.name}
                </span>
              </Menu.Item>
            )
          })}
        </Menu>
      </Sider>
    </Layout>
  )
}

export default Nav
