import React, { useState } from "react";
import {
  Label,
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Button,
  FormText,
} from "reactstrap";
import { CKEditor } from "ckeditor4-react";
import "./createJob.scss";

export function BasicInformation({ data, jobLocationOptions }) {
  // console.log(data.length);
  const [preValue, setPreValue] = useState({
    companyId: "",
    jobTitle: data.length > 0 ? data[0].jobTitle : "",
    noOfPostions: data.length > 0 ? data[0].noOfPostions : "",
    jobLocation: data.length > 0 ? data[0].jobLocation : "",
    address: data.length > 0 ? data[0].address : "",
    cityId: data.length > 0 ? data[0].cityId : "",
    stateId: data.length > 0 ? data[0].stateId : "",
    zipcode: data.length > 0 ? data[0].zipcode : "",
    description: data.length > 0 ? data[0].description : "",
    companyDetail: data.length > 0 ? data[0].companyDetail : "",
  });
  const [descriptionData, setDescriptionData] = useState("");
  const [basicInformationData, setBasicInformationData] = useState();
  const [companyValidation, setcompanyValidation] = useState(false);
  const [jobTitleValidation, setJobTitleValidation] = useState(false);
  const [openPositionValidation, setOpenPositionValidation] = useState(false);
  const [cityValidation, setCityValidation] = useState(false);
  const [descriptionValidation, setDescriptionValidation] = useState(false);

  const getFormValidation = (event) => {
    event.preventDefault();
    event.target.elements.companyName.value === ""
      ? setcompanyValidation(true)
      : setcompanyValidation(false);
    event.target.elements.jobTitle.value === ""
      ? setJobTitleValidation(true)
      : setJobTitleValidation(false);
    event.target.elements.openPositions.value === ""
      ? setOpenPositionValidation(true)
      : setOpenPositionValidation(false);
    event.target.elements.city.value === ""
      ? setCityValidation(true)
      : setCityValidation(false);
    descriptionData === ""
      ? setDescriptionValidation(true)
      : setDescriptionValidation(false);
    if (
      event.target.elements.companyName.value !== "" &&
      event.target.elements.jobTitle.value !== "" &&
      event.target.elements.openPositions.value !== "" &&
      event.target.elements.city.value !== "" &&
      descriptionData !== ""
    ) {
      saveData(event);
    }
  };
  const saveData = (eventData) => {
    setBasicInformationData({
      companyId: eventData.target.elements.companyName.value,
      jobTitle: eventData.target.elements.jobTitle.value,
      noOfPostions: eventData.target.elements.openPositions.value,
      jobLocation: eventData.target.elements.jobLocation.value,
      address: eventData.target.elements.address.value,
      cityId: eventData.target.elements.city.value,
      stateId: eventData.target.elements.state.value,
      zipcode: eventData.target.elements.zipCode.value,
      description: descriptionData,
      companyDetail: eventData.target.elements.companyDetails.value,
    });
    setPreValue(basicInformationData);
    console.log(basicInformationData);
  };

  return (
    <>
      <Form onSubmit={(e) => getFormValidation(e)}>
        <Row>
          <Col>
            <FormGroup>
              <Label className="fw-semi-bold">
                Company name<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"companyName"}
                name={"companyName"}
                type={"text"}
                value={"Saisystems Technology"}
                disabled
              />
              {companyValidation === true && (
                <FormText color="danger">Please enter company name</FormText>
              )}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for={"jobTitle"} className="fw-semi-bold">
                Job title<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"jobTitle"}
                name={"jobTitle"}
                type={"text"}
                placeholder="Eg. UX UI Designer"
                defaultValue={preValue.jobTitle}
                maxLength={50}
                invalid={jobTitleValidation === true ? true : false}
              />
              {jobTitleValidation === true && (
                <FormText color="danger">Please enter job title</FormText>
              )}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="openPositions" className="fw-semi-bold">
                Number of position<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"openPositions"}
                name={"openPositions"}
                type={"number"}
                placeholder="Eg. 2"
                defaultValue={preValue.noOfPostions}
                min={0}
                invalid={openPositionValidation === true ? true : false}
              />
              {openPositionValidation === true && (
                <FormText color="danger">
                  Please enter number of positions
                </FormText>
              )}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="jobLocation" className="fw-semi-bold">
                Job location
              </Label>
              <Input id={"jobLocation"} name={"jobLocation"} type={"select"}>
                <option key={0}>Select job location</option>
                {jobLocationOptions.length > 0 &&
                  jobLocationOptions.map((options) => (
                    <option key={options.id} value={options.label}>
                      {options.label}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="address" className="fw-semi-bold">
                Address
              </Label>
              <Input
                id={"address"}
                name={"address"}
                type={"textarea"}
                placeholder="Enter address"
                defaultValue={preValue.address}
                maxLength={100}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                City<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"city"}
                name={"city"}
                type={"text"}
                defaultValue={preValue.cityId}
                placeholder="Search city"
                invalid={cityValidation === true ? true : false}
              />
              {cityValidation === true && (
                <FormText color="danger">Please select city</FormText>
              )}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                State
              </Label>
              <Input
                id={"state"}
                name={"state"}
                type={"text"}
                defaultValue={preValue.stateId}
                placeholder="Select state"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="zipCode" className="fw-semi-bold">
                Zip code
              </Label>
              <Input
                id={"zipCode"}
                name={"zipCode"}
                type={"text"}
                defaultValue={preValue.zipcode}
                placeholder="Enter zip code"
                maxLength={5}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="description" className="fw-semi-bold">
                Description<span style={{ color: "red" }}>* </span>
              </Label>
              <CKEditor
                name="description"
                id="description"
                maxLength={2000}
                data={preValue.description}
                onChange={(e) => setDescriptionData(e.editor.getData())}
                className={
                  descriptionValidation === true ? "ckeditor-invalid" : ""
                }
              />
            </FormGroup>
            {descriptionValidation === true && (
              <FormText color="danger">Please enter description</FormText>
            )}
          </Col>
          <Col>
            <FormGroup>
              <Label for="companyDetails" className="fw-semi-bold">
                Company details
              </Label>
              <Input
                id={"companyDetails"}
                name={"companyDetails"}
                type={"textarea"}
                // defaultValue={preValue.companyDetail}
                placeholder="Enter company deatils"
                maxLength={1000}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
    </>
  );
}
