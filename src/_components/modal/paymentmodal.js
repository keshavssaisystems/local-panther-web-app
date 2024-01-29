import React from "react";
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Button,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { PaymentDetails } from "_containers/payment/paydetails";

export const PaymentModal = (props) => {
  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>Payment Details</ModalHeader>
      <ModalBody style={{ maxHeight: "80vh", overflow: "auto" }}>
        <PaymentDetails
          isAdmin={true}
          selectedCustomer={props.selectedCustomer}
          onClose={() => props.onClose()}
        ></PaymentDetails>
      </ModalBody>
      {/* <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};
