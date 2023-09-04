import { Title } from "chart.js";
import React, { useState, useEffect } from "react";
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
import titlelogo from '../assets/utils/images/candidate.svg'
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
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [isPopOver, setIsPopOver] = useState(false)
    const [isExpError, setIsExpError] = useState('false')
    const [searchText, setSearchText] = useState('')

    const [minExperience, setMinExperience] = useState()
    const [maxExperience, setMaxExperience] = useState()

    const [acceptModal, setAcceptModal] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [rejectModal, setRejectModal] = useState(false)
    const [rejectConfirmation, setRejectConfirmation] = useState(false)
    const [appliedDate, setAppliedDate] = useState()
    const [isAppliedToday, setIsAppliedToday] = useState()

    let minExp
    let maxExp
    let searchData = ''

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

    const [expList, setExpList] = useState([
        {
            value: 1, label: "1"
        },
        {
            value: 2, label: "2"
        },
        {
            value: 1, label: "3"
        },
        {
            value: 2, label: "4"
        },
        {
            value: 1, label: "5"
        },
        {
            value: 2, label: "6"
        }])


    let rejectReqData = {

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


    useEffect(() => {
        setMinExperience(minExp)
    }, [minExp]);


    useEffect(() => {
        setMaxExperience(maxExp)
    }, [maxExp]);

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
        console.log(searchText);

        let url = 'JobApplications/GetJobAppliedCandidatesList/' + 2 + '?pageSize=' + pageSize + '&pageNumber=' + pageIndex + '&isActive=true'
        if (document.getElementById('search-input').value != '') {
            url += '&searchText=' + document.getElementById('search-input').value
        }
        if (minExp != undefined) {
            url += '&minExperience=' + minExp
        }
        if (maxExp != undefined) {
            url += '&maxExperience=' + maxExp
        }


        let response = await dispatch(candidateActions.getCandidates({ url }));
        setList(response.payload.data.candidateList);
        // setTotalRecords(response.payload.data.totalRecords);



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
        let daysMsg = "Applied " + (today ? ' Today' : (diffDays == 1 ? +diffDays + " day ago" : diffDays + " days ago"))

        return daysMsg

    }

    const onchangePage = function (data) {
        setPageIndex(data.target.value)
        getCandidatesList()
    }

    const onHandleExpChange = function (check, event) {
        minExp = Number(document.getElementById('minExp').value)
        maxExp = Number(document.getElementById('maxExp').value)

        if (minExp && maxExp) {
            if (minExp > maxExp) {
                setIsExpError('true')
            }
            else {
                setIsExpError('false')
            }
        }
        else {
            setIsExpError('false')
        }

    }

    const openProfile = function () {
        setShowProfile(!showProfile)
    }

    const applyMask = function (inputValue) {
        let maskLength = inputValue.length + 3 - (inputValue.length)

        const visiblePart = inputValue.substring(0, maskLength); // Get the visible part
        const maskedPart = '*'.repeat(maskLength); // Create a string of asterisks

        return visiblePart + maskedPart;

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
        searchData = data
        setSearchText(searchData)

    }
    const onReset = function () {

        setIsExpError('false')
        document.getElementById('minExp').value = ''
        document.getElementById('maxExp').value = ''
        getCandidatesList()
    }

    const onClearSearch = function () {
        setSearchText('')
        document.getElementById('search-input').value = ''
        getCandidatesList()
    }

    const rejectCandidate = function () {
        setRejectModal(!rejectModal)
    }

    const showPopOver = function (data) {
        setselectedCandidate(data)
        setIsPopOver(true)
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


    return (
        <div>
            {
                !showCandidate ?
                    <div>
                        <PageTitle heading="Applied Candidates" icon={titlelogo} />
                        <Card className="main-card mb-2">
                            <CardBody>
                                <Row>
                                    <Col className="col-md-6">
                                        <Row>
                                            <Col className="col-md-3">
                                                <Input type="text" id="minExp" name="minExp" placeholder="Min Exp" style={{
                                                    borderColor:
                                                        isExpError == 'true' ? 'red' : '#ced4da'
                                                }} onChange={(evt) => onHandleExpChange('min',
                                                    evt.target.value)}>
                                                </Input>
                                            </Col>

                                            <Col className="col-md-3">
                                                <Input type="text" id="maxExp" name="maxExp" placeholder="Max Exp" style={{
                                                    borderColor:
                                                        isExpError == 'true' ? 'red' : '#ced4da'
                                                }} onChange={(evt) => onHandleExpChange('max',
                                                    evt.target.value)}>
                                                </Input>
                                            </Col>
                                            <Col className="col-md-4">
                                                <Button className="col-md-4 me-2" onClick={(evt) => isExpError == 'false' ? getCandidatesList() : ''}
                                                    style={{
                                                        backgroundColor: isExpError == 'false' ? 'rgb(33 91 153)' : 'grey',
                                                        cursor: isExpError == 'false' ? 'pointer' : 'not-allowed'
                                                    }}>
                                                    submit
                                                </Button>

                                                <Button className="col-md-4 me-2" onClick={(evt) => onClearSearch()}
                                                    style={{

                                                        cursor: 'pointer'
                                                    }}>
                                                    reset
                                                </Button>
                                            </Col>

                                        </Row>
                                        {isExpError == 'true' ? <Label style={{ color: 'red' }}>Minimum experience should be less than Max
                                            Experience</Label> : ""}

                                    </Col>

                                    <Col className="col-md-6">
                                        <div className={cx("search-wrapper float-end", { active: true, })}>
                                            <div className="input-holder">
                                                <input type="text" className="search-input" id="search-input" onInput={(evt) =>
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

                                                    <span style={{ color: 'rgb(33, 91, 153)', cursor: 'pointer', fontWeight: '600' }} id="Popover" onClick={(evt) => { showPopOver(col) }}> {applyMask(col.firstname + col.lastname)}</span>

                                                    <Row style={{ marginTop: '-10px' }}>
                                                        <span style={{ marginLeft: '45px', fontWeight: '500' }}>{col.primaryskills}
                                                        </span>
                                                    </Row>

                                                </td>



                                                <td className="align-middle">{col.experienceyears + " years"}</td>
                                                <td>{col.noticeperiod}</td>
                                                <td>{col.secondaryskills}</td>
                                                <td>
                                                    <Button className=" me-2 btn-transition" style={{ backgroundColor: 'rgb(33 91 153)', cursor: 'pointer', height: '30px' }} onClick={(evt) =>
                                                        onSelectCandidate(col)}>
                                                        <span> Profile</span>
                                                    </Button>

                                                    <Button className=" me-2 btn-dark" style={{ cursor: 'pointer', height: '30px' }} onClick={(evt) => acceptRejectCandidate('accept')} >
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
                        <Card className="mb-2">
                            <CardBody >
                                <Pagination aria-label="Page navigation example" className="text-center float-end">

                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active>
                                        <PaginationLink href="#">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">4</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">5</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="#" />
                                    </PaginationItem>

                                </Pagination>
                            </CardBody>
                        </Card>
                    </div>
                    : <div>


                        <CandidateDetails selectedData={selectedCandidate} jobId={jobId}></CandidateDetails>
                    </div>
            }

            {isPopOver ?
                <UncontrolledPopover placement='right' target={"Popover"}>
                    <PopoverHeader>
                        {selectedCandidate ? <div>
                            <Row>
                                <span className="menu-header-title" style={{ color: '#545cd8' }}>{applyMask(selectedCandidate.firstname + selectedCandidate.lastname)}</span>
                            </Row>
                            <Row style={{ fontSize: '12px' }}>
                                <Col>
                                    <span className="menu-header-subtitle">
                                        {selectedCandidate.primaryskills}
                                    </span>
                                </Col>
                                <Col>
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
            <Modal isOpen={rejectConfirmation}>
                <ModalHeader >Reject Candidate</ModalHeader>
                <ModalBody>
                    Candidate Rejected successfully
                </ModalBody>
                <ModalFooter>
                    {/* onClick={(evt) => navigateToListPage()} */}
                    <Button color="link" >
                        OK
                    </Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={acceptModal}>
                <ModalHeader >Accepted Candidate</ModalHeader>
                <ModalBody style={{ marginLeft: '20%' }}>
                    You Want to Schedule the Interview??
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={(evt) => acceptCandidate()}>
                        Yes
                    </Button>
                    <Button color="link" onClick={(evt) => acceptCandidate()}>
                        No
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


        </div >

    );

}
