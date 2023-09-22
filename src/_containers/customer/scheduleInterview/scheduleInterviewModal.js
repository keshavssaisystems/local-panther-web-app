import React, { useState } from "react";

import {
  Modal, 
  ModalBody, 
  Form,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

export function ScheduleInterviewModal({ isOpen = false }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <Modal
        isOpen={isOpen}
        fullscreen={"lg"}
        size="lg"
        backdrop={"static"}
      >
        <ModalBody>
        <div>
              <Card className="main-card mb-3">
                <CardHeader className="d-block text-center">
                  <h5>Schedule interview</h5>
                </CardHeader>
                <CardBody className="pt-4">
                  <Col md="8" className="mx-auto">
                    <Row>
                      <Col md={6}>
                        <Label for="exampleEmail">Candidate name: Vinit</Label>
                      </Col>
                      <Col md={6}>
                        <Label for="exampleEmail">Job: Backend Developer</Label>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="examplePassword">Date *</Label>
                          <Input type="date" name="password" id="examplePassword" placeholder="password placeholder"/>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="examplePassword">Start time *</Label>
                          <Input type="time" name="password" id="examplePassword" placeholder="password placeholder"/>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="examplePassword">Duration *</Label>
                          <Input type="select" name="password" id="examplePassword" placeholder="password placeholder"/>
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label for="exampleAddress">Format *</Label>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleAddress2">Paste Video Link *</Label>
                      <Input type="text" name="address2"id="exampleAddress2" placeholder="Enter video link"/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleAddress2">Message</Label>
                      <Input type="textarea" name="address2"id="exampleAddress2" placeholder="Enter message"/>
                    </FormGroup>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleCity">Interviewer</Label>
                          <Input type="text" name="city" id="exampleCity" />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleState">Phone</Label>
                          <Input type="text" name="state" id="exampleState" />
                        </FormGroup>
                      </Col>
                    </Row>                    
                  </Col>
                </CardBody>
                <CardFooter className="d-block text-center">
                  <Button size="sm" className="me-2" color="link">
                    Cancel
                  </Button>
                  <Button size="lg" color="primary">
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </div>
        </ModalBody>
      </Modal>
    </>
  );
}
