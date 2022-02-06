import React, {useEffect, useState} from 'react';
import { Alert, Navbar, Button, Container } from "react-bootstrap"
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
            <Navbar fixed="top" className="bg-primary">
                <Container>
                    <Navbar.Brand>
                        <Link className="text-white pr-5" to="/">
                            {home ? 'Go To Home' : 'New Form'}
                        </Link>
                        <Link className="text-white" to="/listing">
                            All Forms
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="text-white">
                        Signed in as: {currentUser.email}
                        </Navbar.Text>
                        <Navbar.Text>
                        <Button variant="link" className="text-white" onClick={handleLogout}>
                        LOGOUT
                        </Button>
                        </Navbar.Text>
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
