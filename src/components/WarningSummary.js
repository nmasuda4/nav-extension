import React from "react"
import WarningChart from "../images/WarningChart.png"

const WarningSummary = ({ phase }) => {
  if (phase === "1") {
    return (
      <div style={{ height: "100%", width: "100%", padding: 8 }}>
        <div className='WarningChart'>
          <img
            src={WarningChart}
            alt='warn'
            height={"60"}
            style={{
              margin: "10px auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <h3
            style={{
              color: "silver",
              textAlign: "center",
              padding: 8,
              borderBottom: "1px solid silver",
              width: "25%",
            }}
          >
            Chart Not Available
          </h3>
          <p
            style={{
              color: "silver",
              textAlign: "center",
            }}
          >
            This view will be available in a future release.
          </p>
        </div>
      </div>
    )
  } else {
    return null
  }
}
export default WarningSummary
