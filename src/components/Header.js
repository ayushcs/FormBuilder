import React, {useEffect, useState} from 'react';
import { Nav, Alert, Navbar, Button } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import {connect} from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import {resetQues, reset} from '../redux/actions';
import icon from '../icon.png';
function Header({currentUser,reset, resetQues, home, showHeaderOnly}) {
    const [error, setError] = useState("")
    const {logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            reset()
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
                <Navbar.Brand className="text-white my-2">
                    <img width="28" className='logo' src={icon} />
                    <span>Form Builder</span>
                </Navbar.Brand >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-between'> 
                    <Nav className="me-auto">
                        {!showHeaderOnly? 
                        <><Link className="my-3 px-lg-4 text-white" to="/">
                            {home ? 'Go To Home' : 'New Form'}
                        </Link>
                        <Link className="text-white my-3" to="/listing">
                            All Forms
                        </Link></> : null}
                    </Nav>
                    {!showHeaderOnly? 
                    <Nav>
                        <Navbar.Text className="text-white my-2">
                            Signed in as: {currentUser.email}
                        </Navbar.Text>
                        <Navbar.Text>
                            <Button variant="link" className="badge badge-danger m-lg-2 px-0 px-lg-2 text-white" onClick={handleLogout}>
                                LOGOUT
                            </Button>
                        </Navbar.Text>
                    </Nav> : null}
                </Navbar.Collapse>
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
        reset : () => dispatch(reset()),

    }
 }
 
export default connect(mapStateToProps, mapDispatchToProps)(Header);
