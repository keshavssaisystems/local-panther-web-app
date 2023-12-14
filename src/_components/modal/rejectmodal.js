import React, { useState } from "react";
import {
  Modal,
  CardBody,
  Card,
  Row,
  Col,
  Button,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import errorIcon from "../../assets/utils/images/error_icon.png";
import "./prescreen.scss";

export const RejectModal = (props) => {
  const [reason, setReason] = useState("");
  const [selReason, setSelReason] = useState("");
  const [save, setSave] = useState(false);

  const onAddComment = (evt) => {
    setReason(evt);
  };

  const onSubmitReject = () => {
    setSave(true);
    if (reason === "") {
      return false;
    }

    props.onSubmitReject(reason);
  };
  return (
    <Modal
      className="prescreen-modal modal-dialog-reject-align"
      isOpen={props.isRMOpen}
    >
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3">
            <img src={errorIcon} alt="error-icon" />
          </div>
          <div className="mb-0 d-flex justify-content-center reject-reason-text">
            Please Provide a Reason for
          </div>
          <div className="mb-3 d-flex justify-content-center reject-reason-text">
            Candidate Rejection
          </div>
          <div className="candidate-list">
            <Row>
              <Col>
                <FormGroup>
                  <Label className="reject-modal-label" for="exampleText">
                    Reason
                  </Label>
                  <Input
                    type="textarea"
                    className="dropdown-placeholder"
                    placeholder="Enter reason here"
                    onInput={(evt) => onAddComment(evt.target.value)}
                    name="text"
                    maxLength={100}
                    id="exampleText"
                    value={reason.value}
                    style={{
                      borderColor:
                        save && reason === "" ? "#ff0000" : "#ced4da",
                    }}
                  />
                  <span className="dropdown-placeholder float-end">
                    {reason ? reason.length : 0}/100
                  </span>
                  {save && reason === "" ? (
                    <p className="filter-info-text">Reason is required</p>
                  ) : (
                    <></>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center ">
                <Button
                  className="me-2 reject-modal-btn"
                  color="primary"
                  onClick={(evt) => onSubmitReject()}
                >
                  Submit
                </Button>
                <Button
                  className="reject-close-btn"
                  onClick={(evt) => props.onCancelReject()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Modal>
  );
};
