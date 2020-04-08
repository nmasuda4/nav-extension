import React from "react"
import Warning from "./Warning"

const WarningPersona = ({ phase, subMenuKeys }) => {
  if (phase === "2") {
    return subMenuKeys[0] !== "Understand" ? <Warning></Warning> : null
  } else if (phase === "1") {
    return <Warning></Warning>
  }
}
export default WarningPersona
