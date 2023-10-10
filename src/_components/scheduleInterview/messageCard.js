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

export function MessageCard({ interviewId, postMessageData }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const getFormData = (event) => {
    event.preventDefault();
    let data = {
      scheduleinterviewid: interviewId,
      intervieweremailids: event.target.elements.inviteEmails.value,
    };
    postMessageData(data);
    setShowSuccessMessage(true);
  };
  return (
    <>
      <Card>
        <CardBody>
          <Form onSubmit={(e) => getFormData(e)}>
            <Col md="12">
              <FormGroup>
                <Label for="inviteEmails" className="fw-semi-bold">
                  Message
                </Label>
                {showSuccessMessage === true && (
                  <p className="float-end">
                    <FormText color="success">
                      Interviewer list updated successfully!!!
                    </FormText>
                  </p>
                )}
                <Input
                  type="textarea"
                  name="inviteEmails"
                  id="inviteEmails"
                  placeholder="Enter message"
                />
              </FormGroup>
            </Col>
            <div className="float-end">
              <Button size="sm" color="primary" type="submit">
                Save & send
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
