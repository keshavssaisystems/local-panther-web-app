import { Title } from "chart.js";
import React, { useState, useEffect, useRef } from "react";
import {
    Table, Label, Input, Pagination,
    PaginationItem,
    PaginationLink, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter,
    Form,
    FormGroup
} from "reactstrap";
import { candidateActions } from '_store';
import { Row, Col, Button } from "reactstrap";
import cx from "classnames";
import { useSelector, useDispatch } from 'react-redux';
import { CandidateDetails } from './candidateDetails';
import PageTitle from "./pagetitle";
import { CustomPagination } from "Candidate";
import titlelogo from '../assets/utils/images/candidate.svg'
import errorIcon from '../assets/utils/images/error_icon.png'
import successIcon from '../assets/utils/images/success_icon.svg'
import candidatelogo from '../assets/utils/images/profile_pic.svg'
import {

    UncontrolledPopover,
    PopoverHeader,
    PopoverBody,
} from "reactstrap";

export function CandidateList() {
    const dispatch = useDispatch();

    let jobId = 2;
    const [candidatesList, setCandidateList] = useState([])
    const [getCandidateList, setList] = useState([]);
    const [showCandidate, setshowCandidate] = useState(false);
    const [selectedCandidate, setselectedCandidate] = useState();
    const [pageSize, setpageSize] = useState(10)
    const [isExpError, setIsExpError] = useState(false)
    const [searchText, setSearchText] = useState('')

    const [jobTitle, setJobTitle] = useState()

    const [acceptModal, setAcceptModal] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [rejectModal, setRejectModal] = useState(false)
    const [rejectConfirmation, setRejectConfirmation] = useState(false)
    var totalPages = useRef()
    var pageIndex = useRef(1)
    var skillDetails = [];

    var minExp = useRef()
    var maxExp = useRef()
    var isPopOver = useRef(false)
    let searchData = useRef('')
    let skillPopover = useRef(false)


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



    let rejectReqData = {
        "candidateid": 0,
        "applicationstatusid": 0,
        "applicationstatus": "",
        "rejectedreasonid": 0,
        "rejectedcomment": "",
        "currentUserId": 0
    }

    useEffect(() => {
        getCandidatesList()
    }, []);

    useEffect(() => {
        setCandidateList(getCandidateList)
    }, [getCandidateList]);


    const acceptCandidate = function () {
        window.location.reload();
    }

    const onChangeReason = function (data) {
        rejectReqData.rejectedreasonid = data
    }

    const addComment = function (data) {
        rejectReqData.rejectedcomment = data
    }

    const rejectCandidateCancel = function () {
        setRejectModal(!rejectModal)
    }

    const getCandidatesList = async function () {
        
        let url = 'JobApplications/GetJobAppliedCandidatesList/' + 3 + '?pageSize=' + pageSize + '&pageNumber=' + pageIndex.current + '&isActive=true&Applicationstatus=Applied'
        if (searchData.current  != '') {
            url += '&searchText=' + searchData.current
        }
        if (minExp.current != undefined || minExp.current != null) {
            url += '&minExperience=' + minExp.current
        }
        if (maxExp.current != undefined || maxExp.current != null) {
            url += '&maxExperience=' + maxExp.current
        }


        let response = await dispatch(candidateActions.getCandidates({ url }));
        
        setList(response.payload.data.candidateList);
        setJobTitle(response.payload.data.jobTitle)
        totalPages.current = Math.round(Number(response.payload.data.totalRows) / pageSize)

        if (totalPages.current * pageSize != response.payload.data.totalRows) {
            totalPages.current++
        }

    }




    const getApplicationDate = function (date) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const today = new Date();
        const appliedDate = new Date(date);
        let istoday;
        if (today == appliedDate) {
            istoday = true
        }
        const diffDays = Math.round(Math.abs((today - appliedDate) / oneDay));
        let daysMsg = "Applied " + (istoday ? ' Today' : (diffDays == 1 ? +diffDays + " day ago" : diffDays + " days ago"))

        return daysMsg

    }

    const onHandleExpChange = function (check, event) {
        check == 'min' ? minExp.current = Number(event) : maxExp.current = Number(event)

        if (minExp.current && maxExp.current) {
            if (minExp.current > maxExp.current) {
                setIsExpError(true)
            }
            else {
                setIsExpError(false)
            }
        }
        else {
            setIsExpError(false)
        }

    }

    const applyMask = function (inputValue) {
        const numCharsToMask = inputValue.length - (inputValue.length - 2);
        const maskedValue = '*'.repeat((inputValue.length) - numCharsToMask) + inputValue.slice(-numCharsToMask);

        return maskedValue;


    }
    const formatPhoneNumber = function (inputValue) {
        const maskedValue = '*'.repeat(10 - 4) + inputValue.slice(-4);
        return `(${maskedValue.substring(0, 3)}) - ${maskedValue.substring(3, 6)} - ${maskedValue.substring(6)}`;
    }

    const maskEmail = function (inputValue) {

        const username = inputValue.substring(0, inputValue.indexOf('@'));
        const maskedUsername = 'x'.repeat(username.length);
        const maskedValue = maskedUsername + inputValue.substring(inputValue.indexOf('@'));

        return maskedValue;
    }

    const onSelectCandidate = function (data) {
        setselectedCandidate(data)
        setshowCandidate(true)

    }

    const onSearch = function (data) {
        setSearchText(data)
        searchData.current = data

    }
    const onReset = function () {
        minExp.current = undefined
        maxExp.current = undefined

        document.getElementById('minExp').value = undefined
        document.getElementById('maxExp').value = undefined

        setIsExpError(false)
        getCandidatesList()
    }

    const onClearSearch = function () {
        setSearchText('')
        searchData.current = ''
        getCandidatesList()
    }

    const rejectCandidate = function () {
        setRejectModal(!rejectModal)
    }

    const showPopOver = function (data) {
        setselectedCandidate(data)
        isPopOver.current = false
        isPopOver.current = true
    }
    const acceptRejectCandidate = async function (check, candidateid) {
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
        let response = await dispatch(candidateActions.acceptRejectCandidate({ candidateid, jobId, applicationstatusid, rejectedreasonid, rejectedcomment, currentUserId, applicationstatus }));
        if (check == 'accept') {
            setAcceptModal(!acceptModal)
        }
        else {
            setRejectModal(!rejectModal)
            setRejectConfirmation(!rejectConfirmation)
        }



    }

    const getSkills = function (data) {

        let skillData = []
        skillDetails = []
        let splitData = data.split(',')
        for (let i = 0; i < splitData.length; i++) {
            if (i < 3) {
                skillData.push(splitData[i])
            }
            skillDetails.push(splitData[i])
        }
        return skillData.join(',');

    }

    const showSkills = (data) => {
        setselectedCandidate(data)
        skillPopover.current = !skillPopover.current;
    }

    const handlePageChange = (page) => {
        pageIndex.current = page;
        getCandidatesList()
    };

    return (
        <div>
            {
                !showCandidate ?
                    <div>
                        <PageTitle heading="Applied Candidates for " jobTitle={jobTitle} icon={titlelogo} />
                        <Card className="main-card mb-2">
                            <CardBody>
                                <Row>
                                    <Col className="col-md-9">

                                        <Row>

                                            <Col className="col-md-3">
                                                <Label>Min Experience</Label>
                                                <Input type="number" id="minExp" name="minExp" placeholder="Min Exp" value={minExp.current} style={{
                                                    borderColor:
                                                        isExpError ? 'red' : '#ced4da'
                                                }} onChange={(evt) => onHandleExpChange('min',
                                                    evt.target.value)}>
                                                </Input>
                                            </Col>

                                            <Col className="col-md-3">
                                                <Label>Min Experience</Label>
                                                <Input type="number" id="maxExp" name="maxExp" value={maxExp.current} placeholder="Max Exp" style={{
                                                    borderColor:
                                                        isExpError ? 'red' : '#ced4da'
                                                }} onChange={(evt) => onHandleExpChange('max',
                                                    evt.target.value)}>
                                                </Input>
                                            </Col>
                                            <Col className="col-md-4" style={{ marginTop: '30px' }}>
                                                <Button className="col-md-3 me-2" onClick={(evt) => !isExpError ? getCandidatesList() : ''}
                                                    style={{
                                                        backgroundColor: !isExpError ? 'rgb(33 91 153)' : 'grey',
                                                        cursor: !isExpError ? 'pointer' : 'not-allowed'
                                                    }}>
                                                    submit
                                                </Button>

                                                <Button className="col-md-3 me-2" onClick={(evt) => onReset()}
                                                    style={{
                                                        cursor: 'pointer'
                                                    }}>
                                                    reset
                                                </Button>
                                            </Col>

                                        </Row>
                                        {isExpError ? <Label style={{ color: 'red' }}>Minimum experience should be less than Max
                                            Experience</Label> : ""}

                                    </Col>

                                    <Col className="col-md-3">
                                        <div className={cx("search-wrapper float-end", { active: true, })}>
                                            <div className="input-holder">
                                                <input type="text" className="search-input" id="search-input" value={searchText} onInput={(evt) =>
                                                    onSearch(evt.target.value)} placeholder="Search by skill/location" />
                                                <button onClick={(evt) => getCandidatesList()}
                                                    className="search-icon">
                                                    <span />
                                                </button>
                                            </div>
                                            <button onClick={(evt) => onClearSearch()} style={{ left: '220px' }}
                                                className="btn-close" />
                                        </div>
                                    </Col>

                                </Row>

                            </CardBody>

                        </Card>

                        <Row>
                            <Table responsive borderless className="align-middle mb-0">
                                <thead>
                                    <tr style={{ color: 'rgb(33, 91, 153)' }}>
                                        <th>Name</th>
                                        <th>Experience</th>
                                        <th>Notice Period</th>
                                        <th>skills</th>
                                        <th></th>

                                    </tr>
                                </thead>


                                {candidatesList.length > 0 ?
                                    <tbody>
                                        {candidatesList.map((col) => (
                                            <tr style={{ backgroundColor: 'white', borderBottom: '2px solid #d6dbe0' }}>
                                                <td>
                                                    <img src={candidatelogo} alt="user-icon" className="me-2" style={{ height: '35px' }} />

                                                    <span style={{ color: 'rgb(33, 91, 153)', cursor: 'pointer', fontWeight: '600' }}
                                                        id="Popover" onClick={(evt) => { showPopOver(col) }}> {applyMask(col.firstname + col.lastname)}</span>

                                                    <Row style={{ marginTop: '-11px', fontSize: '12px' }}>
                                                        <span style={{ marginLeft: '45px', fontWeight: '500' }}>{col.primaryskills}
                                                        </span>
                                                    </Row>

                                                </td>



                                                <td className="align-middle">{col.experienceyears + " years"}</td>
                                                <td>{col.noticeperiod}</td>
                                                <td>{getSkills(col.secondaryskills) + " "}
                                                    {skillDetails.length > 3 ?

                                                        <a style={{ color: '#215B99', borderBottom: 'solid 2px', cursor: 'pointer', fontSize: '13px' }} id="skill-popover" onClick={(evt) => showSkills(col)}>+{skillDetails.length - 3} More</a>
                                                        : <></>
                                                    }
                                                </td>
                                                <td>
                                                    <Button className=" me-2 btn-transition" style={{ backgroundColor: 'rgb(33 91 153)', cursor: 'pointer', height: '30px' }}>
                                                        <span> Profile</span>
                                                    </Button>

                                                    <Button className=" me-2 btn-dark" style={{ cursor: 'pointer', height: '30px' }} onClick={(evt) => acceptRejectCandidate('accept', col.candidateid)} >
                                                        <span> Accept</span>
                                                    </Button>
                                                    <Button className=" me-2 btn-dark" style={{ cursor: 'pointer', height: '30px' }} onClick={(evt) => rejectCandidate()}>
                                                        <span>Reject</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody> : <></>}




                            </Table>
                        </Row>
                        <CustomPagination totalPages={totalPages.current} pageIndex={pageIndex.current} onCallBack={handlePageChange}></CustomPagination>
                    </div>
                    : <div>
                        <CandidateDetails selectedData={selectedCandidate} jobId={jobId}></CandidateDetails>
                    </div>
            }

            {isPopOver.current ?
                <UncontrolledPopover placement='right' target={"Popover"}>
                    <PopoverHeader>
                        {selectedCandidate ? <div>
                            <Row>
                                <span className="menu-header-title" style={{ color: '#545cd8' }}>{applyMask(selectedCandidate.firstname + selectedCandidate.lastname)}</span>
                            </Row>
                            <Row style={{ fontSize: '12px' }}>
                                <Col className="col-md-5">
                                    <span className="menu-header-subtitle">
                                        {selectedCandidate.primaryskills}
                                    </span>
                                </Col>
                                <Col className="col-md-7">
                                    <h6 style={{ fontSize: '12px' }} className="float-end">{getApplicationDate(selectedCandidate.applicationdate)}</h6>
                                </Col>

                            </Row>
                        </div> : <></>}

                    </PopoverHeader>
                    <PopoverBody style={{ fontSize: '13px' }}>
                        <Row><Col><Label style={{ fontWeight: '700' }}>Email  :</Label> <span>{maskEmail(selectedCandidate.email)}</span></Col></Row>
                        <Row><Col><Label style={{ fontWeight: '700' }}>Contact  :</Label> <span>{formatPhoneNumber(selectedCandidate.phonenumber)}</span></Col></Row>
                        <Row><Col><Label style={{ fontWeight: '700' }}>Willing to Relocate  :</Label> <span>{selectedCandidate.isrelocate ? 'No' : 'Yes'}</span></Col></Row>
                        <Row><Col><Label style={{ fontWeight: '700' }}>Video Conference Capabilities  :</Label> <span>{selectedCandidate.isvideoconference ? 'No' : 'Yes'}</span></Col></Row>




                    </PopoverBody>
                </UncontrolledPopover>
                : <></>}

            {skillPopover.current ?
                <UncontrolledPopover placement='top' target={"skill-popover"}>
                    <PopoverHeader style={{ fontWeight: '600' }}>Skills</PopoverHeader>
                    <PopoverBody style={{ fontSize: '13px' }}>
                        {selectedCandidate ? <div>
                            <Row style={{ fontSize: '14px' }}>
                                {selectedCandidate.secondaryskills}
                            </Row>
                        </div> : <></>}
                    </PopoverBody>
                </UncontrolledPopover>
                : <></>}

            <Modal isOpen={rejectConfirmation}>
                <Card >
                    <CardBody>
                        <div className="d-flex justify-content-center mb-3">
                            <img src={successIcon} alt="success-icon" />
                        </div>
                        <div className="mb-0 d-flex justify-content-center" style={{ fontSize: '25px', fontWeight: '600' }}>Candidate Rejected</div>
                        <div className="mb-3 d-flex justify-content-center" style={{ fontSize: '25px', fontWeight: '600' }}> Successfully</div>
                        <div>

                            <Row >
                                <Col className="d-flex justify-content-center ">

                                    <Button color="primary" onClick={(evt) => acceptCandidate()}>
                                        OK
                                    </Button>
                                </Col>

                            </Row>


                        </div>
                    </CardBody>
                </Card>

            </Modal>

            <Modal isOpen={acceptModal}>

                <Card >
                    <CardBody>
                        <div className="d-flex justify-content-center mb-3">
                            <img src={successIcon} alt="success-icon" />
                        </div>
                        <div className="mb-0 d-flex justify-content-center" style={{ fontSize: '25px', fontWeight: '600' }}>Candidate has been Accepted</div>
                        <div className="mb-3 d-flex justify-content-center" style={{ fontSize: '25px', fontWeight: '600' }}>Successfully</div>
                        <div>
                            <Row style={{ fontSize: '18px' }} className="d-flex justify-content-center mb-4">
                                Would you like to schedule an interview?
                            </Row>
                            <Row >
                                <Col className="d-flex justify-content-center ">
                                    <Button color="primary" className="me-2" onClick={(evt) => acceptCandidate()}>
                                        Yes
                                    </Button>
                                    <Button color="primary" onClick={(evt) => acceptCandidate()}>
                                        No
                                    </Button>
                                </Col>

                            </Row>


                        </div>
                    </CardBody>
                </Card>

            </Modal>






            <Modal className="lg" isOpen={rejectModal}>
                <Card >
                    <CardBody>
                        <div className="d-flex justify-content-center mb-3">
                            <img src={errorIcon} alt="error-icon" />
                        </div>
                        <div className="mb-0 d-flex justify-content-center" style={{ fontSize: '25px', fontWeight: '600' }}>Please Provide a Reason for</div>
                        <div className="mb-3 d-flex justify-content-center" style={{ fontSize: '25px', fontWeight: '600' }}> Candidate Rejection</div>
                        <div>

                            <Row >
                                <Col className="mb-2">
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
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleText">Comment</Label>
                                        <Input type="textarea" onInput={(evt) => addComment(evt.target.value)} name="text" id="exampleText" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="d-flex justify-content-center ">

                                    <Button className="me-2" color="primary" onClick={(evt) => acceptRejectCandidate('reject')}>
                                        submit
                                    </Button>
                                    <Button color="primary" onClick={(evt) => rejectCandidateCancel()}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>





                        </div>
                    </CardBody>
                </Card>


            </Modal>


        </div >

    );

}
