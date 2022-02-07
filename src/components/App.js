import React from "react"
import Signup from "./Signup"
import AuthProvider from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import NewForm from "./NewForm"
import { Provider } from "react-redux"
import store from "../store"
import FillForm from "./FillForm"
import Listing from "./Listing"
import viewResponses from "./ViewResponses"
function App() {
  return (
      <>
        <Provider store={store}>
          <Router>
            <AuthProvider>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/newform" component={NewForm} />
                <PrivateRoute path="/listing" component={Listing} />
                <PrivateRoute path="/viewresponses/:fid" component={viewResponses} />
                <Route path="/signup" component={Signup} />
                <Route path="/fillform/:uid/:fid" component={FillForm} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />

              </Switch>
            </AuthProvider>
          </Router>
        </Provider>
        <div className="badge badge-dark p-2 m-2 position-fixed" style={{bottom: 0, right: 0}}> Designed by - <a href="https://github.com/ayushcs/" target="_blank" className="text-danger">Ayush Srivastava</a> &#169; 2022</div>
      </>
  )
}

export default App
