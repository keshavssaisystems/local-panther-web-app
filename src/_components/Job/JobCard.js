import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import "./job.scss";
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
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
