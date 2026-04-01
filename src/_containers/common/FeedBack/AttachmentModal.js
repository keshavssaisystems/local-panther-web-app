import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "reactstrap";

export const AttachmentModal = (props) => {
  const { url, isOpen, onClose } = props;
  const [pdfUrl, setPdfUrl] = useState("");
  const [documentType, setDocumentType] = useState("");
  const onAttachmentView = useCallback(async () => {
    const response = await fetch(url);

    const blob = await response.blob();
    const urlBlob = URL.createObjectURL(blob);

    setPdfUrl(urlBlob);
  }, [url]);

  const downloadDocument = async (urlParam) => {
    const response = await fetch(urlParam);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = urlParam.split("/").pop();
    link.click();
  };

  useEffect(() => {
    const run = async () => {
      if (getFileType(url) === "unknown") {
        await downloadDocument(url);
        onClose()
        return;
      }

      if (isOpen) {
        onAttachmentView();
      }
    };

    run();
  }, [isOpen, url, onClose, onAttachmentView]);



  const getFileType = (urlParam) => {
    let documentType = "";
    if (!urlParam) return null;

    const lower = urlParam.toLowerCase();

    if (lower.endsWith(".pdf")) documentType = "pdf";
    else if (lower.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) documentType = "image";
    else documentType = "unknown";
    setDocumentType(documentType);
    return documentType;
  }

  return (<Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg" className="modal-reject-align ">
    <ModalHeader toggle={() => props.onClose()}></ModalHeader>

    <ModalBody style={{ height: "80vh" }}>
      {pdfUrl && documentType === "pdf" && (
        <iframe
          src={`${pdfUrl}`}
          title="document"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      )}
      {
        documentType === "image" && (<img src={pdfUrl} alt="document" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />)
      }
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={() => downloadDocument(url)}>
        Download
      </Button>
      <Button color="primary" onClick={() => onClose()}>
        Close
      </Button>
    </ModalFooter>
  </Modal>);
};