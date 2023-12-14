import React, { useCallback, useEffect } from "react";
import { Modal, ModalBody, Button, ModalFooter, ModalHeader } from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
export const CustomerUploadOffer = (props) => {
  useEffect(() => {}, []);
  const onDrop = useCallback((acceptedFiles) => {
    let name = acceptedFiles[0].name.replace(/^.*[\\\/]/, "");
    console.log(name);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .doc",
  });

  const onCancel = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>Upload Offer</ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        <div className="dropzone-wrapper dropzone-wrapper-sm">
          <Dropzone
            onDrop={(e) => onDrop(e)}
            onFileDialogCancel={() => onCancel()}
          >
            {() => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone-content">
                  <p>Upload offer for candidate</p>
                  <p>
                    Try dropping some files here, or click to select files to
                    upload.
                  </p>
                </div>
              </div>
            )}
          </Dropzone>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => props.onClose()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
