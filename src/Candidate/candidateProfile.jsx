import React, { useState, useEffect } from "react";
import { Table, Label, Input } from "reactstrap";
import { candidateActions } from '_store';
import {
    Row, Col, Card,
    CardBody,
    CardTitle,
    Collapse,
    CardHeader,
    Button
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
        setOpenAccordian(true)
    }

    return (
        <div>

            {selectedCandidateList ?
                <div>
                    <PageTitle heading="Candidate Profile" />

                    <Row>

                        <Card>
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showPersonalInfo()}
                                    aria-controls="collapseOne">
                                    <h5 className="m-0 p-0">Personal Information</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isOpenAccordian} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <CardBody>

                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card>
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showPersonalInfo()}
                                    aria-controls="collapseTwo">
                                    <h5 className="m-0 p-0">Contact Information</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isOpenAccordian} data-parent="#accordion" id="collapseTwo" aria-labelledby="headingOne">
                                <CardBody>

                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card>
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-start m-0 p-0" onClick={() => showPersonalInfo()}
                                    aria-controls="collapse">
                                    <h5 className="m-0 p-0">Education Qualification</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen={isOpenAccordian} data-parent="#accordion" id="collapse" aria-labelledby="headingOne">
                                <CardBody>

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
