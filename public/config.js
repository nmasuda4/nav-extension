const e = React.createElement
const useState = React.useState
const useEffect = React.useEffect
const { Tree, Icon } = antd
const { TreeNode } = Tree

/* global tableau */

// we need views, names, icons, top or side

const Config = () => {
  const [loading, setLoading] = useState(true)
  const [views, setViews] = useState([1, 2, 3])

  useEffect(() => {
    tableau.extensions.initializeDialogAsync().then(() => {
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

      // Wait for all requests, and then setData
      promises.then(() => {
        tableau.extensions.settings.set("views", list1)

        // console.log("views", tableau.extensions.settings.get("views"));
        console.log("list1", list1)
        setLoading(false)
        setViews(list1)
      })
    })
  }, [])

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>
      list
      {views.map(d => {
        return <p>{d}</p>
      })}
      return ( )
    </div>
  )
}

const domContainer = document.querySelector("#config_container")
ReactDOM.render(e(Config), domContainer)
