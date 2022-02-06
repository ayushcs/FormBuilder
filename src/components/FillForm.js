import React, { useEffect, useState } from 'react';
import { Alert, Form, Row, Col, Container, Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import {updateFormResponse} from '../firebase';
import { useParams } from 'react-router-dom';
import {retriveForm} from '../firebase'
import SuccedModel from '../Models/SuccedModel';
import {connect} from 'react-redux';

function FillForm({currentUser}) {
    let {uid, fid} = useParams();
    let [valid, setValid] = useState(null);
    let [err, setErr] = useState(null);
    let [visitedUser, setVisitedUser] = useState(false);
    let [nonEditable, setNonEditable] = useState(false);

    let [msg, setMsg] = useState("Loading... Please Wait..");
    const [successModel, setSucessModel] = useState(false);

    let [formData, setFormData] = useState({});
    let [responseName, setResponseName] = useState(formData?.ques?.by);
    const history = useHistory()

    useEffect(()=> {
        if (uid && fid) {
            let formDetails = retriveForm(fid);
            formDetails.then((res)=> {
                if (res.exists()) {
                    let currData = res.data()
                    if (currData.ouid === uid) {
                        let visited = isVisitedUsers(currData.response)
                        console.log(currData)
                        if (visited) {
                            currData['ques'] = visited;
                            setVisitedUser(true);
                        }
                        setFormData(currData);
                        setValid(true)
                        if (currentUser && currentUser.uid == uid) {
                            setNonEditable(true)
                            setErr('As you are the owner, You cannot submit/edit the form!');
                        }
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

    useEffect(()=> {
        if (formData?.ques?.by) {
            setResponseName(formData?.ques?.by)
        }
    }, [formData])

    const isVisitedUsers = (response)=> {
        let responseData = response.filter((item) => item.email == currentUser.email);
        if (responseData.length > 0) {
            return responseData[0];
        }
        return false;
    }

    const createForm = (data) => {
        let {type, value, id} = data;
        if (data['response'] == undefined || Object.keys(data['response']).length == 0) {
            data['response'] = {};
        }
        let options = value.split("\n")?.filter(item => {
            data['response'][item] = data['response'][item] ? data['response'][item] : false;
            return item;
        });
        let newType = (type == "2") ? 'checkbox' : 'radio'
        return (
            <>  
                { options.map((value, index) => {
                    return (
                        <span className="mx-2" key={value+index}>
                            <input type={newType} disabled={nonEditable} id={value+index+newType} defaultChecked={data['response'][value]} value={value} onChange={(e)=> handleChange(e,data)} name={(type == "2") ? 'checkbox'+id : 'radio'+id} />
                            <label className="ml-2" htmlFor={value+index+newType}>{value}</label>
                        </span>
                    )
                })}
            </>
        )
    }

    const submitForm = () => {
        if (responseName == '') {
            setErr('"Your name" Field cannot be empty!')
        } else {
            setErr('');
            
            let details =  {}
            if (visitedUser) {
                formData.ques.by = responseName;
                formData.ques.updatedAt = new Date();
                let index = formData.response.findIndex((item) =>  item.email == currentUser.email)
                formData.response[index] = formData.ques;
                details['response'] = [...formData.response];
            } else if (currentUser?.email) {
                details['response'] = [...formData.response,{by:responseName, date: new Date(), email: currentUser?.email, ...formData.ques}]
            } else {
                details['response'] = [...formData.response,{by:responseName, date: new Date(), ...formData.ques}]
            }
            updateFormResponse(fid, details).then(()=> {
                setSucessModel(true)
            }).catch((e)=> {
                console.log(e)
                setErr('Form not submitted due to some error');
            })
        }
    }


    const closeModel = () => {
        history.push("/")
    }
    const handleChange = (e,data) => {
        if (e.target.name == 'responseBy') {
            setResponseName(e.target.value)
        } else {
            if (e.target.type == "text") {
                data['response'] = e.target.value
            } else if (e.target.type == "cheakbox") {
                data['response'][e.target.value] = true;
            } else {
                Object.keys(data['response']).forEach((item) => {
                    if (item == e.target.value) {
                        data['response'][item] = true;
                    } else {
                        data['response'][item] = false;
                    }
                });
            }
            setFormData(formData);
        }
    }
    return (
        <>
            {valid ?
            <>
                <Container>
                    <div className='d-flex my-2 justify-content-between'>
                        <span className='badge badge-success'>Form By: {formData.oemail} </span>
                        <span className='badge badge-info'>Form name: {formData.ques.name ? formData.ques.name: 'Not Set'} </span>
                        <span className='badge badge-info'>Created At: {formData?.date?.toDate()?.toLocaleString('en-GB')} </span>
                    </div>
                    {err && <Alert className="my-3" variant="danger">{err}</Alert>}

                    <Form>
                        <Form.Control type="text" name="responseBy" disabled={nonEditable} defaultValue={formData?.ques?.by} className="mt-3" onChange={(e)=> handleChange(e)} placeholder="Your Name (required)"></Form.Control>
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
                                                    <Form.Control type="text" disabled={nonEditable} defaultValue={val.response} name="title" onChange={(e)=> handleChange(e,val)} placeholder="Your Answer"></Form.Control>
                                                    : createForm(val)
                                                }
                                                
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )
                            })
                        }
                        {!nonEditable?
                        <div className="row justify-content-end px-3">
                            <Button variant="dark" className="mt-2" onClick={submitForm}>Submit Form</Button>
                        </div> : null}
                        <SuccedModel
                            show={successModel}
                            successMsg="Response Submitted successfully! Click OK to go on homepage!"
                            title="Response Submited"
                            handleClose={closeModel}
                        />
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

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
    }
}

export default connect(mapStateToProps)(FillForm);
