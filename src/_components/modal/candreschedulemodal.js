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

export const CandRescheduleModal = (props) => {
  const [reason, setReason] = useState("");
  const [reasonErr, setReasonErr] = useState(false);

  const onAddComment = (evt) => {
    if (evt === "") {
      setReasonErr(true);
    } else {
      setReasonErr(false);
    }
    setReason(evt);
  };

  const onSubmitReject = () => {
    if (reason === "") {
      setReasonErr(true);
      return false;
    } else {
      props.onSubmitReschedule(reason);
    }
  };
  return (
    <Modal
      className="prescreen-modal modal-dialog-reject-align"
      isOpen={props.isOpen}
    >
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3">
            <img src={errorIcon} alt="error-icon" />
          </div>
          <div className="mb-0 d-flex justify-content-center reject-reason-text">
            Please provide a reason for
          </div>
          <div className="mb-0 d-flex justify-content-center reject-reason-text">
            reschedule
          </div>

          <div className="candidate-list">
            <Row>
              <Col>
                <FormGroup>
                  <Label className="reject-modal-label" for="exampleText">
                    Reason{" "}
                    <span
                      className="required-icon"
                      style={{ color: "#ff0000" }}
                    >
                      *
                    </span>
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
                      borderColor: reasonErr ? "#ff0000" : "#ced4da",
                    }}
                  />
                  <span className="dropdown-placeholder float-end">
                    {reason ? reason.length : 0}/100
                  </span>
                </FormGroup>
                {reasonErr ? (
                  <p className="filter-info-text">Reason is required</p>
                ) : (
                  <></>
                )}
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
                  onClick={(evt) => props.onClose()}
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
