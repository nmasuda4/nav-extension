import React from "react"
import WarningIcon from "../WarningIcon.png"

const Warning = () => {
  return (
    <div style={{ width: "80%", height: "100%", padding: 8 }}>
      <div className='WarningIcon'>
        <img
          src={WarningIcon}
          alt='warn'
          height={"60"}
          style={{
            margin: "10px auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        />
        <h3
          style={{
            color: "silver",
            textAlign: "center",
            padding: 8,
            borderBottom: "1px solid silver",
            width: "25%"
          }}
        >
          Not Available
        </h3>
        <p
          style={{
            color: "silver",
            textAlign: "center"
          }}
        >
          This view will be available in a future release.
        </p>
      </div>
    </div>
  )
}
export default Warning
