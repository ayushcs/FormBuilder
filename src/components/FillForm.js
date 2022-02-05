import React, { useEffect, useState } from 'react';
import { Alert, Form, Row, Col, Container, Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"

import { useParams } from 'react-router-dom';
import {retriveForm} from '../firebase'
function FillForm() {
    let {uid, fid} = useParams();
    console.log(uid,fid)
    let [valid, setValid] = useState(null);
    let [msg, setMsg] = useState("Loading... Please Wait..");

    let [formData, setFormData] = useState({});
    const history = useHistory()

    useEffect(()=> {
        if (uid && fid) {
            let formDetails = retriveForm(fid);
            formDetails.then((res)=> {
                if (res.exists()) {
                    let currData = res.data()
                    if (currData.ouid === uid) {
                        delete currData.response;
                        setFormData(currData);
                        console.log(currData)
                        setValid(true)
                    } else {
                        setMsg('Invalid Link!');
                    }
                } else {
                    setValid(false);
                    setMsg('Invalid Link!');
                }
            }).catch(()=> {
                setValid(false)
                setMsg('Unable to get the form!');
            })
        }
    },[]);

    const createForm = (data) => {
        let {type, value, id} = data;
        let options = value.split("\n")?.filter(item => item);
        let newType = (type == "2") ? 'checkbox' : 'radio'
        return (
            <>  
                { options.map((value, index) => {
                    return (
                        <span className="mx-2" key={value}>
                            <input type={newType} id={value+index+newType} value={value} onChange={(e)=> handleChange(e,data)} name={(type == "2") ? value : 'radio'+id} />
                            <label className="ml-2" htmlFor={value+index+newType}>{value}</label>
                        </span>
                    )
                })}
            </>
        )
    }

    const submitForm = () => {

    }

    const handleChange = (e,data) => {
        console.log(e.target.value, data)
    }
    return (
        <>
            {valid ?
            <>
                <Container>
                    <div className='d-flex my-2 justify-content-between'>
                        <span className='badge badge-success'>Form By: {formData.oemail} </span>
                        <span className='badge badge-info'>Form name: {formData.ques.name ? formData.ques.name: 'Not Set'} </span>
                        <span className='badge badge-info'>Created At: {formData?.date?.toDate()?.toGMTString()} </span>
                    </div>
                    <Form>
                        {
                            formData.ques.ques.map((val, index) => {
                                return (
                                    <React.Fragment key={val.id}>
                                        <Row>
                                            <Col className="font-weight-bold my-2">{index + 1}) {val.title}</Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {val.type == "1" ?
                                                    <Form.Control type="text" name="title" onChange={(e)=> handleChange(e,val)} placeholder="Your Answer"></Form.Control>
                                                    : createForm(val)
                                                }
                                                
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )
                            })
                        }
                        <div className="row justify-content-end px-3">
                            <Button className="mt-2" onClick={submitForm}>Submit Form</Button>
                        </div>
                    </Form>
                </Container>
            </>
            : <Alert className="mt-3 mx-5" variant="info">
                {msg} {valid != null ? <Link to="/">Go to Home</Link> : '' }
              </Alert>
            }
        </>
    );
}

export default FillForm;
