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

export function NotesCard({ interviewNotes, interviewId, postNotesData }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const getFormData = (event) => {
    event.preventDefault();
    let data = {
      scheduleinterviewid: interviewId,
      interviewnotes: event.target.elements.notes.value,
    };
    postNotesData(data);
    setShowSuccessMessage(true);
  };
  return (
    <>
      <Card>
        <CardBody>
          <Form onSubmit={(e) => getFormData(e)}>
            <Col md="12">
              <FormGroup>
                <Label for="notes" className="fw-semi-bold">
                  Notes
                </Label>
                {showSuccessMessage === true && (
                  <p className="float-end">
                    <FormText color="success">
                      Notes updated successfully!!!
                    </FormText>
                  </p>
                )}

                <Input
                  type="textarea"
                  name="notes"
                  id="notes"
                  placeholder="Enter notes"
                  defaultValue={interviewNotes}
                />
              </FormGroup>
            </Col>
            <div className="float-end">
              <Button size="sm" color="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
