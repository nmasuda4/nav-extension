const e = React.createElement
const useState = React.useState
const { Switch } = antd

/* global tableau */

const Config = () => {
  // const [main, setMain] = useState(true)

  function onChange(checked) {
    console.log(`switch to ${checked}`)
    tableau.extensions.initializeDialogAsync().then(() => {
      // tableau.extensions.settings.set("collapsed", !checked)
      // setMain(!checked)

      tableau.extensions.settings.set("main", checked)

      tableau.extensions.settings.saveAsync()
    })
  }

  return (
    <div>
      <div>
        <h3>Main?</h3>
        <Switch
          defaultChecked
          onChange={onChange}
          checkedChildren={"true"}
        ></Switch>
      </div>
    </div>
  )
}

const domContainer = document.querySelector("#config_container")
ReactDOM.render(e(Config), domContainer)
