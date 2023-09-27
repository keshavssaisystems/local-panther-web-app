import React from "react";
import { Modal, CardBody, Card, Row, Col, Button } from "reactstrap";
import successIcon from "../../assets/utils/images/success_icon.svg";

export const RejectSuccessModal = (props) => {
  return (
    <Modal className="modal-reject-align " isOpen={props.isRejectConfOpen}>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3">
            <img src={successIcon} alt="success-icon" />
          </div>
          <div className="mb-0 d-flex justify-content-center rejected-success-text">
            Candidate Rejected
          </div>
          <div className="mb-3 d-flex justify-content-center rejected-success-text">
            {" "}
            Successfully!
          </div>
          <div className="mb-3 d-flex justify-content-center reject-text">
            {" "}
            Thank you!
          </div>
          <div>
            <Row>
              <Col className="d-flex justify-content-center ">
                <Button
                  color="primary"
                  onClick={(evt) => props.onOkClickRejSuccess()}
                >
                  OK
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Modal>
  );
};
