import React from 'react';
import { Modal, Button, Form, Alert } from "react-bootstrap"

function SuccedModel(props) {
  return (
        <>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Form Saved!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert className="my-2" variant="success">
                        Form is saved successfully, You can share the below link to get responses!
                    </Alert>
                    <Form.Control type="text" name="url" className="mt-2" readOnly={true} value={props.url}></Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.handleClose}>OK</Button>
                </Modal.Footer>
            </Modal>
        </>
  )
}

export default SuccedModel;
