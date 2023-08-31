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
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { history, fetchWrapper } from '_helpers';
import { addComment } from "@babel/types";



export function CandidateDetails(props) {
    const dispatch = useDispatch();
    let jobId = props.jobId
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState(props.selectedData)
    const [selectedCandidateRes, setSelectedCandidateRes] = useState()
    const [selectedCandidateList, setSelectedCandidateList] = useState({})
    const [acceptModal, setAcceptModal] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const [reasonList, setReasonList] = useState([
        {
            value: 1, type: "Location Issue"
        },
        {
            value: 2, type: "Skills not matched"
        }, {
            value: 3, type: "Fake Profile"
        }
    ])

    let candidateId = selectedCandidate.candidateid
    let rejectReqData = {
        "jobapplicationid": selectedCandidate.jobapplicationid,
        "jobid": jobId,
        "candidateid": selectedCandidate.candidateid,
        "applicationdate": selectedCandidate.applicationdate,
        "applicationstatusid": 0,
        "applicationstatus": "",
        "feedback": selectedCandidate.feedback,
        "ratings": selectedCandidate.ratings,
        "skills": selectedCandidate.secondaryskills,
        "experienceyears": selectedCandidate.experienceyears,
        "noticeperiodid": selectedCandidate.noticeperiodid,
        "isrelocate": selectedCandidate.isrelocate,
        "isvideoconference": selectedCandidate.isvideoconference,
        "acceptedby": 0,
        "accepteddate": "",
        "rejectedby": 0,
        "rejecteddate": "",
        "rejectedreasonid": 0,
        "rejectedcomment": "",
        "isactive": true,
        "currentUserId": 0
    }

    const [appliedDate, setAppliedDate] = useState()
    const [isAppliedToday, setIsAppliedToday] = useState()
    const [rejectModal, setRejectModal] = useState(false)
    const [rejectConfirmation, setRejectConfirmation] = useState(false)


    useEffect(() => {

        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const today = new Date();
        const appliedDate = new Date(selectedCandidate.applicationdate);
        if (today == appliedDate) {
            setIsAppliedToday(true)
        }
        const diffDays = Math.round(Math.abs((today - appliedDate) / oneDay));
        setAppliedDate(diffDays)
        getCandidateDetails()
    }, [])

    useEffect(() => {
        setSelectedCandidateList(selectedCandidateRes)
    }, [selectedCandidateRes])


    const getCandidateDetails = async function () {
        var req = selectedCandidate.candidateid
        let response = await dispatch(candidateActions.getCandidateDetails(req));
        setSelectedCandidateRes(response.payload.data)
    }

    const navigateToListPage = function () {
        window.location.reload();
    }

    const acceptCandidate = function () {
        window.location.reload();
    }
    const rejectCandidate = function () {
        setRejectModal(!rejectModal)
    }

    const acceptRejectCandidate = async function (check) {
        let applicationstatusid = 0
        let rejectedreasonid = rejectReqData.rejectedreasonid
        let rejectedcomment = rejectReqData.rejectedcomment
        let currentUserId = 1
        let applicationstatus;
        if (check == 'reject') {
            applicationstatus = 'Rejected'
            rejectedreasonid = rejectReqData.rejectedreasonid
            rejectedcomment = rejectReqData.rejectedcomment
        }
        else {
            applicationstatus = 'Accepted'
        }


        let response = await dispatch(candidateActions.acceptRejectCandidate({ jobId, applicationstatusid, rejectedreasonid, rejectedcomment, currentUserId, applicationstatus }));
        if (check == 'accept') {
            setAcceptModal(!acceptModal)
        }
        else {
            setRejectModal(!rejectModal)
            setRejectConfirmation(!rejectConfirmation)
        }



    }

    const rejectCandidateCancel = function () {
        setRejectModal(!rejectModal)
    }

    const onChangeReason = function (data) {
        rejectReqData.rejectedreasonid = data
    }

    const addComment = function (data) {
        rejectReqData.rejectedcomment = data
    }

    const openProfile = function () {
        setShowProfile(!showProfile)
    }

    const applyMask = function (inputValue) {
        // let inputValue = (selectedCandidateList.firstname + selectedCandidateList.lastname)
        if (inputValue) {
            const numCharsToMask = inputValue.length - 8;
            const maskedValue = '*'.repeat((inputValue.length) - numCharsToMask) + inputValue.slice(-numCharsToMask);

            return maskedValue;
        }

        // }
    }
    const formatPhoneNumber = function (inputValue) {
        const maskedValue = '*'.repeat(10 - 4) + selectedCandidate.phonenumber.slice(-4);
        const formatedValue = maskedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) - $2 - $3');

        return formatedValue;
    }

    const maskEmail = function (inputValue) {

        // Extract the part before the '@' symbol
        const username = selectedCandidate.email.substring(0, selectedCandidate.email.indexOf('@'));

        // Mask the username with 'x's
        const maskedUsername = 'x'.repeat(username.length);

        // Combine masked username with '@' symbol and domain
        const maskedValue = maskedUsername + selectedCandidate.email.substring(selectedCandidate.email.indexOf('@'));

        return maskedValue;
    }



    return (
        <div>

            {selectedCandidateList ? <Row>

                <Card className="main-card">

                    <CardTitle className="mt-3 mb-3" style={{ fontSize: '21px', marginLeft: '20px' }}>Candidate Details
                    </CardTitle>
                    <Row className="me-2" style={{ backgroundColor: 'rgb(33 91 153)', borderRadius: '5px', marginLeft: '3px' }}>
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
                                            <h5 className="menu-header-title">{applyMask(selectedCandidateList.firstname + selectedCandidateList.lastname)}</h5>
                                            <h6 className="menu-header-subtitle">
                                                {selectedCandidate.primaryskills}
                                            </h6>
                                            <h6>Applied {isAppliedToday ? ' Today' : (appliedDate == 1 ? +appliedDate + " day ago" : appliedDate + " days ago")} </h6>
                                            <h6 style={{ cursor: 'pointer' }} onClick={(evt) => openProfile()}>Check Profile</h6>

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
                                            <Input disabled type="email" name="email" id="exampleEmail" value={maskEmail(selectedCandidateList.email)} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup>
                                            <Label for="examplePassword">Contact</Label>
                                            <Input disabled type="text" name="contact" id="contact" value={formatPhoneNumber(selectedCandidateList.phonenumber)} />
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
                                            <Input disabled type="text" name="experience" id="experience" value={selectedCandidate.experienceyears + " years"} />
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
                        <Row style={{ cursor: 'pointer' }}>
                            <Col md="2" className="mt-3">
                                <Button style={{ backgroundColor: 'rgb(33 91 153)' }} className="mt-1 me-3" onClick={(evt) => navigateToListPage()}>
                                    Back
                                </Button>
                            </Col>
                            <Col md="2" className="mt-3" style={{ marginLeft: '60%' }}>

                                <Button style={{ backgroundColor: '#d92550', borderColor: '#d92550' }} className="mt-1 me-3" onClick={(evt) => acceptRejectCandidate('accept')}>
                                    Accept
                                </Button>
                                <Button style={{ backgroundColor: '#3ac47d', borderColor: '#3ac47d' }} className="mt-1" onClick={(evt) => rejectCandidate()}>
                                    Reject
                                </Button>

                            </Col>

                        </Row>


                    </CardBody>
                </Card>

            </Row> : <></>}



            <Modal isOpen={acceptModal}>
                <ModalHeader >Accept Candidate</ModalHeader>
                <ModalBody>
                    Candidate Accepted successfully
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => acceptCandidate()}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>




            <Modal className="lg" isOpen={rejectModal}>
                <ModalHeader >Reject Candidate</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className="mb-3">
                            <Label for="exampleCustomSelectDisabled">
                                Select Rejection Reason
                            </Label>
                            <Input type="select" id="jobType" name="jobType"
                                onChange={(evt) => onChangeReason(evt.target.value)}>
                                {reasonList.map((col) => (
                                    <option value={col.value}>{col.type}</option>
                                ))}
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label for="exampleText">Comment</Label>
                            <Input type="textarea" onInput={(evt) => addComment(evt.target.value)} name="text" id="exampleText" />
                        </FormGroup>
                    </Row>

                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => acceptRejectCandidate('reject')}>
                        submit
                    </Button>
                    <Button color="link" onClick={(evt) => rejectCandidateCancel()}>
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


            <Modal lg isOpen={showProfile}>
                {selectedCandidate ?
                    <div style={{ backgroundColor: 'rgb(33 91 153)' }}>
                        <Col md="12" lg="12" xl="12">
                            <div className="dropdown-menu-header">
                                <div className="dropdown-menu-header-inner">
                                    <div className="menu-header-content btn-pane-right">

                                        <div>
                                            <h1 className="menu-header-subtitle">
                                                Candidate Profile
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </div>
                    : <></>}
                <ModalBody>
                    {selectedCandidateList ? <h4>{selectedCandidateList.primaryskills}</h4> : ''}

                    <Form className="mt-4" style={{ marginLeft: '15%' }}>
                        {selectedCandidateList ? <div>

                            <Col className="me-5">
                                <FormGroup>
                                    <Label for="exampleEmail">Name  :  {applyMask(selectedCandidateList.firstname + selectedCandidateList.lastname)}</Label>

                                </FormGroup>
                            </Col>

                            <Col className="me-5">
                                <FormGroup>
                                    <Label for="exampleEmail">Email  :  {maskEmail(selectedCandidateList.email)}</Label>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="examplePassword">Contact  :  {formatPhoneNumber(selectedCandidateList.phonenumber)}</Label>
                                </FormGroup>
                            </Col>

                            <Col className="me-5">
                                <FormGroup>
                                    <Label for="exampleEmail">Resume  : </Label>{selectedCandidateRes ? <a
                                        href={selectedCandidateRes.resumepath} target="blank">
                                        {(selectedCandidateRes.firstname) + "_resume.pdf"}  </a> : ''}
                                </FormGroup>
                            </Col>
                            <Col className="me-5">
                                <FormGroup>
                                    <Label for="examplePassword">Video Intro  : </Label>
                                </FormGroup>
                            </Col>

                            <Col className="me-5">
                                <FormGroup>
                                    <Label for="exampleEmail">Skills  :  {selectedCandidate.secondaryskills}</Label>

                                </FormGroup>
                            </Col>
                            <Col className="me-5">
                                <FormGroup>
                                    <Label for="examplePassword">Language  :  </Label>
                                    {selectedCandidateRes ? <Label>
                                        {selectedCandidateRes.languages}  </Label> : ''}
                                </FormGroup>
                            </Col>



                        </div> : <></>}

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => openProfile()}>
                        close
                    </Button>
                </ModalFooter>
            </Modal>



        </div >
    );
}
