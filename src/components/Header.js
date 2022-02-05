import React, {useState} from 'react';
import { Alert, Navbar, Button, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import {connect} from 'react-redux';
import { Link, useHistory } from "react-router-dom";

function Header({currentUser}) {
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
    return (
        <>
            <Navbar fixed="top" className="bg-primary">
                <Container>
                    <Navbar.Brand>
                        <Link className="text-white pr-5" to="/">
                        New Form
                        </Link>
                        <Link className="text-white" to="/update-profile">
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
export default connect(mapStateToProps)(Header);
