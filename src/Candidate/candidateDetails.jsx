import { Title } from "chart.js";
import React, { useState, useEffect } from "react";
import { Table, Label, Input } from "reactstrap";
import {
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import Select from "react-select";
import { candidateActions } from '_store';
import {
    Row, Col, Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Button, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import cx from "classnames";
import { useSelector, useDispatch } from 'react-redux';
import { history, fetchWrapper } from '_helpers';

export function CandidateDetails(props) {
    debugger;
    const dispatch = useDispatch();
    const [selectedCandidate, setSelectedCandidate] = useState(props.selectedData)
    const [selectedCandidateRes, setSelectedCandidateRes] = useState()
    const [selectedCandidateList, setSelectedCandidateList] = useState({})
    const [acceptModal, setAcceptModal] = useState(false)
    const [reasonList, setReasonList] = useState([
        {
            value: 1, type: "Location Issue"
        },
        {
            value: 2, type: "Skills not matched"
        }
    ])
    const [comment, setComment] = useState()
    const [rejectModal, setRejectModal] = useState()
    const [rejectConfirmation, setRejectConfirmation] = useState(false)


    useEffect(() => {
        getCandidateDetails()
    }, [])

    useEffect(() => {
        setSelectedCandidateList(selectedCandidateRes)
    }, [selectedCandidateRes])


    const getCandidateDetails = async function () {
        var req = selectedCandidate.candidateid
        let response = await dispatch(candidateActions.getCandidateDetails({ req }));
        debugger;
        setSelectedCandidateRes(response.payload.data)
    }

    const navigateToListPage = function () {
        window.location.reload();
    }

    const acceptCandidate = function () {
        setAcceptModal(!acceptModal)
    }

    const rejectCandidate = function () {
        setRejectModal(!rejectModal)
    }


    const rejectCandidateConfirmation = function () {
        setRejectConfirmation(!rejectConfirmation)
    }

    const onChangeReason = function () {

    }

    return (
        <div>
            
            {selectedCandidateList ? <Row>

                <Card className="main-card">

                    <CardTitle className="mt-3 mb-3" style={{ fontSize: '21px', marginLeft: '20px' }}>Candidate Details
                    </CardTitle>
                    <Row className="me-2" style={{ backgroundColor: 'rgb(33 91 153)', borderRadius: '5px',marginLeft:'3px' }}>
                        <Col md="12" lg="12" xl="12">
                            <div className="dropdown-menu-header">
                                <div className="dropdown-menu-header-inner">
                                    <div className="menu-header-content btn-pane-right">
                                        <div className="avatar-icon-wrapper me-3 avatar-icon-xl">
                                            <div className="avatar-icon">
                                                {/* <img src={avatar4} alt="Avatar 5" /> */}
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="menu-header-title">{selectedCandidateList.firstname} {selectedCandidateList.lastname}</h5>
                                            <h6 className="menu-header-subtitle">
                                            {selectedCandidate.primaryskills}
                                            </h6>
                                        </div>
                                        <div className="menu-header-btn-pane">

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </Row>
                    <CardBody>
                        <Form className="mt-4" style={{ marginLeft: '15%' }}>
                            {selectedCandidateList ? <div>
                                <Row>

                                    <Col md="4" className="me-5">
                                        <FormGroup>
                                            <Label for="exampleEmail">Email</Label>
                                            <Input disabled type="email" name="email" id="exampleEmail" value={selectedCandidateList.email} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup>
                                            <Label for="examplePassword">Contact</Label>
                                            <Input disabled type="text" name="contact" id="contact" value={selectedCandidateList.phonenumber} />
                                        </FormGroup>
                                    </Col>

                                </Row>


                                <Row>

                                    <Col md="4" className="me-5">
                                        <FormGroup>
                                            <Label for="exampleEmail">Core Skill</Label>
                                            <Input disabled type="text" name="skill" id="skill" value={selectedCandidate.secondaryskills} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" className="me-5">
                                        <FormGroup>
                                            <Label for="examplePassword">Notice Period</Label>
                                            <Input disabled type="text" name="noticeperiod" id="noticeperiod" value={selectedCandidate.noticeperiod} />
                                        </FormGroup>
                                    </Col>

                                </Row>



                                <Row>

                                    <Col md="4" className="me-5">
                                        <FormGroup>
                                            <Label for="exampleEmail">Experience</Label>
                                            <Input disabled type="text" name="experience" id="experience" value={selectedCandidate.experienceyears} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" className="me-5">
                                        <FormGroup>
                                            <Label for="examplePassword">Willing to Relocate</Label>
                                            <Input disabled type="text" name="expectations" id="expectations" value={!selectedCandidate.isrelocate ? 'No' : 'Yes'} />
                                        </FormGroup>
                                    </Col>

                                </Row>


                                <Row>

                                    <Col md="4" className="me-5">
                                        <FormGroup>
                                            <Label for="exampleEmail">Video Conference Capabilities</Label>
                                            <Input disabled type="text" name="experience" id="experience" value={!selectedCandidate.isvideoconference ? 'No' : 'Yes'} />
                                        </FormGroup>
                                    </Col>

                                </Row>



                            </div> : <></>}

                        </Form>
                        <Row>
                            <Col md="2" className="mt-3">
                                <Button style={{ backgroundColor: 'rgb(33 91 153)'}} className="mt-1 me-3" onClick={(evt) => navigateToListPage()}>
                                    Back
                                </Button>
                            </Col>
                            <Col md="2" className="mt-3" style={{ marginLeft: '60%' }}>

                                <Button style={{ backgroundColor: 'rgb(33 91 153)'}} className="mt-1 me-3" onClick={(evt) => acceptCandidate()}>
                                    Accept
                                </Button>
                                <Button style={{ backgroundColor: 'rgb(33 91 153)'}} className="mt-1" onClick={(evt) => rejectCandidate()}>
                                    Reject
                                </Button>
                            </Col>

                        </Row>


                    </CardBody>
                </Card>

            </Row> : <></>}



            <Modal isOpen={acceptModal}>
                <ModalHeader >Reject Candidate</ModalHeader>
                <ModalBody>
                    Candidate accepted successfully
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => acceptCandidate()}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>




            <Modal isOpen={rejectModal}>
                <ModalHeader >Reject Candidate</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className="mb-3">
                            <Label for="exampleCustomSelectDisabled">
                                Select Rejection Reason
                            </Label>
                            <Input type="select" id="jobType" name="jobType"
                                onChange={(evt) => onChangeReason(evt)}>
                                {reasonList.map((col) => (
                                    <option value={col.type}>{col.type}</option>
                                ))}
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label for="exampleText">Comment</Label>
                            <Input type="textarea" name="text" id="exampleText" />
                        </FormGroup>
                    </Row>

                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => rejectCandidateConfirmation()}>
                        submit
                    </Button>
                    <Button color="link" onClick={(evt) => rejectCandidate()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={rejectConfirmation}>
                <ModalHeader >Reject Candidate</ModalHeader>
                <ModalBody>
                    Candidate Rejected successfully
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => navigateToListPage()}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>



        </div >
    );
}
