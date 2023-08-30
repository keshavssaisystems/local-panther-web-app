import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import  { faCalendarAlt, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./jobList.css";
import { useNavigate } from 'react-router-dom';

export function JobCard({name, customer, minExperience, maxExperience, location, description, role , jobId}) {
    const navigate = useNavigate();
    const navigateToJobDetail = () => {
        navigate("/JobDetail?JobId=" + jobId);
    };
    return (
        <>
            <Card className="mb-2" onClick={navigateToJobDetail}>
                <CardBody>
                    <Row>
                        <Col md="9">
                            <CardTitle>{name}</CardTitle>
                            <Row className="mb-2">
                                <Col><CardText className="fw-bold">{customer}</CardText></Col>
                            </Row>
                            <Row className="mb-2">
                                <Col><CardText><FontAwesomeIcon icon={faCalendarAlt} />  {minExperience}-{maxExperience}</CardText></Col>
                                <Col><CardText><FontAwesomeIcon icon={faMapMarkedAlt} />  {location}</CardText></Col>
                                <Col><CardText><FontAwesomeIcon icon={faMapMarkedAlt} />  {role}</CardText></Col>
                            </Row>
                            <CardText>{description}</CardText>
                        </Col>
                        <Col md="3"><img alt="Card" src="https://saisystems.com/wp-content/uploads/2021/01/SAI-LOGO_COLOR_INT_horiz-trans.png" className="company-logo float-end" /></Col>
                    </Row>
                    
                </CardBody>
            </Card>
        </>
    );
}