import React from "react"
import Warning from "./Warning"

const WarningPersona = ({ phase, subMenuKeys }) => {
  console.log("WarningPersona", subMenuKeys[0])
  console.log("WarningPersona Phase", phase)

  if (phase === "2") {
    return subMenuKeys[0] !== "Understand" ? <Warning></Warning> : null
  } else if (phase === "1") {
    return <Warning></Warning>
  }
}
export default WarningPersona
