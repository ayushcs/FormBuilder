import React, { useRef, useState, useEffect } from "react"
import { Container, Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import {connect} from 'react-redux';
import Header from "./Header";

function Signup({currentUser}) {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    if (passwordRef.current.value.length < 6) {
      return setError("Passwords size should be greater or equal to than 6")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError(`Email address ${emailRef.current.value} already in use.`);
          break;
        case 'auth/invalid-email':
          setError(`Email address ${emailRef.current.value} is invalid.`);
          break;
        case 'auth/operation-not-allowed':
          setError(`Error during sign up.`);
          break;
        case 'auth/weak-password':
          setError('Password is not strong enough. Add additional characters including special characters and numbers.');
          break;
        default:
          setError("Failed to create an account")
          break;
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    if (currentUser) {
      history.push("/")
    }
  }, [currentUser]);


  return (
    <>
      <Header showHeaderOnly={true}/>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email"  placeholder="Enter email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password"  placeholder="Enter Password (min 6)" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" placeholder="Enter Password Again" ref={passwordConfirmRef} required />
                </Form.Group>
                <Button variant="dark" disabled={loading} className="w-100" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </Container>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
      currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(Signup);
