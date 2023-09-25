import React from "react";
import { Row, Col } from "reactstrap";
import "./createJob.scss";
import { JobDetailsDummy } from "../../_containers/customer/createJob/dummyData";

export default function DuplicateJob() {
  return (
    <>
      <Row className="mt-4">
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3 mb-2">
            Basic information
          </p>
          <div className="information-section">
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Company name</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {JobDetailsDummy.jobCompanyDtos.companyname}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job title</h6>
                  <p className="mb-0 mt-1 mr-1">{JobDetailsDummy.jobtitle}</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Number of positions
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {JobDetailsDummy.noofopenposition}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job location</h6>
                  <p className="mb-0 mt-1 mr-1">{"Full Time"}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Address</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {"Centerville Country, AR-7"}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">City</h6>
                  <p className="mb-0 mt-1 mr-1">{"Centreville"}</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">State</h6>
                  <p className="mb-0 mt-1 mr-1">{"Arkansas"}</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Zip code</h6>
                  <p className="mb-0 mt-1 mr-1">{"728 29"}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Description</h6>
                  <p className="mb-2 mt-1 mr-1">
                    {JobDetailsDummy.description}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Company details</h6>
                  <p className="mb-2 mt-1 mr-1">{JobDetailsDummy.pitch}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Experience & schedules
          </p>
          <div className="information-section">
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job Type</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {JobDetailsDummy.employmentmodename}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Experience level</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Work schedules</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Shifts</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Hiring timeline</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col></Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Payments & benefits
          </p>
          <div className="information-section">
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Pay period type</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Minimum amount</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Maximum amount</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Compensation package
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Benefits</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col></Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Key qualifications
          </p>
          <div className="information-section">
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Additional qualification for the role
                  </h6>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Must have</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Nice to have</h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Pre-screen applicants
          </p>
          <div className="information-section">
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Please list 2-3 dates and time ranges that you could do an
                    interview
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Will you be able to reliably commute to work location for
                    this job?
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Will you be able to relocate to be within reasonable
                    commuting distance from work location?
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Authorized to work in the United States:
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Request pre-recorded screen:
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    How would you like applicants to record their answers?
                  </h6>
                  <p className="mb-0 mt-1 mr-1">-</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}
