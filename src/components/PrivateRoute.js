import React from "react"
import { Route, Redirect } from "react-router-dom"
import {connect} from 'react-redux';

function PrivateRoute({ component: Component, currentUser, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    ></Route>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(PrivateRoute);
