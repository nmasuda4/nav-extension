import React, { useState } from "react"
import { Layout, Menu, Icon } from "antd"
import "antd/dist/antd.css"
import Logo from "../HRlogo.png"

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

/* global tableau */

const Nav = ({ data }) => {
  console.log("data", data)

  function onChange(e, all) {
    console.log(`selected ${e.key}`)
    console.log("all", all)

    // parameter
    tableau.extensions.initializeAsync().then(() => {
      console.log(
        "log",
        tableau.extensions.dashboardContent.dashboard.getParametersAsync()
      )
      const parameters = tableau.extensions.dashboardContent.dashboard
        .getParametersAsync()
        .then(d => {
          d.map(parameter => {
            return parameter.changeValueAsync(e.key)
          })
        })

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
          // else if (object.id !== 12) {

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

  function changeCollapse() {
    setCollapse(!collapse)
  }

  const [item, setItem] = useState([])
  const [collapse, setCollapse] = useState(false)

  console.log("item", item)

  const format = [
    { name: 1, options: [1, 2, 3] },
    { name: 2, options: [101, 102] }
  ]
  const names = [1, 2]
  // data = [1,2,3,4,5]
  // if (data.map((d,i) => {
  //   const format = [];
  //   const obj = {};

  //   d < 100 ? obj.name = names[0]

  //   format.push(d) :
  //   name.push({options.push(d)})
  // }) )

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapse} onCollapse={changeCollapse}>
        <img
          src={Logo}
          alt="website logo"
          width="135"
          height="30"
          style={{ margin: "10px" }}
        />
        <Menu
          theme="dark"
          onClick={onChange}
          all={data}
          selectedKeys={item}
          mode="inline"
        >
          {format.map(d => {
            return (
              <SubMenu
                key={d.name}
                title={
                  <span>
                    <Icon type="bar-chart" />
                    <span>{d.name}</span>
                  </span>
                }
              >
                {d.options.map((f, i) => {
                  return (
                    <Menu.Item key={f}>
                      <Icon type="right-square" />
                      <span>{f}</span>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            )
          })}
          {/* <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            {data.map((d, i) => {
              if (i <= 2)
                return (
                  <Menu.Item key={d}>
                    <Icon type="mail" />
                    <span>{d}</span>
                  </Menu.Item>
                )
            })}
          </SubMenu>

          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            {data.map((d, i) => {
              if (i > 2)
                return (
                  <Menu.Item key={d}>
                    <Icon type="mail" />
                    <span>{d}</span>
                  </Menu.Item>
                )
            })}
          </SubMenu> */}
        </Menu>
      </Sider>
    </Layout>
  )
}

export default Nav

// <Layout style={{ minHeight: '100vh' }}>
//   <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
//     <div className="logo" />
//     <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
//       <Menu.Item key="1">
//         <Icon type="pie-chart" />
//         <span>Option 1</span>
//       </Menu.Item>
//       <Menu.Item key="2">
//         <Icon type="desktop" />
//         <span>Option 2</span>
//       </Menu.Item>
//       <SubMenu
//         key="sub1"
//         title={
//           <span>
//             <Icon type="user" />
//             <span>User</span>
//           </span>
//         }
//       >
//         <Menu.Item key="3">Tom</Menu.Item>
//         <Menu.Item key="4">Bill</Menu.Item>
//         <Menu.Item key="5">Alex</Menu.Item>
//       </SubMenu>
//       <SubMenu
//         key="sub2"
//         title={
//           <span>
//             <Icon type="team" />
//             <span>Team</span>
//           </span>
//         }
//       >
//         <Menu.Item key="6">Team 1</Menu.Item>
//         <Menu.Item key="8">Team 2</Menu.Item>
//       </SubMenu>
//       <Menu.Item key="9">
//         <Icon type="file" />
//         <span>File</span>
//       </Menu.Item>
//     </Menu>
//   </Sider>

// </Layout>
