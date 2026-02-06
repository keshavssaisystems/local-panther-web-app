import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "reactstrap";

export const ViewDocumentModal = (props) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const objectUrlRef = useRef(null);
  const isMountedRef = useRef(false);

  const getFileType = (url) => {
    if (!url) return "unknown";

    const lower = url.toLowerCase();
    if (lower.endsWith(".pdf")) return "pdf";
    if (lower.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) return "image";
    return "unknown";
  };

  const downloadDocument = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = url.split("/").pop();
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  const loadDocument = async () => {
    try {
      const response = await fetch(props.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (!isMountedRef.current) {
        URL.revokeObjectURL(blobUrl);
        return;
      }

      objectUrlRef.current = blobUrl;
      setPdfUrl(blobUrl);
    } catch (e) {
      // optional logging
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    if (!props.isOpen || !props.url) return;

    const type = getFileType(props.url);
    setDocumentType(type);

    if (type === "unknown") {
      downloadDocument(props.url).finally(() => {
        if (isMountedRef.current) props.onClose();
      });
      return;
    }

    loadDocument();

    return () => {
      isMountedRef.current = false;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      setPdfUrl(null);
      setDocumentType(null);
    };
  }, [props.isOpen, props.url]);

  return (
    <Modal isOpen={props.isOpen} toggle={props.onClose} size="lg">
      <ModalHeader toggle={props.onClose} />
      <ModalBody style={{ height: "80vh" }}>
        {pdfUrl && documentType === "pdf" && (
          <iframe
            src={pdfUrl}
            title="document"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}
        {pdfUrl && documentType === "image" && (
          <img
            src={pdfUrl}
            alt="document"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
