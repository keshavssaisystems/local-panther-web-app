import React, { useState } from "react";
import { Modal, Button, ModalBody, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { FileUploadFormGroup } from "_components/Job/FormComponents/FileUploadFormGroup";

export function UploadJDModal() {
  const [modal, setModal] = useState(false);
  const [uploadValidation, setUploadValidation] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const checkValidation = (event) => {
    event.preventDefault();
    if (event.target.elements.uploadJD.files.length === 0) {
      setUploadValidation(true);
    } else {
      setUploadValidation(false);
    }
  };
  return (
    <>
      <Button outline className="float-end button-upload" onClick={toggle}>
        Upload JD <FontAwesomeIcon icon={faPuzzlePiece} />{" "}
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        fullscreen={"md"}
        size="md"
        backdrop={"static"}
      >
        <ModalBody>
          <h1 className="d-flex justify-content-center text-heading-custom">
            Upload job description
          </h1>
          <p className="d-flex justify-content-center text-center">
            To upload a job description, please Click here to download this{" "}
            <br />
            template, fill it out, and then proceed to upload it
          </p>
          <Form onSubmit={checkValidation}>
            <FileUploadFormGroup
              label={"Upload file"}
              name={"uploadJD"}
              id={"uploadJD"}
              showValidation={uploadValidation}
              validationMessage={"Please Upload Job Description"}
              mandatory={true}
              additionalClassName={"text-margin"}
            />
            <Button
              color="primary"
              type="submit"
              className="float-end button-submit-new"
            >
              {" "}
              Submit{" "}
            </Button>
            <Button
              color="dark"
              className="float-end button-margin"
              onClick={toggle}
            >
              {" "}
              Cancel{" "}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
