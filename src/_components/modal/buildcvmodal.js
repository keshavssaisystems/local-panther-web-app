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
import { ProfilePDF } from "_containers/candidate/profilePDF";

export const BuildCVModal = (props) => {
  return (
    <Modal
      toggle={() => props.onClose()}
      className="modal-reject-align "
      isOpen={props.isOpen}
      backdrop="fade"
      size="lg"
    >
      <ModalHeader toggle={() => props.onClose()}></ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        <ProfilePDF hideDownLoad={true} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
