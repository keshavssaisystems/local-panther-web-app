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

export function InviteToInterviewCard({ interviewId, postInviteData }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const getFormData = (event) => {
    event.preventDefault();
    let data = {
      scheduleinterviewid: interviewId,
      intervieweremailids: event.target.elements.inviteEmails.value,
    };
    postInviteData(data);
    setShowSuccessMessage(true);
    event.target.elements.inviteEmails.value = "";
  };
  return (
    <>
      <Card>
        <CardBody>
          <Form onSubmit={(e) => getFormData(e)}>
            <Col md="12">
              <FormGroup>
                <Label for="inviteEmails" className="fw-semi-bold">
                  Invite to interview
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
                  placeholder="Invite hiring managers or other interviewers - enter emails seperated by comma"
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
