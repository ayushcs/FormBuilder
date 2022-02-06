import React, { useState } from "react";
import { Alert, Container, Button, Form, Row, Col } from "react-bootstrap"
import NewFormModel from "../Models/NewFormModel";
import Header from "./Header";
import {addQuestion, saveUrl} from '../redux/actions';
import {connect} from 'react-redux';
import {saveData} from '../firebase';
import SuccedModel from "../Models/SuccedModel";
import { useHistory } from "react-router-dom"

function NewForm(props) {
    const {addQuestion, questions, currentUser, saveUrl, url} = props;
    const [error, setError] = useState("");
    const [formName, setFormname] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [successModel, setSucessModel] = useState(false);
    const history = useHistory();

    const saveNewQuestion = (ques, close) => {
        if (ques && !close) {
            ques['id'] = questions.length + 1; 
            addQuestion(ques);
        }
        setModalShow(false)
    }

    const saveForm = async () => {
        if (!formName) {
            setError('Form Name is Required');
        } else {
            let details = {
                date : new Date(),
                oemail: currentUser.email,
                ouid: currentUser.uid,
                ques: {name: formName, ques: questions},
                response: []
            }
            try {
                let form = await saveData(details);
                let url = `${window.location.origin}/fillform/${ currentUser.uid}/${form.id}`;
                saveUrl(url);
                setSucessModel(true)
            } catch {
                setError('Form Not Saved, Try Again!')
            }
        }
    }

    const createForm = (type, val, id) => {
        let options = val.split("\n")?.filter(item => item);
        let newType = (type == "2") ? 'checkbox' : 'radio'
        return (
            <>  
                { options.map((value, index) => {
                    return (
                        <span className="mx-2" key={value}>
                            <input type={newType} disabled={true} id={value+index+newType} name={(type == "2") ? value : 'radio'+id} />
                            <label className="ml-2" htmlFor={value+index+newType}>{value}</label>
                        </span>
                    )
                })}
            </>
        )
    }
    return (
        <>
            <Header />
            <Container className="mt-5 pt-5">
                <Row>
                    <Col><h3>Create a new form</h3></Col>
                    <Col>
                        <Button  variant="dark" className="float-right" onClick={() => setModalShow(true)} type="button">
                            Add New Question
                        </Button>
                    </Col>
                </Row>
                {error && <Alert className="my-2" variant="danger">{error}</Alert>}

                {questions.length > 0 ? 
                    <Row>
                        <Col>
                            <Form.Control onChange={(e)=> setFormname(e.target.value)}type="text" name="title" className="mt-2" placeholder="Enter Form Name (Required)"></Form.Control>
                        </Col>
                    </Row> : null
                }
                
                {
                    questions.map((val, index) => {
                        return (
                            <React.Fragment key={val.id}>
                                <Row>
                                    <Col className="font-weight-bold my-2">{index + 1}) {val.title}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {val.type == "1" ?
                                            <Form.Control type="text" name="title" placeholder="User Response" disabled={true}></Form.Control>
                                            : createForm(val.type, val.value, val.id)
                                        }
                                        
                                    </Col>
                                </Row>
                            </React.Fragment>
                        )
                    })
                }
                {questions.length > 0 ? 
                    <div className="row justify-content-end px-3">
                        <Button variant="dark" className="mt-2" onClick={saveForm}>Save Form</Button>
                    </div> : null
                }
                <NewFormModel
                    show={modalShow}
                    onHide={(ques, close) => saveNewQuestion(ques, close)}
                />
                <SuccedModel
                    show={successModel}
                    successMsg=" Form is saved successfully, You can share the below link to get responses!"
                    title="Form Saved!"
                    url= {url}
                    handleClose={()=>history.push('/')}
                />
            </Container>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        questions: state.questions,
        currentUser: state.currentUser,
        url: state.url,
    }
}

const mapDispatchToProps = (dispatch) => {
   return {
       addQuestion : (ques) => dispatch(addQuestion(ques)),
       saveUrl : (ques) => dispatch(saveUrl(ques))
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(NewForm);
