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
import { OfferHistTable } from "_components/common/offerhistory";

export const OfferHistory = (props) => {
  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
    >
      <ModalHeader
        toggle={() => props.onClose()}
      >{`Offer History - ${props.companyname}`}</ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        {props?.offerHistory && props?.offerHistory?.length > 0 ? (
          <OfferHistTable offerHistory={props?.offerHistory} />
        ) : (
          <div style={{ textAlign: "center" }}>
            No offers history to display.
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
