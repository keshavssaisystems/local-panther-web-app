import React, { useCallback, useState } from "react";
import {
  Modal,
  CardBody,
  Card,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Input,
  Label,
} from "reactstrap";
import AsyncSelect from "react-select/async";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { debounce } from "lodash";
import { getLocation } from "_store";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";

import "./completeCandProfileModal.scss";

export const CompleteCandProfileModal = (props) => {
  const [zipcodeCityState, setZipcodeCityState] = useState({});
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState(false);

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
  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 0) {
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
          label: `${rest.location}, ${rest.statename}`,
        };
      });
    }
  };

  return (
    <Modal
      // toggle={() => {
      //   props.onCloseModal();
      // }}
      className="modal-dialog-align"
      isOpen={props.isOpen}
    >
      <Card style={{ padding: "16px" }}>
        <Row>
          <Col className="col-12">
            <div className="forms-wizard-alt ms-3 me-3">
              <ol className="forms-wizard">
                <li className="form-wizard-step-done" key={0} value={0}>
                  <span></span>
                  <em></em>
                  <span></span>
                </li>
                <li className="form-wizard-step-done" key={1} value={1}>
                  <em></em>
                </li>
                <li className="form-wizard-step-done" key={2} value={2}>
                  <em></em>
                </li>
                <li className="form-wizard-step-done" key={3} value={3}>
                  <em></em>
                </li>
              </ol>
            </div>
          </Col>
          <Col className="col-12">Complete Your Profile</Col>
          <Col className="col-12">
            To recommend the most relevant opportunities, we need a few
            essential details.
          </Col>
          <Col className="col-12">
            {" "}
            <FormGroup tag="fieldset">
              {" "}
              <legend>Employment Eligibility</legend>
              <FormGroup check>
                <Input name="radio1" type="radio" />{" "}
                <Label check>Authorized to work in the US</Label>
              </FormGroup>
              <FormGroup check>
                <Input name="radio1" type="radio" />{" "}
                <Label check>Sponsorship required</Label>
              </FormGroup>
            </FormGroup>
          </Col>
          <Col className="col-12">
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                City, State<span style={{ color: "red" }}>* </span>{" "}
              </Label>
              <AsyncSelect
                name={"city"}
                placeholder="Search city or zipcode"
                cacheOptions
                loadOptions={loadOptionsDeb}
                isMulti={false}
                // className={cityValidation === true ? "async-border-red" : ""}
              />
              {/* {cityValidation === true && (
                <FormText color="danger">Please select city</FormText>
              )} */}
            </FormGroup>
          </Col>
          <Col className="col-12">
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
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center interview-btn">
            <Button
              color="primary"
              className="me-2 accept-modal-btn"
              // onClick={(evt) => props.onAcceptYesClick()}
            >
              Yes
            </Button>
            <Button
              color="primary"
              className="success-close-btn"
              onClick={(evt) => props.onCloseModal()}
            >
              No
            </Button>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
