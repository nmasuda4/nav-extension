import React, { useState, useEffect } from "react"
import "./App.css"
import Nav from "./components/Nav"

/* global tableau */

const App = () => {
  const [loading, setLoading] = useState(true)
  const [parameter, setParameter] = useState([])
  const [main, setMain] = useState([])
  const [height, setHeight] = useState()
  console.log("hello")

  // function configure() {
  //   const popupUrl = "http://localhost:4000/config.html"
  //   let defaultPayload = ""
  //   tableau.extensions.ui
  //     .displayDialogAsync(popupUrl, defaultPayload, { height: 400, width: 600 })
  //     .then(closePayload => {})
  //     .catch(error => {
  //       switch (error.errorCode) {
  //         case tableau.ErrorCodes.DialogClosedByUser:
  //           console.log("Dialog was closed by user")
  //           break
  //         default:
  //           console.error(error.message)
  //       }
  //     })
  // }

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      // clear old views
      tableau.extensions.settings.erase("views")
      tableau.extensions.settings.erase("main")
      const containerHeight =
        tableau.extensions.dashboardContent.dashboard.size.height
      const list = []
      const promises = tableau.extensions.dashboardContent.dashboard
        .getParametersAsync()
        .then(d => {
          return d.map(parameter => {
            if (parameter.name === "Dashboard") {
              return parameter.allowableValues.allowableValues.map(option => {
                return list.push(option.formattedValue)
              })
            }
          })
        })

      // Wait for all requests, and then setData
      promises.then(() => {
        console.log("list", list)
        tableau.extensions.settings.set("views", list)

        setLoading(false)
        setParameter(list)
        setHeight(containerHeight)
      })
    })
  }, [])
  // }

  return (
    <div>
      {loading ? (
        <div className="text-danger">Loading</div>
      ) : (
        <Nav data={parameter} height={height} />
      )}
    </div>
  )
}

export default App
