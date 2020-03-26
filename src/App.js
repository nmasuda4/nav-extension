import React, { useState, useEffect } from "react"
import Nav from "./components/Nav"
// import Main from "./components/Main"
import "./App.css"

/* global tableau */

const App = () => {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState(["Summary"])
  const [sheets, setSheets] = useState([])
  const [height, setHeight] = useState()
  const [openKeysState, setopenKeysState] = useState([])
  const [subMenuKeys, setsubMenuKeys] = useState(["Understand"])

  const ternary = ["Understand", "Motivate", "Communicate", "Engage"]

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      let dash = tableau.extensions.dashboardContent.dashboard
      const containerHeight = dash.size.height

      const objects = dash.objects.filter(d => {
        return d.type === "blank" || d.type === "extension"
      })

      const skip = ["Vertical", "Horizontal", "Blank", "Nav", "Tiled"]
      const unique = [...new Set(objects.map(d => d.name))].filter(d => {
        return skip.indexOf(d) === -1
      })

      console.log(
        "all objects",
        objects
          .filter(d => {
            return unique.indexOf(d.name) !== -1
          })
          .map(d => {
            return { name: d.name, id: d.id }
          })
      )

      setSheets(
        objects.filter(d => {
          return unique.indexOf(d.name) !== -1
        })
      )

      setLoading(false)
      setHeight(containerHeight)
    })
  }, [])

  function onViewChange(e) {
    let dash = tableau.extensions.dashboardContent.dashboard

    const zoneVisibilityMap = {}

    sheets.map(d => {
      if (d.name === e.key) {
        return (zoneVisibilityMap[d.id] = tableau.ZoneVisibilityType.Show)
      } else {
        return (zoneVisibilityMap[d.id] = tableau.ZoneVisibilityType.Hide)
      }
    })

    if (e.key === "Persona") {
      dash
        .setZoneVisibilityAsync(zoneVisibilityMap)
        .then(() => setView([e.key]))
    } else {
      setView([e.key])
      dash.setZoneVisibilityAsync(zoneVisibilityMap)
    }
  }

  function onSubViewChange(e) {
    setsubMenuKeys([e.key])
    let dash = tableau.extensions.dashboardContent.dashboard

    const zoneVisibilityMap = {}

    sheets.map(d => {
      if (d.name === e.key) {
        return (zoneVisibilityMap[d.id] = tableau.ZoneVisibilityType.Show)
      } else {
        return (zoneVisibilityMap[d.id] = tableau.ZoneVisibilityType.Hide)
      }
    })

    dash.setZoneVisibilityAsync(zoneVisibilityMap)
  }

  // subnav
  function onOpenChange(openKeys) {
    const latestOpenKey = openKeys.find(
      key => openKeysState.indexOf(key) === -1
    )

    if (ternary.indexOf(latestOpenKey) === -1) {
      setopenKeysState(openKeys)
    } else {
      setopenKeysState(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <div>
      {loading ? (
        <div></div>
      ) : (
        <div className='mainContainer'>
          <Nav
            view={view}
            sheets={sheets}
            height={height}
            onViewChange={onViewChange}
            onSubViewChange={onSubViewChange}
            onOpenChange={onOpenChange}
            openKeysState={openKeysState}
            subMenuKeys={subMenuKeys}
          />
        </div>
      )}
    </div>
  )
}

export default App
