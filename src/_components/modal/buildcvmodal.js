import React, { useRef } from "react";
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
import { OpenWorXResume } from "_containers/candidate/openWorxResume";
export const BuildCVModal = (props) => {
  const profilePDFRef = useRef();

  const handleDownloadPDF = () => {
    if (profilePDFRef.current) {
      profilePDFRef.current.generatePDF();
    }
  };

  return (
    <Modal
      toggle={() => props.onClose()}
      className="modal-reject-align "
      isOpen={props.isOpen}
      backdrop="fade"
      size="xl"
    >
      <ModalHeader toggle={() => props.onClose()}></ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        {/* <ProfilePDF hideDownLoad={true} ref={profilePDFRef} /> */}
        <OpenWorXResume hideDownLoad={true} ref={profilePDFRef} scoreJson={props?.scorejson} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleDownloadPDF}>
          Download
        </Button>

        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
