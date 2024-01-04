import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  Button,
  ModalFooter,
  ModalHeader,
  ButtonGroup,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  FormText,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import "../../_components/formComponents/Form.scss";

export const CustomerUploadOffer = (props) => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [pay, setPay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [payErr, setPayErr] = useState(false);
  const [startDateErr, setStartDateErr] = useState(false);
  const [finalOffer, setFinalOffer] = useState(false);

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
    if (fileName === "" || startDate === "" || pay === "") {
      setFileError(fileName === "");
      setStartDateErr(startDate === "");
      setPayErr(pay === "");
      return false;
    } else if (fileName !== "" && startDate !== " " && pay !== "") {
      props.uploadOfferDoc(
        file,
        startDate,
        pay.replaceAll(",", ""),
        finalOffer
      );
    }
  };

  const setPayVal = (e) => {
    setPayErr(e.target.value === "");
    let val = new Intl.NumberFormat("en-US").format(
      e.target.value.replaceAll(",", "")
    );
    setPay(val);
  };

  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>Make Offer</ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for={"pay"} className="fw-semi-bold">
                Salary<span style={{ color: "red" }}>* </span>
              </Label>
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id={"pay"}
                  name={"pay"}
                  type={"text"}
                  value={pay}
                  placeholder={"Enter salary"}
                  invalid={false}
                  onChange={(e) => setPayVal(e)}
                />
              </InputGroup>
              {payErr && (
                <FormText color="danger">Please enter salary amount</FormText>
              )}
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for={"pay"} className="fw-semi-bold">
                Start date<span style={{ color: "red" }}>* </span>
              </Label>
              <DatePicker
                name="startdate"
                placeholderText="Select start date"
                className="form-control"
                selected={startDate}
                minDate={new Date()}
                showMonthDropdown
                showYearDropdown
                onChange={(date) => {
                  setStartDate(date);
                  setStartDateErr(date === "");
                }}
              />
              {startDateErr && (
                <FormText color="danger">Please select start date</FormText>
              )}
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
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
                        Try dropping some files here, or click to select files
                        to upload.
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
            <div className="pt-2">
              <strong className="content-title">
                <span className="me-2 mt-1 mb-1">{fileName}</span>
              </strong>
              {fileError ? (
                <FormText color="danger">
                  Please select file for upload.
                </FormText>
              ) : (
                <></>
              )}
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Input
              type="checkbox"
              value={finalOffer}
              onChange={(e) => {
                setFinalOffer(e.target.checked);
              }}
            />
            <Label className="ps-1"> Is final offer</Label>
          </Col>
        </Row>
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
