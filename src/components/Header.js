import React, {useEffect, useState} from 'react';
import { Nav, Alert, Navbar, Button, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import {connect} from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import {resetQues} from '../redux/actions';

function Header({currentUser, resetQues, home}) {
    const [error, setError] = useState("")
    const {logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
        await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    useEffect(()=> {
        resetQues()
    }, [])
    return (
        <>
            <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-between'> 
                    <Nav className="me-auto">
                        <Link className="text-white pr-5 my-2" to="/">
                            {home ? 'Go To Home' : 'New Form'}
                        </Link>
                        <Link className="text-white my-2" to="/listing">
                            All Forms
                        </Link>
                    </Nav>
                    <Nav>
                        <Navbar.Text className="text-white my-2">
                            Signed in as: {currentUser.email}
                        </Navbar.Text>
                        <Navbar.Text>
                            <Button variant="link" className="badge badge-danger m-lg-2 px-0 px-lg-2 text-white" onClick={handleLogout}>
                                LOGOUT
                            </Button>
                        </Navbar.Text>
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
            {error && <Alert variant="danger">{error}</Alert>}
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetQues : () => dispatch(resetQues()),
    }
 }
 
export default connect(mapStateToProps, mapDispatchToProps)(Header);
