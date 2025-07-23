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
import "../../_containers/payment/payment.scss";

export const PaymentModal = (props) => {
  return (
    <Modal
      size="xl"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      className="payment-cont"
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>Payment Details</ModalHeader>
      <ModalBody style={{ maxHeight: "80vh", overflow: "auto" }}>
        <PaymentDetails
          isAdmin={true}
          selectedCustomer={props.selectedCustomer}
          onClose={() => props.onClose()}
          userId={props?.userId}
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
