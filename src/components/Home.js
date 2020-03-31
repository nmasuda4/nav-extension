import React, { useState, useEffect, useCallback } from "react"
import Nav from "./Nav"

// import Main from "./components/Main"
import "../App.css"

/* global tableau */
const App = () => {
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState("1")
  const [view, setView] = useState(["Summary"])
  const [sheets, setSheets] = useState([])
  const [height, setHeight] = useState()
  const [openKeysState, setopenKeysState] = useState([])
  const [subMenuKeys, setsubMenuKeys] = useState(["Understand"])

  //table
  const [initialListLoad, setInitialListLoad] = useState(false)
  const [tableConfig, setTableConfig] = useState([])
  const [tableData, setTableData] = useState([])

  const ternary = ["Understand", "Motivate", "Communicate", "Engage"]
  console.log(window.location.origin)

  const getSettings = type =>
    new Promise((resolve, reject) => {
      resolve(tableau.extensions.settings.get(type))
    })

  useEffect(() => {
    tableau.extensions.initializeAsync({ configure: configure }).then(() => {
      getSettings("phase").then(res => {
        // const numericRes = parseInt(res, 10)
        console.log("numericRes", res)
        setPhase(res)
      })

      let dash = tableau.extensions.dashboardContent.dashboard
      const containerHeight = dash.size.height

      const objects = dash.objects.filter(d => {
        return d.type === "blank" || d.type === "extension"
      })

      const skip = ["Vertical", "Horizontal", "Blank", "Nav", "Tiled"]
      const unique = [...new Set(objects.map(d => d.name))].filter(d => {
        return skip.indexOf(d) === -1
      })

      setSheets(
        objects.filter(d => {
          return unique.indexOf(d.name) !== -1
        })
      )

      setLoading(false)
      setHeight(containerHeight)
    })
  }, [phase])

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

  // dialog
  function configure() {
    let payload = ""

    console.log("[Extension.js] configure Sending payload", payload)
    const popupUrl = `${window.location.origin}/extensions/hea_master/#/configure`
    tableau.extensions.ui
      .displayDialogAsync(popupUrl, payload, { height: 300, width: 300 })
      .then(closePayload => {
        console.log("Window closed", closePayload)
        setPhase(closePayload)
      })
      .catch(error => {
        switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
            console.log("[Extension.js] Dialog was closed by user")
            // refreshSettings()
            console.log("[Extension.js] Config window closed")
            break
          default:
            console.error("[Extension.js]", error.message)
        }
      })
  }

  return (
    <div>
      {loading ? (
        <div></div>
      ) : (
        <div className='mainContainer'>
          <Nav
            phase={phase}
            view={view}
            sheets={sheets}
            height={height}
            onViewChange={onViewChange}
            onSubViewChange={onSubViewChange}
            onOpenChange={onOpenChange}
            openKeysState={openKeysState}
            subMenuKeys={subMenuKeys}
            initialListLoad={initialListLoad}
            setInitialListLoad={setInitialListLoad}
            tableConfig={tableConfig}
            setTableConfig={setTableConfig}
            tableData={tableData}
            setTableData={setTableData}
          />
        </div>
      )}
    </div>
  )
}

export default App
