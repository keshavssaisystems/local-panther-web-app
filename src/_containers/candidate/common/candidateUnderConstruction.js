import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import "./underConstruction.scss";

export function CandidateUnderConstruction({ title }) {
  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading={title} icon={titlelogo} />
        </Col>
        <Col md="12">
          <Card>
            <CardBody>
              <div className="widget-chart">
                <div className="icon-wrapper rounded-circle">
                  <div className="icon-wrapper-bg bg-primary" />
                  <i className="lnr-construction text-primary" />
                </div>
                <div className="widget-numbers"></div>
                <div className="widget-title under-construction">
                  {title} page is under construction
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
