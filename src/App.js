import React, { useState, useEffect } from "react"
import { Spin } from "antd"
import "./App.css"
import Nav from "./components/Nav"

/* global tableau */

const App = () => {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState([])
  const [profile, setProfile] = useState([])
  const [height, setHeight] = useState()

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      // tableau.extensions.settings.erase("dashboard")
      // tableau.extensions.settings.erase("profile")

      // const containerHeight =
      //   tableau.extensions.dashboardContent.dashboard.size.height

      const dashboard = []
      const profile = []

      const promises = tableau.extensions.dashboardContent.dashboard.getParametersAsync()
      // .then(d => {
      //   return d.map(parameter => {
      //     if (parameter.name === "Dashboard") {
      //       return parameter.allowableValues.allowableValues.map(option => {
      //         return dashboard.push(option.formattedValue)
      //       })
      //     } else if (parameter.name === "Profile") {
      //       return parameter.allowableValues.allowableValues.map(option => {
      //         return profile.push(option)
      //       })
      //     }
      //   })
      // })

      // Wait for all requests, and then setData
      promises.then(() => {
        // tableau.extensions.settings.set("dashboard", dashboard)
        // tableau.extensions.settings.set("profile", profile)
        // console.log("dashboard", dashboard)
        // console.log("profile", profile)
        // setDashboard(dashboard)
        // setProfile(profile)
        setLoading(false)
        // setHeight(containerHeight)
      })
    })
  }, [])

  return (
    <div>
      {loading ? (
        <Spin></Spin>
      ) : (
        <div>Test</div>
        //<Nav dashboard={dashboard} profile={profile} height={height} />
      )}
    </div>
  )
}

export default App
