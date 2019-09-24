import React, { useState, useEffect } from "react"
import "./App.css"
import Nav from "./components/Nav"

/* global tableau */

const App = () => {
  const [loading, setLoading] = useState(true)
  const [parameter, setParameter] = useState([])
  const [main, setMain] = useState([])
  console.log("hello")

  function configure() {
    const popupUrl = "http://localhost:4000/config.html"
    let defaultPayload = ""
    tableau.extensions.ui
      .displayDialogAsync(popupUrl, defaultPayload, { height: 400, width: 600 })
      .then(closePayload => {})
      .catch(error => {
        switch (error.errorCode) {
          case tableau.ErrorCodes.DialogClosedByUser:
            console.log("Dialog was closed by user")
            break
          default:
            console.error(error.message)
        }
      })
  }

  useEffect(() => {
    tableau.extensions.initializeAsync({ configure: configure }).then(() => {
      // clear old views
      tableau.extensions.settings.erase("views")
      setMain(tableau.extensions.settings.get("main"))

      const list1 = []
      const promises = tableau.extensions.dashboardContent.dashboard
        .getParametersAsync()
        .then(d => {
          return d.map(parameter => {
            if (parameter.name === "Dashboard") {
              return parameter.allowableValues.allowableValues.map(option => {
                return list1.push(option.formattedValue)
              })
            }
          })
        })

      // Wait for all requests, and then setData
      promises.then(() => {
        console.log("list", list1)
        tableau.extensions.settings.set("views", list1)

        setLoading(false)
        setParameter(list1)
      })
    })
  }, [])
  // }

  return (
    <div>
      {loading ? (
        <div className="text-danger">Loading</div>
      ) : (
        <Nav data={parameter} main={main} />
      )}
    </div>
  )
}

export default App
