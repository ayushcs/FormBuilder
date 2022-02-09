import React, { useEffect, useState } from 'react';
import {retriveForm} from '../firebase';
import { Link,useParams } from 'react-router-dom';
import {connect} from 'react-redux';
import Header from './Header';
import { Alert, Accordion, Card, Container, Row, Col, Form } from 'react-bootstrap';

function ViewResponses({currentUser}) {
    let {fid} = useParams();
    let [valid, setValid] = useState(null);
    let [formData, setFormData] = useState([]);
    let [msg, setMsg] = useState("Loading... Please Wait..");
    useEffect(()=> {
        if (fid) {
            let formDetails = retriveForm(fid);
            formDetails.then((res)=> {
                if (res.exists()) {
                    let currData = res.data()
                    if (currData.ouid === currentUser.uid) {
                        setValid(true)
                        setFormData(currData.response);
                    } else {
                        setMsg('You are not autharized for it!');
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

    useEffect(()=> {
        if(valid && formData.length === 0) {
            setValid(false);
            setMsg('No Responses recieved Yet!');
        }
    }, [formData]);

    const createForm = (data, sno) => {
        let {type, value, id, response} = data;
        let options = value.split("\n")?.filter(item => item);
        let newType = (type === "2") ? 'checkbox' : 'radio'
        return (
            <>  
                { options.map((value, index) => {
                    return (
                        <span className="mx-2" key={value+index+id+sno}>
                            <input type={newType} checked={response[value+index] === true} readOnly={true} id={value+index+newType+id+sno} value={value} name={(type === "2") ? 'checkbox'+id+sno : 'radio'+id+sno} />
                            <label className="ml-2" htmlFor={value+index+newType+id+sno}>{value}</label>
                        </span>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <Header home={true}/>
            
            <Container className="my-5 pt-5">
                {valid && formData.length > 0 ?
                
                    <Accordion defaultActiveKey="0">
                    {
                        formData.map((val, index)=> {
                            return (
                                <Card key={index}>
                                    <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                                        <span>
                                            <span><b>Response By:</b> {val.by}</span>
                                            <span className={"float-right " + (val.email ? "text-success" : "text-danger")}>{val.email ? (<><b>Verified User</b> (Email: {val.email} )</>): <b>Guest User</b>}</span>
                                        </span>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={index.toString()}>
                                        <Card.Body>
                                            <div className='d-flex my-2 justify-content-between'>
                                                <span className='badge badge-info'>Form name: {val.name ? val.name: 'Not Set'} </span>
                                                {val.date ?
                                                <span className='badge badge-info'>Submitted At: {val?.date?.toDate()?.toLocaleString('en-GB')} </span> : null}
                                                {val.updatedAt ?
                                                <span className='badge badge-danger'>Updated At: {val?.updatedAt?.toDate()?.toLocaleString('en-GB')} </span> : null}
                                            </div>
                                            {
                                                val.ques.map((ques, qindex) => {
                                                    return (
                                                        <React.Fragment key={ques.id}>
                                                            <Row>
                                                                <Col className="font-weight-bold my-2">{qindex + 1}) {ques.title}</Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    {ques.type === "1" ?
                                                                        <Form.Control type="text" disabled={true} name="title" value={ques.response}></Form.Control>
                                                                        : createForm(ques,index)
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            )
                        })
                    }
                  </Accordion>
                : <Alert className="mt-3 mx-5" variant="info">
                    {msg} {valid !== null ? <Link to="/listing">Go to Listing</Link> : '' }
                </Alert>
                }
            </Container>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
}

export default connect(mapStateToProps)(ViewResponses);
