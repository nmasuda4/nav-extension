import React, { useState, useEffect } from "react"
import "./App.css"
import Filter from "./components/Filter"
import Nav from "./components/Nav"
import Bar from "./components/Bar"

/* global tableau */

const App = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [parameter, setParameter] = useState([])
  console.log("hello")

  // function configure() {
  //   const popupUrl = "http://localhost:4000/config.html";
  //   let defaultPayload = "";
  //   tableau.extensions.ui
  //     .displayDialogAsync(popupUrl, defaultPayload, { height: 400, width: 600 })
  //     .then(closePayload => {})
  //     .catch(error => {
  //       switch (error.errorCode) {
  //         case tableau.ErrorCodes.DialogClosedByUser:
  //           console.log("Dialog was closed by user");
  //           break;
  //         default:
  //           console.error(error.message);
  //       }
  //     });
  // }

  // function getFilters() {
  //   tableau.extensions.initializeAsync().then(() => {
  //     const worksheets =
  //       tableau.extensions.dashboardContent.dashboard.worksheets;
  //     const filters = [];
  //     const promises = worksheets.map(d => {
  //       return d.getFiltersAsync().then(f => {
  //         f.map(g => {
  //           return g.appliedValues.map((h, i) => {
  //             return filters.push(h.formattedValue);
  //           });
  //         });
  //       });
  //     });

  //     // Wait for all requests, and then setData
  //     Promise.all(promises).then(() => {
  //       console.log("filters", filters);
  //       setData(filters);
  //       setLoading(false);
  //     });
  //   });
  // }

  // function getParameter() {

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      const list1 = []
      const promises = tableau.extensions.dashboardContent.dashboard
        .getParametersAsync()
        .then(d => {
          d.map(parameter => {
            if (parameter.name === "Dashboard") {
              return parameter.allowableValues.allowableValues.map(option => {
                return list1.push(option.formattedValue)
              })
            }
          })
        })

      // tableau.extensions.settings.set("views", list1)

      // .then(d => {
      //   console.log('d', d)
      //   // d.map(parameter => {
      //   //   return parameter.allowableValues.allowableValues.map(datavalue => {
      //   //     return list1.push(datavalue.value)
      //   //   })
      //   // })
      // })
      // Wait for all requests, and then setData
      promises.then(() => {
        console.log("list", list1)
        // const views = tableau.extensions.settings.get("views")
        setLoading(false)
        setParameter(list1)
        // typeof views !== "undefined" ? setLoading(true) : setLoading(false);
      })
    })
  }, [])
  // }

  return (
    <div className="App">
      {loading ? (
        <div>Loading</div>
      ) : (
        // <Filter data={parameter}></Filter>
        <div>
          <Nav data={parameter} />
        </div>
      )}
      {/* <button id="initializeButton" onClick={getParameter} className="btn btn-primary">
          Initialize Extensions API
        </button> */}
    </div>
  )
}

export default App
