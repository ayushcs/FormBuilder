import React, { useContext, useState, useEffect } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword , signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../firebase"
import {connect} from 'react-redux';
import {saveCurrUser} from '../redux/actions'
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider(props) {
  const {currentUser, updateUser, children} = props;
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

 

  useEffect(() => onAuthStateChanged(auth, (user) => {
      updateUser(user)
      setLoading(false)
    })
  , [])

  const value = {
    login,
    signup,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
 return {
    updateUser : (user) => dispatch(saveCurrUser(user))
 }
}

export default connect(mapStateToProps,mapDispatchToProps)(AuthProvider);
