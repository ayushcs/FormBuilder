import React from "react"
import { Container, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import Header from "./Header"

export default function Dashboard() {

  return (
    <>
      <Header />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "200px" }}>
          <Card>
            <Card.Body>
                <Link title="New Form" style={{ fontSize: "100px" }} to="/newform" className="d-flex justify-content-around w-100 text-primary" type="button">+</Link>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}
