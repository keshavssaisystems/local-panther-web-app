import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Button,
} from "reactstrap";

export const PrescreenModal = (props) => {
  return (
    <Modal
      toggle={() => props.onClose()}
      className="modal-reject-align "
      isOpen={props.isOpen}
      backdrop="fade"
    >
      <ModalHeader toggle={() => props.onClose()}>Pre-screen</ModalHeader>
      <ModalBody></ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
