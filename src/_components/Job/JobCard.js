import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import "../../customer/Jobs/jobList.css";
import { useNavigate } from "react-router-dom";

export function JobCard({
  name,
  customer,
  minExperience,
  maxExperience,
  location,
  description,
  role,
  jobId,
  typeId,
}) {
  console.log(typeId);
  const navigate = useNavigate();
  const navigateToJobDetail = () => {
    navigate("/job-detail?type=" + typeId + "&JobId=" + jobId);
  };
  return (
    <>
      <Card className="mb-2" onClick={navigateToJobDetail}>
        <CardBody>
          <Row>
            <Col md="12">
              <CardTitle>{name}</CardTitle>
              {/* <Row className="mb-2">
                                <Col><CardText className="fw-bold">{customer}</CardText></Col>
                            </Row> */}
              <Row className="mb-2">
                <Col>
                  <CardText>
                    Exp : {minExperience}-{maxExperience} Years
                  </CardText>
                </Col>
                <Col>
                  <CardText>Location : {location}</CardText>
                </Col>
                <Col>
                  <CardText>Role : {role}</CardText>
                </Col>
              </Row>
              <CardText>{description}</CardText>
            </Col>
            {/* <Col md="3"><img alt="Card" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/generic-finance-and-marketing-icon-logo-design-template-3a451f9735990327f5b0f8a44711859c_screen.jpg?ts=1611418926" className="company-logo float-end" /></Col> */}
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
