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
import { CustJobDetail } from "_containers/customer/newjobs/custjobdetails";

export const CustJobDetailModal = (props) => {
  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>Job details</ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        <CustJobDetail
          jobDetails={props.data}
          isModal={true}
          isAdmin={props.isAdmin ? props.isAdmin : false}
        ></CustJobDetail>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
