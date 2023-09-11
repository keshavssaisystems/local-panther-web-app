import React, { useState, useEffect } from "react";
import { Table, Label, Input } from "reactstrap";
import { candidateActions } from '_store';
import {
    Row, Col, Card,
    CardBody,
    CardTitle,
    Collapse,
    CardHeader,
    Button, Form,
    FormGroup,
} from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import userlogo from '../assets/utils/images/Union.svg'
import PageTitle from "../_components/pagetitle";


export function CandidateProfile(props) {
    const dispatch = useDispatch();
    const [selectedCandidate, setSelectedCandidate] = useState(props.selectedData)
    const [selectedCandidateRes, setSelectedCandidateRes] = useState()
    const [selectedCandidateList, setSelectedCandidateList] = useState({})
    const [isOpenAccordian, setOpenAccordian] = useState(false)
    const [isContactAccordian, setContactAccordian] = useState(false)
    const [isEducationAccordian, setEducationAccordian] = useState(false)
    const [isJobAccordian, setJobAccordian] = useState(false)


    useEffect(() => {

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




    const applyMask = function (inputValue) {

        if (inputValue) {

            const numCharsToMask = inputValue.length - (inputValue.length - 2);
            const maskedValue = '*'.repeat((inputValue.length) - numCharsToMask) + inputValue.slice(-numCharsToMask);

            return maskedValue;

        }

    }
    const formatPhoneNumber = function (inputValue) {

        const maskedValue = '*'.repeat(10 - 4) + selectedCandidate.phonenumber.slice(-4);
        return `(${maskedValue.substring(0, 3)}) - ${maskedValue.substring(3, 6)} - ${maskedValue.substring(6)}`;

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

    const showPersonalInfo = function () {
        setOpenAccordian(!isOpenAccordian)
    }
    const showContactInfo = function () {
        setContactAccordian(!isContactAccordian)
    }
    const showEducationInfo = function () {
        setEducationAccordian(!isEducationAccordian)
    }
    const showJobInfo = function () {
        setJobAccordian(!isJobAccordian)
    }

    const changeDate = function (date) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(date)
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
    }

    return (
        <div>

            {selectedCandidateList ?
                <div>
                    <PageTitle heading="Candidate Profile" />

                    <Row>

                        <Card className="mb-2">
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showPersonalInfo()}
                                    aria-controls="collapseOne">
                                    <h5 className="m-0 p-0">Personal Information</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isOpenAccordian} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <CardBody className="">
                                    <Row className="mb-2">

                                        <FormGroup>

                                            <Row>
                                                <Col>
                                                    <Label for="exampleEmail">First Name</Label>
                                                    <Input disabled type="text" name="firstname" id="firstname" placeholder="with a placeholder"
                                                        value={selectedCandidateList.firstname} />
                                                </Col>

                                                <Col>
                                                    <Col>
                                                        <Label >Middle Name :</Label>
                                                        <Input disabled type="text" name="firstname" id="firstname" placeholder=""
                                                            value="" />
                                                    </Col>
                                                </Col>
                                            </Row>

                                            <Row className="mb-2">
                                                <Col className="col-md-6">
                                                    <Label className="me-2">Last Name :</Label>
                                                    <Input type="text" disabled='true' id="lastname" name="lastname" value={selectedCandidateList.lastname} />
                                                </Col>
                                                <Col className="col-md-6">
                                                    <Label className="me-2">Email : </Label>
                                                    <Input type="text" disabled='true' id="email" name="email" value={selectedCandidateList.email} />
                                                </Col>
                                            </Row>

                                            <Row className="mb-2">
                                                <Col className="col-md-6">
                                                    <Label className="me-2">Contact :</Label>
                                                    <Input type="text" disabled='true' id="contact" name="contact" value={selectedCandidateList.phonenumber} />
                                                </Col>
                                                <Col className="col-md-6">
                                                    <Label className="me-2">Emergency Contact :</Label>
                                                    <Input type="text" disabled='true' id="contact" name="contact" value="" />
                                                </Col>

                                            </Row>

                                            <Row className="mb-2">
                                                <Col className="col-md-6">
                                                    <Label className="me-2">Date Of Birth</Label>
                                                    <Input type="text" disabled='true' id="lastname" name="lastname" value={changeDate(selectedCandidateList.dob)} />
                                                </Col>
                                                <Col className="col-md-6">
                                                    <Label className="me-2">Video Intro :</Label>
                                                    <Input type="text" disabled='true' id="lastname" name="lastname" value="-" />
                                                </Col>
                                            </Row>


                                        </FormGroup>

                                    </Row>



                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card className="mb-2">
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showContactInfo()}
                                    aria-controls="collapseTwo">
                                    <h5 className="m-0 p-0">Contact Information</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isContactAccordian} data-parent="#accordion" id="collapseTwo" aria-labelledby="headingOne">
                                <CardBody>
                                    <FormGroup>

                                        <Row>
                                            <Col>
                                                <Label for="exampleEmail">City</Label>
                                                <Input disabled type="text" name="firstname" id="firstname" placeholder="with a placeholder"
                                                    value={selectedCandidateList.firstname} />
                                            </Col>

                                            <Col>
                                                <Col>
                                                    <Label >state</Label>
                                                    <Input disabled type="text" name="firstname" id="firstname" placeholder=""
                                                        value="" />
                                                </Col>
                                            </Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <Col className="col-md-6">
                                                <Label className="me-2">Country</Label>
                                                <Input type="text" disabled='true' id="lastname" name="lastname" value={selectedCandidateList.lastname} />
                                            </Col>
                                            <Col className="col-md-6">
                                                <Label className="me-2">Zip Code</Label>
                                                <Input type="text" disabled='true' id="zipcode" name="zipcode" value={selectedCandidateList.zipcode} />
                                            </Col>
                                        </Row>


                                    </FormGroup>
                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card className="mb-2">
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showEducationInfo()}
                                    aria-controls="collapse">
                                    <h5 className="m-0 p-0">Education Qualification</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isEducationAccordian} data-parent="#accordion" id="collapse" aria-labelledby="headingOne">
                                <CardBody>

                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card className="mb-2">
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showJobInfo()}
                                    aria-controls="collapse">
                                    <h5 className="m-0 p-0">Job Title/Position</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isJobAccordian} data-parent="#accordion" id="collapse" aria-labelledby="headingOne">
                                <CardBody>
                                    <Row className="mb-2">
                                        <Col className="col-md-6">
                                            <Label className="me-2">Current Position</Label>
                                            <Input type="text" disabled='true' id="lastname" name="lastname" value={selectedCandidateList.primaryskills} />
                                        </Col>
                                        <Col className="col-md-6">
                                            <Label className="me-2">Notice Period</Label>
                                            <Input type="text" disabled='true' id="zipcode" name="zipcode" value={selectedCandidate.noticeperid} />
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col className="col-md-6">
                                            <Label className="me-2">Skills :</Label>
                                            <Input type="text" disabled='true' id="contact" name="contact" value={selectedCandidateList.secondaryskills} />
                                        </Col>
                                        <Col className="col-md-6">
                                            <Label className="me-2">Experience</Label>
                                            <Input type="text" disabled='true' id="lastname" name="lastname" value={(selectedCandidateList.experienceyears + " years")} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                        </Card>

                    </Row>
                    <Row style={{ cursor: 'pointer' }}>
                        <Col md="2" className="mt-3">
                            <Button style={{ backgroundColor: 'rgb(33 91 153)' }} className="mt-1 me-3" onClick={(evt) => navigateToListPage()}>
                                Back
                            </Button>
                        </Col>


                    </Row>
                </div>



                : <></>}

        </div >
    );
}
