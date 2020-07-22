import React, { useState, useEffect } from "react"
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

  const ternary = ["Understand", "Motivate", "Communicate", "Engage"]

  const getSettings = (type) =>
    new Promise((resolve, reject) => {
      resolve(tableau.extensions.settings.get(type))
    })

  useEffect(() => {
    tableau.extensions.initializeAsync({ configure: configure }).then(() => {
      getSettings("phase").then((res) => {
        setPhase(res)
      })

      let dash = tableau.extensions.dashboardContent.dashboard
      const containerHeight = dash.size.height

      const objects = dash.objects.filter((d) => {
        return d.type === "blank" || d.type === "extension"
      })

      const skip = ["Vertical", "Horizontal", "Blank", "Nav", "Tiled"]
      const unique = [...new Set(objects.map((d) => d.name))].filter((d) => {
        return skip.indexOf(d) === -1
      })

      //objects.map((d) => console.log("objects", d.name, d.id))

      setSheets(
        objects.filter((d) => {
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

    sheets.map((d) => console.log("sheets", d.name, d.id))

    sheets.map((d) => {
      if (d.name === e.key) {
        return (zoneVisibilityMap[d.id] = tableau.ZoneVisibilityType.Show)
      } else {
        return (zoneVisibilityMap[d.id] = tableau.ZoneVisibilityType.Hide)
      }
    })

    if (e.key === "Summary") {
      zoneVisibilityMap[
        sheets.filter((d) => d.name === "Summary Blank")[0].id
      ] = tableau.ZoneVisibilityType.Show

      zoneVisibilityMap[
        sheets.filter((d) => d.name === "Summary Blank Two")[0].id
      ] = tableau.ZoneVisibilityType.Show
    }

    if (e.key === "Persona") {
      if (openKeysState.length === 0) {
        zoneVisibilityMap[sheets.filter((d) => d.name === "Understand")[0].id] =
          tableau.ZoneVisibilityType.Show

        zoneVisibilityMap[
          sheets.filter((d) => d.name === "Understand Title")[0].id
        ] = tableau.ZoneVisibilityType.Show
      }
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

    sheets.map((d) => {
      if (d.name === e.key || d.name === "Persona") {
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
      (key) => openKeysState.indexOf(key) === -1
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

    const popupUrl = `${window.location.origin}/extensions/hea_master_test2/#/configure`
    // const popupUrl = `${window.location.origin}/#/configure`

    tableau.extensions.ui
      .displayDialogAsync(popupUrl, payload, {
        height: 300,
        width: 300,
      })
      .then((closePayload) => {
        setPhase(closePayload)
      })
      .catch((error) => {
        switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
            // refreshSettings()
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
            // tableConfig={tableConfig}
            // setTableConfig={setTableConfig}
            // defaultTableData={defaultTableData}
            // setDefaultTableData={setDefaultTableData}
          />
        </div>
      )}
    </div>
  )
}

export default App
