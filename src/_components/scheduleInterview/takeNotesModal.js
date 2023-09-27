import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  Form,
  ModalHeader,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "./scheduledInterview.scss";

export function TakeNotesModal() {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <Button
        outline
        className="mb-2 mr-2 btn-transition btn btn-outline-primary"
        color="primary"
        size={"sm"}
        onClick={toggle}
      >
        {" "}
        Take notes{" "}
      </Button>
      <Modal
        isOpen={modal}
        fullscreen={"lg"}
        size="xl"
        backdrop={"static"}
        toggle={toggle}
        className="schedule-modal"
      >
        <ModalHeader toggle={toggle}>Notes</ModalHeader>
        <ModalBody className="pt-3">
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
            <div className="divider" />
            <div className="d-block text-center">
              <Button size="lg" color="primary" type="submit">
                Save notes
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
