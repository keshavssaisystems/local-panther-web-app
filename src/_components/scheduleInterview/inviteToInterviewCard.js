import React from "react";
import {
  Card,
  CardBody,
  Form,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "./scheduledInterview.scss";

export function InviteToInterviewCard() {
  return (
    <>
      <Card>
        <CardBody>
          <Form>
            <Col md="12">
              <FormGroup>
                <Label for="notes" className="fw-semi-bold">
                  Invite to interview
                </Label>
                <Input
                  type="textarea"
                  name="notes"
                  id="notes"
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
