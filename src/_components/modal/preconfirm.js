import React from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

export const PreConfirm = (props) => {
  return (
    <Modal className="modal-reject-align " isOpen={props?.isOpen}>
      <ModalHeader toggle={() => props?.onClose()}>{props?.title}</ModalHeader>
      <ModalBody>{props?.description}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props?.onYesClick()}>
          Yes
        </Button>
        <Button color="secondary" onClick={() => props?.onClose()}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
};
