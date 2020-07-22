import React, { useState, useEffect } from "react"
import { Button, Radio } from "antd"
/* global tableau */

const Config = () => {
  const [value, setValue] = useState()

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  }

  const getSettings = (type) =>
    new Promise((resolve, reject) => {
      resolve(tableau.extensions.settings.get(type))
    })

  useEffect(() => {
    //Initialise Extension
    tableau.extensions
      .initializeDialogAsync()
      .then(() => {
        const getPhase = async () => {
          getSettings("phase").then((res) => {
            const numericRes = parseInt(res, 10)
            setValue(numericRes)
          })
        }

        getPhase()
      })
      .then(console.log("done"))
  }, [])

  function onChange(e) {
    setValue(e.target.value)
  }

  const setSettings = (type, value) =>
    new Promise((resolve, reject) => {
      tableau.extensions.settings.set(type, value)
      resolve()
    })

  const saveSettings = () =>
    new Promise((resolve, reject) => {
      tableau.extensions.settings
        .saveAsync()
        .then((newSavedSettings) => {
          tableau.extensions.ui.closeDialog(value)
          resolve(newSavedSettings)
        })
        .catch(reject)
    })

  function onSave() {
    setSettings("phase", value).then(saveSettings)
  }

  return (
    <div>
      <div className='d-flex flex-column p-4'>
        <h3>Please select Phase:</h3>

        <Radio.Group className='m-4' onChange={onChange} value={value}>
          <Radio style={radioStyle} value={1}>
            Phase 1
          </Radio>
          <Radio style={radioStyle} value={2}>
            Phase 2
          </Radio>
          <Radio style={radioStyle} value={3}>
            Phase 3
          </Radio>
        </Radio.Group>

        <Button type='primary' onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
export default Config

// const domContainer = document.querySelector("#config_container")
// ReactDOM.render(e(Config), domContainer)
