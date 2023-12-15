import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  Button,
  ModalFooter,
  ModalHeader,
  ButtonGroup,
  FormText,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
export const CustomerUploadOffer = (props) => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState(false);
  useEffect(() => {}, []);
  const onDrop = useCallback((acceptedFiles) => {
    let name = acceptedFiles[0].name.replace(/^.*[\\\/]/, "");
    setFileError(name === "");
    setFileName(name);
    setFile(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .doc",
  });

  const onCancel = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  const onUploadClick = () => {
    if (fileName === "") {
      setFileError(true);
      return false;
    } else {
      props.uploadOfferDoc(file);
    }
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
        <div className="pt-2">
          <strong className="content-title">
            <span className="me-2">{fileName}</span>
          </strong>
          {fileError ? (
            <FormText color="danger">Please select file for upload.</FormText>
          ) : (
            <></>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button
            color="primary"
            className="me-2"
            onClick={() => onUploadClick()}
          >
            Upload File
          </Button>
          <Button color="secondary" onClick={() => props.onClose()}>
            Close
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};
