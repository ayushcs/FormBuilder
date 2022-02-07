import React, { useEffect, useState } from 'react';
import { Alert, Container, Table } from 'react-bootstrap';
import Header from './Header';
import {connect} from 'react-redux';
import {getListing, deleteForms} from '../firebase'
import {saveListingResponse} from '../redux/actions'
import { Link } from 'react-router-dom';
function Listing(props) {
    let {currentUser, saveListingResponse, list} = props;
    let [load, setLoad] = useState(true)
    let [msg, setMsg] = useState("Fetching Data Please Wait...")
    let [err, setErr] = useState('');
    let [refresh, setRefresh] = useState(false);
    useEffect(()=> {
        if (currentUser?.uid && !refresh) {
            setErr('')
            setRefresh(true);
            getListing(currentUser.uid).then((res)=> {
                let lists = [];
                res.forEach((doc) => {
                    lists.push({fid:doc.id,data: doc.data()})
                });
                setLoad(false)
                lists = lists.sort((a,b)=>b.data.date-a.data.date);
                saveListingResponse(lists);
            }).catch(()=> {
                setLoad(true);
                setMsg('Some Error Occured');
            })
        }
    }, [currentUser, refresh])

    useEffect(()=> {
        if (!load && list.length === 0) {
            setMsg('No form found')
        } 
    },[list]);

    const deleteForm = (fid) => {
        deleteForms(fid).then(()=> {
            setRefresh(false)
        }).catch(()=> {
            setErr('Unable to delete')
        })
    }
    return (
        <>
            <Header />
            <Container className="mt-5 pt-5">
                {load || list.length === 0?
                <Alert className="my-2" variant="info">{msg}</Alert>
                :
                <>
                    {err && <Alert className="my-2" variant="danger">{err}</Alert>}
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Form Name</th>
                                <th>Form Url</th>
                                <th>Created At</th>
                                <th>Total Response</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.map((val, index)=> {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{val.data.ques.name ? val.data.ques.name: 'Not Set'}</td>
                                            <td>
                                                <Link to={"/fillform/"+currentUser.uid+"/"+val.fid} target="_blank" rel="noopener noreferrer">
                                                    Open
                                                </Link>
                                            </td>
                                            <td>{val.data.date?.toDate()?.toLocaleString('en-GB')}</td>
                                            <td>
                                                {val.data.response.length ? 
                                                <>
                                                    <span className='mr-2'>{val.data.response.length}</span>
                                                    <Link to={"/viewresponses/"+val.fid}>
                                                        ( See )
                                                    </Link>
                                                </> : 0}
                                            </td>
                                            <td><span className="badge badge-danger btn text-white" onClick={()=>deleteForm(val.fid)}>Delete</span></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </>
                }
            </Container>
        </>           
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        list: state.list,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        saveListingResponse : (list) => dispatch(saveListingResponse(list)),
    }
 }

export default connect(mapStateToProps,mapDispatchToProps)(Listing);
