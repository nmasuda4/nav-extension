import React, { useState } from "react"
import { Layout, Menu, Icon } from "antd"
import Logo from "../HRLogo.png"
import LogoCollapsed from "../HRLogoCollapsed.png"
import MenuItem from "antd/lib/menu/MenuItem"

const { Sider } = Layout
const { SubMenu } = Menu

/* global tableau */

const Nav = ({ data, main }) => {
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
  const secondary = [
    // { primary: "Summary", name: "Summary" },
    // { primary: "Profile", name: "Demographics" },
    // { primary: "Profile", name: "Preferences" }
    // { primary: "List", name: "List" }
  ]
  const ternary = [{ secondary: "Preferences", name: "Survey 1" }]

  const format = []
  primary.map(d => format.push({ name: d.name, icon: d.icon, options: [] }))

  secondary.map(d => {
    format.map(g => {
      if (g.name === d.primary)
        return g.options.push({ name: d.name, options: [] })
    })
  })

  format.map(d => {
    d.options.map(g => {
      ternary.map(h => {
        if (h.secondary === g.name) return g.options.push(h.name)
      })
    })
  })

  // const modifiedData = data.filter(d => mainCategories.includes(d))
  const hasSummary = data.includes("Summary")

  // console.log("modifiedData", modifiedData)
  console.log("hasSummary", hasSummary)
  // const format = [
  //   { name: "Constructs", options: modifiedData }
  //   // { name: 2, options: [101, 102] }
  // ]

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh" }}>
      <Sider
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
        theme="dark"
        main={main}
        collapsedWidth={60}
      >
        {main ? (
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
        ) : null}
        <Menu
          theme="dark"
          onClick={onChange}
          all={data}
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
            // (
            //   <SubMenu
            //     key={d.name}
            //     title={
            //       <span>
            //         <Icon
            //           type={d.icon}
            //           theme="outlined"
            //           style={{ fontSize: "14px" }}
            //         />
            //         <span>{d.name}</span>
            //       </span>
            //     }
            //   >
            //     {d.options.map(g => {
            //       return (
            //         <Menu.ItemGroup key={g.name} title={g.name}>
            //           {g.options.map(h => {
            //             return <Menu.Item key={h}>{h}</Menu.Item>
            //           })}
            //         </Menu.ItemGroup>
            //       )
            //     })}
            //   </SubMenu>
            // )
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

// {d.options.map((f, i) => {
//   return (
//     <SubMenu
//     key={d.name}
//     title={
//       <span>
//         <Icon
//           type="tags"
//           theme="filled"
//           style={{ fontSize: "9px" }}
//         />
//         <span>{d.name}</span>
//       </span>
//     }
//   >
//     {d.options.map((f, i) => {
//       return (
//         <Menu.Item key={f} style={{ paddingLeft: "18px" }}>
//           <span>{f}</span>
//         </Menu.Item>
//       )
//     })}
//   </SubMenu>

//     <Menu.Item key={f} style={{ paddingLeft: "18px" }}>
//       <span>{f}</span>
//     </Menu.Item>
//   )
// })}
