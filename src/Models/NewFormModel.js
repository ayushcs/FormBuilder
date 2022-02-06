import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap"

function NewFormModel(props) {
    let [ques, setQues] = useState({
        'title': '',
        'type': '1',
        'value': '',
        'id' : ''
    });
    let [error, setError] = useState('');

    const handleChange = (e) => {
        let currQues = Object.assign({}, ques)
        currQues[e.target.name] = e.target.value?.trim();
        setQues({...currQues})
    }

    useEffect(()=> {
        setQues(props.updateques)
    }, [props.updateques])

    const resetState = (close)=> {
        if (!close && (! ques.title || (ques.type != '1' && !ques.value))) {
            setError('Feilds cannot be empty!')
        } else {
            setError('')
            props.onHide(ques, close);
        }
    }

    return (
      <Modal
        {...props}
        onShow = {()=> setQues({
            'title': '',
            'type': '1',
            'value': '',
            'id' : ''
        })}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
             Add Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form >
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group id={"Question"}>
                    <Form.Label>Question :</Form.Label>
                    <Form.Control placeholder="Enter your Question" defaultValue={ques.title} type="text" name="title" onChange={handleChange} />
                </Form.Group >
                <Form.Group id={"type"} >
                    <Form.Label>Response Type: </Form.Label>
                    <Form.Control value={ques.type} name="type" onChange={handleChange} as="select">
                        <option value="1" >Text</option>
                        <option value="2" >Multiple Choice</option>
                        <option value="3">Radio</option>
                    </Form.Control >
                </Form.Group >
                <Form.Group id={"value"} >
                    {ques['type'] != "1" ?
                        <Form.Control as="textarea" defaultValue={ques.value}  placeholder="Enter new options in new line" name="value" onChange={handleChange}></Form.Control >
                        : null
                    }
                </Form.Group >
            </Form>
                
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={()=>resetState(false)}>{props.modify ? 'Change' : 'Add'}</Button>
          <Button variant="dark" onClick={()=>resetState(true)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

  
export default NewFormModel;
