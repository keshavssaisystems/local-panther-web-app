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

export const RejectReasonModal = (props) => {
  const [reason, setReason] = useState("");
  const [save, setSave] = useState(false);

  const onSubmitReject = () => {
    if (reason === "") {
      setSave(true);
      return false;
    }
    props.callBack(reason);
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
            Please provide a reason for
          </div>
          <div className="mb-3 d-flex justify-content-center reject-reason-text">
            {props.title}
          </div>
          <div>
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
                    style={{
                      borderColor:
                        save && reason === "" ? "#ff0000" : "#ced4da",
                    }}
                    placeholder="Enter reason"
                    onInput={(evt) => setReason(evt.target.value)}
                    name="text"
                    maxLength={100}
                    id="exampleText"
                    value={reason}
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
              <Col className="d-flex justify-content-center">
                <Button
                  className="me-2 reject-modal-btn"
                  onClick={(evt) => onSubmitReject()}
                >
                  Submit
                </Button>
                <Button
                  className="reject-close-btn"
                  onClick={(evt) => props.callBackError()}
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
