import React, { useState, useEffect } from "react";
import { Table, Label, Input } from "reactstrap";
import { candidateActions } from '_store';
import {
    Row, Col, Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Button
} from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import userlogo from '../assets/utils/images/Union.svg'



export function CandidateDetails(props) {
    const dispatch = useDispatch();
    const [selectedCandidate, setSelectedCandidate] = useState(props.selectedData)
    const [selectedCandidateRes, setSelectedCandidateRes] = useState()
    const [selectedCandidateList, setSelectedCandidateList] = useState({})



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
        // let inputValue = (selectedCandidateList.firstname + selectedCandidateList.lastname)
        if (inputValue) {
            let maskLength = 5;
            if (inputValue.length <= maskLength) {
                maskLength = 1
            }

            const visiblePart = inputValue.substring(0, 3); // Get the visible part
            const maskedPart = '*'.repeat(maskLength); // Create a string of asterisks

            return visiblePart + maskedPart;

        }

        // }
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



    return (
        <div>

            {selectedCandidateList ?
                <Row>

                    <Card className="main-card">

                        <CardTitle className="mt-3 mb-3" style={{ fontSize: '21px', marginLeft: '20px' }}>Candidate Profile
                        </CardTitle>
                        <Row className="me-2" style={{ backgroundColor: 'rgb(33 91 153)', borderRadius: '5px', marginLeft: '3px' }}>
                            <Col md="12" lg="12" xl="12">
                                <div className="dropdown-menu-header">
                                    <div className="dropdown-menu-header-inner">
                                        <div className="menu-header-content btn-pane-right">
                                            <div className="avatar-icon-wrapper me-3 avatar-icon-xl">
                                                <div className="avatar-icon" style={{ border: 'none' }}>
                                                    <img src={userlogo} alt="Avatar 5" />
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="menu-header-title">{applyMask(selectedCandidateList.firstname + selectedCandidateList.lastname)}</h5>
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
                                                <Label for="exampleEmail">Resume  : </Label> {selectedCandidateRes ? <a
                                                    href={selectedCandidateRes.resumepath} target="blank">
                                                    {(selectedCandidateRes.firstname) + "_resume.pdf"}  </a> : ''}
                                            </FormGroup>
                                        </Col>

                                    </Row>


                                    <Row>

                                        <Col md="4" className="me-5">
                                            <FormGroup>
                                                <Label for="exampleEmail">Language</Label>
                                                <Input disabled type="text" name="experience" id="experience" value={selectedCandidateRes ? selectedCandidateRes.languages : ''} />
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


                            </Row>


                        </CardBody>
                    </Card>

                </Row>



                : <></>}

        </div >
    );
}
