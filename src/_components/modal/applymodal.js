import React from "react";
import { Modal, CardBody, Card, Row, Col, Button } from "reactstrap";
import successIcon from "../../assets/utils/images/success_icon.svg";

export const ApplyModal = (props) => {
  return (
    <Modal className="modal-dialog-align" isOpen={props.isAMOpen}>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3">
            <img src={successIcon} alt="success-icon" />
          </div>
          <div className="mb-0 d-flex justify-content-center success-modal-text">
            You have successfully applied...!!!
          </div>
          <div>
            
            <Row>
              <Col className="d-flex justify-content-center interview-btn">
                <Button
                  color="primary"
                  className="me-2 accept-modal-btn"
                  onClick={(evt) => props.onApplyYesClick()}
                >
                  Ok
                </Button>
               
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Modal>
  );
};
