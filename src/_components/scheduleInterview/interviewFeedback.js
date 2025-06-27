import React, { useState } from "react";
import {
  Card,
  CardBody,
  Form,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
} from "reactstrap";
import "./scheduledInterview.scss";
import { useSelector } from "react-redux";

export function InterviewFeedback({
  interviewId,
  postFeedbackData,
  zoomScreen = false,
  onCancel,
}) {
  const interviewStatus = useSelector(
    (state) => state.scheduleInterview.interviewStatus
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const getFormData = (event) => {
    event.preventDefault();
    let data = {
      scheduleinterviewid: interviewId ? Number(interviewId) : 0,
      interviewfeedback: event.target.elements.interviewFeedback.value,
      interviewstatusid: Number(event.target.elements.interviewStatus.value),
    };
    postFeedbackData(data);
    setShowSuccessMessage(true);
  };
  return (
    <>
      <Card>
        <CardBody>
          <Form onSubmit={(e) => getFormData(e)}>
            <Col md="12">
              {showSuccessMessage === true && (
                <p className="float-end">
                  <FormText color="success">
                    Interview feedback submitted successfully!
                  </FormText>
                </p>
              )}
              <FormGroup>
                <Label for="interviewFeedback" className="fw-semi-bold">
                  Select Interview feedback
                </Label>
                <Input type="select" name="interviewStatus">
                  {interviewStatus?.length > 0 &&
                    interviewStatus.map((data) => {
                      return (
                        <option value={data.id} key={data.id}>
                          {data.name}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <Input
                  type="textarea"
                  name="interviewFeedbacktext"
                  id="interviewFeedback"
                  placeholder="Enter interview feedback"
                />
              </FormGroup>
            </Col>
            <div className="float-end">
              <Button size="sm" color="primary" type="submit">
                Submit interview feedback
              </Button>
              {zoomScreen && (
                <Button
                  onClick={() => {
                    onCancel();
                  }}
                  size="sm"
                  className="ms-2"
                >
                  Cancel{" "}
                </Button>
              )}
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
