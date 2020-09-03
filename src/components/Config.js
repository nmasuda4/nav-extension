import React, { useState, useEffect } from "react"
import { Button, Radio, Input } from "antd"

/* global tableau */

const Config = () => {
  const [phase, setPhase] = useState()
  const [portalURL, setURL] = useState()

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
            console.log("numericRes :>> ", numericRes)
            setPhase(numericRes)
          })
        }

        const getURL = async () => {
          getSettings("URL").then((res) => {
            setURL(res)
          })
        }

        getPhase()
        getURL()
      })
      .then(console.log("done"))
  }, [])

  function onPhaseChange(e) {
    setPhase(e.target.value)
  }

  function onURLChange(e) {
    setURL(e.target.value)
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
          tableau.extensions.ui.closeDialog()
          resolve(newSavedSettings)
        })
        .catch(reject)
    })

  const onSave = () => {
    setSettings("phase", phase)
      .then(() => setSettings("URL", portalURL))
      .then(() => saveSettings())
  }

  return (
    <div>
      <div className='d-flex flex-column p-4'>
        <h3>Please select Phase:</h3>

        <Radio.Group className='m-2' onChange={onPhaseChange} value={phase}>
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

        <h3>Please add URL for raw file:</h3>

        <Input
          className='m-2'
          defaultValue='Portal URL'
          value={portalURL}
          onChange={onURLChange}
        />

        <p style={{ fontSize: 11, marginLeft: 12 }}>
          example:
          https://hanoverresearch.secure.force.com/customerportal/myReports
        </p>

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
