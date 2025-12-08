import { get } from "lodash";
import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Button,
} from "reactstrap";

export const CandidateCVModal = (props) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [documentOpenModal, setDocumentOpenModal] = useState(false);
  const onCandidateResume = async () => {
    const response = await fetch(props.url);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
  }

  const downloadDocument = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = url.split("/").pop();
    link.click();
  };

  useEffect(() => {
    const run = async () => {
      if (getFileType(props.url) === "unknown") {
        await downloadDocument(props.url);
        props.onClose()
        return;
      }

      if (props.isOpen) {
        onCandidateResume();
      }
    };

    run();
  }, [props.isOpen]);



  const getFileType = (url) => {
    if (!url) return null;

    const lower = url.toLowerCase();

    if (lower.endsWith(".pdf")) return "pdf";
    if (lower.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) return "image";

    return "unknown";
  }

  return (<Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg" className="modal-reject-align ">
    <ModalHeader toggle={() => props.onClose()}></ModalHeader>

    <ModalBody style={{ height: "80vh" }}>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="document"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      )}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={() => props.onClose()}>
        Close
      </Button>
    </ModalFooter>
  </Modal>);

  // return (
  //   <Modal
  //     toggle={() => props.onClose()}
  //     className="modal-reject-align "
  //     isOpen={props.isOpen}
  //     backdrop="fade"
  //     size="xl"
  //   >
  //     <ModalHeader toggle={() => props.onClose()}></ModalHeader>
  //     <ModalBody style={{ maxHeight: "100%"}}> 
  //       {pdfUrl && (
  //         <iframe
  //           src={pdfUrl}
  //           title="document"
  //           width="100%"
  //           height="100%"
  //           style={{ border: "none" }}
  //         ></iframe>
  //       )}
  //     </ModalBody>
  //     <ModalFooter>
  //       <Button color="primary" onClick={() => props.onClose()}>
  //         Close
  //       </Button>
  //     </ModalFooter>
  //   </Modal>
  // );
};
