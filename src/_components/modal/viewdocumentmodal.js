import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";

export const ViewDocumentModal = ({ isOpen, url, onClose }) => {
  const [blobUrl, setBlobUrl] = useState("");
  const [documentType, setDocumentType] = useState("");

  useEffect(() => {
    if (!isOpen || !url) return;

    const loadDocument = async () => {
      const response = await fetch(url);
      const blob = await response.blob();

      const contentType = response.headers.get("content-type");
      const type = getFileTypeFromResponse(contentType);

      const objectUrl = URL.createObjectURL(blob);

      if (type === "unknown") {
        // fallback → download
        downloadBlob(objectUrl, url);
        onClose();
        return;
      }

      setDocumentType(type);
      setBlobUrl(objectUrl);
    };

    loadDocument();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [isOpen, url]);

  const getFileTypeFromResponse = (contentType) => {
    if (!contentType) return "unknown";
    if (contentType.includes("pdf")) return "pdf";
    if (contentType.startsWith("image/")) return "image";
    return "unknown";
  };

  const downloadBlob = (blobUrl, originalUrl) => {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = originalUrl.split("/").pop() || "document";
    link.click();
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody style={{ height: "80vh" }}>
        {documentType === "pdf" && (
          <iframe
            src={blobUrl}
            title="document"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        )}

        {documentType === "image" && (
          <img
            src={blobUrl}
            alt="document"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};
