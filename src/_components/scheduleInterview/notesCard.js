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

export function NotesCard() {
  return (
    <>
      <Card>
        <CardBody>
          <Form>
            <Col md="12">
              <FormGroup>
                <Label for="notes" className="fw-semi-bold">
                  Notes
                </Label>
                <Input
                  type="textarea"
                  name="notes"
                  id="notes"
                  placeholder="Enter notes"
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
