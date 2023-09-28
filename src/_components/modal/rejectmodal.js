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

export const RejectModal = (props) => {
  const [reason, setReason] = useState("");
  const [selReason, setSelReason] = useState("");
  const [reasonErr, setReasonErr] = useState(false);
  const reasonList = [
    {
      value: 1,
      type: "Location Issue",
    },
    {
      value: 2,
      type: "Skills not matched",
    },
    {
      value: 3,
      type: "Fake Profile",
    },
  ];

  const onChangeReason = (evt) => {
    setReasonErr(false);
    setSelReason(evt);
  };
  const onAddComment = (evt) => {
    setReason(evt);
  };

  const onSubmitReject = () => {
    if (selReason === "") {
      setReasonErr(true);
      return false;
    }
    props.onSubmitReject();
  };
  return (
    <Modal className="modal-dialog-reject-align" isOpen={props.isRMOpen}>
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
              <Col className="mb-2">
                <Label
                  className="reject-modal-label"
                  for="exampleCustomSelectDisabled"
                >
                  Reason <span className="required-icon">*</span>
                </Label>
                <Input
                  className="reason-dropdown-input dropdown-placeholder"
                  style={{
                    borderColor: reasonErr ? "red" : "#ced4da",
                  }}
                  type="select"
                  id="jobType"
                  name="jobType"
                  placeholder="Select Reason"
                  onChange={(evt) => onChangeReason(evt.target.value)}
                  value={selReason}
                >
                  <option className="dropdown-placeholder">
                    Select Reason
                  </option>
                  {reasonList.map((col) => (
                    <option key={col.value} value={col.value}>
                      {col.type}
                    </option>
                  ))}
                </Input>
                {reasonErr ? (
                  <p className="filter-info-text filter-error-msg">
                    Reason is required
                  </p>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label className="reject-modal-label" for="exampleText">
                    Comment
                  </Label>
                  <Input
                    type="textarea"
                    className="dropdown-placeholder"
                    placeholder="Enter comment here"
                    onInput={(evt) => onAddComment(evt.target.value)}
                    name="text"
                    maxLength={100}
                    id="exampleText"
                    value={reason.value}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center ">
                <Button
                  className="me-2 reject-modal-btn"
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
