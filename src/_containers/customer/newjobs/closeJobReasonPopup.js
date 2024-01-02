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
  Form,
} from "reactstrap";
import { useSelector } from "react-redux";
import errorIcon from "assets/utils/images/error_icon.png";

export const CloseJobReasonPopup = ({
  isOpen,
  onClose,
  title,
  jobid,
  setCloseJob,
}) => {
  const reasonList = useSelector((state) => state.dropdown.closeJobReasonList);
  const [reasonValidation, setReasonValidation] = useState(false);

  const postFormData = (event) => {
    event.preventDefault();
    if (Number(event.target.elements.closeJobReason.value) === 0) {
      setReasonValidation(true);
    } else {
      setReasonValidation(false);
      setCloseJob({
        jobId: jobid,
        closedjobreasonid: Number(event.target.elements.closeJobReason.value),
      });
    }
  };
  return (
    <Modal
      className="prescreen-modal modal-dialog-reject-align"
      isOpen={isOpen}
    >
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3">
            <img src={errorIcon} alt="error-icon" />
          </div>
          <div className="mb-0 d-flex justify-content-center reject-reason-text">
            Please select a reason for
          </div>
          <div className="mb-3 d-flex justify-content-center reject-reason-text">
            closing job
          </div>
          <div>
            <Row>
              <Col>
                <Label className="reject-modal-label" for="exampleText">
                  <b>Job title -</b> {title}
                </Label>
              </Col>
            </Row>
            <Form onSubmit={(e) => postFormData(e)}>
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
                      type="select"
                      className="dropdown-placeholder"
                      name="closeJobReason"
                      style={{
                        borderColor: reasonValidation ? "#ff0000" : "#ced4da",
                      }}
                    >
                      <option key={0} value={0}>
                        Select a reason to close job
                      </option>
                      {reasonList.length > 0 &&
                        reasonList.map((options) => (
                          <option key={options.id} value={options.id}>
                            {options.name}
                          </option>
                        ))}
                    </Input>
                    {reasonValidation ? (
                      <p className="filter-info-text">Reason is required</p>
                    ) : (
                      <></>
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col className="d-flex justify-content-center">
                  <Button className="me-2 reject-modal-btn">Submit</Button>
                  <Button
                    className="reject-close-btn"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Modal>
  );
};
