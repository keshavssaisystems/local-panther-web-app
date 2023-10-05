import React, { useState } from "react";
import { Modal, Button, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { BsEye } from "react-icons/bs";
import "./createJob.scss";
import moment from "moment/moment";

export function JobShortDetailModal({ data }) {
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <Button color="primary" className="action-button" onClick={toggle}>
        <BsEye className="action-icon" />
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        fullscreen={"md"}
        size="xl"
        backdrop={"static"}
      >
        <ModalHeader toggle={toggle}>{"Job Details"}</ModalHeader>
        <ModalBody className="detail-job-modal">
          <div className="information-section">
            <Row>
              <Col md={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Company name</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.companyname === null ? "-" : data.companyname}
                  </p>
                </div>
              </Col>
              <Col md={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job title</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.jobtitle === null ? "-" : data.jobtitle}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Created at</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.jobcreatedatetime === null
                      ? "-"
                      : moment(data.jobcreatedatetime).format(
                          "MMM D, YYYY h:m A"
                        )}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Current Status</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.jobstatus === null ? "-" : data.jobstatus}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Number of positions
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.noofopenposition === null
                      ? "-"
                      : data.noofopenposition}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job location</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.joblocation === 0 ? "-" : data.joblocation}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Address</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.locationaddress === null ? "-" : data.locationaddress}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">City</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.cityid === 0 ? "-" : data.cityname}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">State</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.stateid === 0 ? "" : data.statename}
                  </p>
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Zip code</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {data.zipcode === null ? "-" : data.zipcode}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Description</h6>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        data.description === null ? "-" : data.description,
                    }}
                    className="mb-2 mt-1 mr-1"
                  />
                </div>
              </Col>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Company details</h6>
                  <p className="mb-2 mt-1 mr-1">
                    {data.companydetails === null ? "-" : data.companydetails}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
