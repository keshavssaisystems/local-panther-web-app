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
import { CandJobDetail } from "_containers/candidate/list/candjobcard";

export const JobDetailModal = (props) => {
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
        <CandJobDetail
          jobDetails={[props.jobDetail]}
          isModal={true}
        ></CandJobDetail>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
