import React from "react"
import { HashRouter, Switch, Route } from "react-router-dom"
import Home from "./components/Home"
import Config from "./components/Config"

const App = () => {
  return (
    <HashRouter>
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/configure' component={Config} />
        </Switch>
      </div>
    </HashRouter>
  )
}

export default App
