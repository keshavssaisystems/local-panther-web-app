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
import AsyncSelect from "react-select/async";
import Select from "react-select";
import InputMask from "react-input-mask";
import { getLocation } from "_store";
import { useSelector } from "react-redux";

export function BasicInformation({
  data,
  jobLocationOptions,
  postData,
  prevStep,
  previousData,
  bIFormSubmitted,
  customerDetails,
}) {
  const fieldOfStudyOption = useSelector(
    (state) => state.dropdown.fieldOfStudyList
  );
  const levelOfEducationOption = useSelector(
    (state) => state.dropdown.levelOfEducationList
  );
  const subsidiaryOption = useSelector(
    (state) => state.dropdown.subsidiaryList
  );

  let educationOptions = levelOfEducationOption.map(
    ({ id: value, ...rest }) => {
      return {
        value: `${value}`,
        label: `${rest.name}`,
      };
    }
  );
  let fieldStudyOptions = fieldOfStudyOption.map(({ id: value, ...rest }) => {
    return {
      value: `${value}`,
      label: `${rest.name}`,
    };
  });
  const [successMessage, setSuccessMessage] = useState(false);
  const [stateData, setStateData] = useState({});
  const customStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: "30px",
      padding: "0 6px",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
  };
  const getEducationData = (data) => {
    if (data?.levelofeducationids?.split(",")?.length > 0) {
      let newData = data.levelofeducationids.split(",");
      let newOptions = educationOptions.filter((data) =>
        newData.includes(data.value)
      );
      return newOptions;
    }
    if (data?.levelofeducationids?.split(",")?.length === undefined) {
      return educationOptions.filter(
        (data2) => data2.value === Number(data?.levelofeducationids)
      );
    }
  };
  const getStudyData = (data) => {
    if (data?.fieldofstudiesids?.split(",")?.length > 0) {
      let newData = data.fieldofstudiesids.split(",");
      let newOptions = fieldStudyOptions.filter((data) =>
        newData.includes(data.value)
      );
      return newOptions;
    }
    if (data?.fieldofstudiesids?.split(",")?.length === undefined) {
      return fieldStudyOptions.filter(
        (data2) => data2.value === Number(data?.fieldofstudiesids)
      );
    }
  };
  let educationData =
    prevStep === 3 ? getEducationData(data) : getEducationData(previousData);
  let studyData =
    prevStep === 3 ? getStudyData(data) : getStudyData(previousData);
  const [preValue, setPreValue] = useState({
    companyId: "",
    jobTitle:
      data === undefined || data.jobTitle === undefined ? "" : data.jobTitle,
    noOfPostions:
      data === undefined || data.noOfPostions === undefined
        ? ""
        : data.noOfPostions,
    jobLocation:
      data === undefined || data.jobLocation === undefined
        ? ""
        : data.jobLocation,
    address:
      data === undefined || data.address === undefined ? "" : data.address,
    cityId: data === undefined || data.cityId === undefined ? "" : data.cityId,
    stateId:
      data === undefined || data.stateId === undefined ? "" : data.stateId,
    cityName:
      data === undefined || data.cityName === undefined ? "" : data.cityName,
    stateName:
      data === undefined || data.stateName === undefined ? "" : data.stateName,
    zipcode:
      data === undefined || data.zipcode === undefined ? "" : data.zipcode,
    description:
      data === undefined || data.description === undefined
        ? ""
        : data.description,
    companyDetail:
      data === undefined || data.companyDetail === undefined
        ? ""
        : data.companyDetail,
    authorizedtoworkinus:
      data === undefined || data.authorizedtoworkinus === undefined
        ? ""
        : data.authorizedtoworkinus,
    sponsorshiprequiured:
      data === undefined || data.sponsorshiprequiured === undefined
        ? ""
        : data.sponsorshiprequiured,
    certifications:
      data === undefined || data.certifications === undefined
        ? ""
        : data.certifications,
    subsidiaryid:
      data === undefined || data.subsidiaryid === undefined
        ? ""
        : data.subsidiaryid,
  });
  const [previousValue, setPreviousValue] = useState({
    companyId: "",
    jobTitle:
      previousData === undefined || previousData.jobtitle === undefined
        ? ""
        : previousData.jobtitle,
    noOfPostions:
      previousData === undefined || previousData.noofopenposition === undefined
        ? ""
        : previousData.noofopenposition,
    jobLocation:
      previousData === undefined || previousData.joblocationid === undefined
        ? ""
        : previousData.joblocationid,
    address:
      previousData === undefined || previousData.locationaddress === undefined
        ? ""
        : previousData.locationaddress,
    cityId:
      previousData === undefined || previousData.cityid === undefined
        ? ""
        : previousData.cityid,
    stateId:
      previousData === undefined || previousData.stateid === undefined
        ? ""
        : previousData.stateid,
    stateName:
      previousData === undefined || previousData.statename === undefined
        ? ""
        : previousData.statename,
    cityName:
      previousData === undefined || previousData.cityname === undefined
        ? ""
        : previousData.cityname,
    zipcode:
      previousData === undefined || previousData.zipcode === undefined
        ? ""
        : previousData.zipcode,
    description:
      previousData === undefined || previousData.description === undefined
        ? ""
        : previousData.description,
    companyDetail:
      previousData === undefined || previousData.companydetails === undefined
        ? ""
        : previousData.companydetails,
    authorizedtoworkinus:
      previousData === undefined ||
      previousData.authorizedtoworkinus === undefined
        ? ""
        : previousData.authorizedtoworkinus,
    sponsorshiprequiured:
      previousData === undefined ||
      previousData.sponsorshiprequiured === undefined
        ? ""
        : previousData.sponsorshiprequiured,
    countryName:
      previousData === undefined || previousData.statename === undefined
        ? ""
        : "US",
    certifications:
      previousData === undefined || previousData.certifications === undefined
        ? ""
        : previousData.certifications,
    subsidiaryid:
      previousData === undefined || previousData.subsidiaryid === undefined
        ? ""
        : previousData.subsidiaryid,
  });
  const [descriptionData, setDescriptionData] = useState(
    prevStep === 3 && preValue.description !== ""
      ? preValue.description
      : prevStep === 1 && previousValue.description !== ""
      ? previousValue.description
      : ""
  );
  const [companyValidation, setcompanyValidation] = useState(false);
  const [jobTitleValidation, setJobTitleValidation] = useState(false);
  const [openPositionValidation, setOpenPositionValidation] = useState(false);
  const [cityValidation, setCityValidation] = useState(false);
  const [stateOnchange, setStateOnChange] = useState(false);
  const [countryOnchange, setCountryOnChange] = useState(false);
  const [descriptionValidation, setDescriptionValidation] = useState(false);
  const [zipCodeValidation, setZipCodeValidation] = useState(false);
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
    event.target.elements.city.value ===
    "undefined, undefined, undefined, undefined"
      ? setCityValidation(true)
      : setCityValidation(false);
    event.target.elements.zipCode.value === ""
      ? setZipCodeValidation(true)
      : setZipCodeValidation(false);
    descriptionData === ""
      ? setDescriptionValidation(true)
      : setDescriptionValidation(false);
    if (
      event.target.elements.companyName.value !== "" &&
      event.target.elements.jobTitle.value !== "" &&
      event.target.elements.openPositions.value !== "" &&
      event.target.elements.zipCode.value !== "" &&
      event.target.elements.city.value !==
        "undefined, undefined, undefined, undefined" &&
      descriptionData !== ""
    ) {
      saveData(event);
    }
  };
  const saveData = (eventData) => {
    let educationString = getEducationFormData(eventData);
    let studyString = getStudyFormData(eventData);
    let data = {
      companyId: eventData.target.elements.companyName.value,
      jobTitle: eventData.target.elements.jobTitle.value,
      noOfPostions: eventData.target.elements.openPositions.value,
      jobLocation: eventData.target.elements.jobLocation.value,
      address: eventData.target.elements.address.value,
      cityId:
        stateData.cityId === undefined
          ? previousValue.cityId
          : stateData.cityId,
      stateId:
        stateData.stateId === undefined
          ? previousValue.stateId
          : stateData.stateId,
      cityName:
        stateData.cityName === undefined
          ? previousValue.cityName
          : stateData.cityName,
      stateName:
        stateData.stateName === undefined
          ? previousValue.stateName
          : stateData.stateName,
      zipcode: eventData.target.elements.zipCode.value,
      description:
        descriptionData === ""
          ? prevStep === 3
            ? preValue.description
            : previousValue.description
          : descriptionData,
      companyDetail: eventData.target.elements.companyDetails.value,
      jobLoactionOptions: jobLocationOptions,
      authorizedtoworkinus:
        eventData.target.elements.authorizedtoworkinus.checked,
      sponsorshiprequiured:
        eventData.target.elements.sponsorshiprequiured.checked,
      levelofeducationids: educationString,
      fieldofstudiesids: studyString,
      certifications: eventData.target.elements.certifications.value,
      levelofeducationOption: levelOfEducationOption,
      fieldofstudiesOption: fieldOfStudyOption,
      subsidiaryid: eventData.target.elements.subsidiaryid.value,
      subsidiaryOption: subsidiaryOption,
    };
    postData(data);
    setPreValue(data);
    setSuccessMessage(true);
    bIFormSubmitted(true);
  };
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 0) {
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
          label: `${rest.location}`,
        };
      });
    }
  };
  const getLocationDetails = (event) => {
    setCityValidation(false);
    let locationSplit = event.value.split(", ");
    setStateOnChange(true);
    setCountryOnChange(true);
    setStateData({
      cityId: locationSplit[0],
      stateId: locationSplit[1],
      cityName: locationSplit[2],
      stateName: locationSplit[3],
    });
  };

  const setupDescriptionData = (event) => {
    setDescriptionData(event);
    setDescriptionValidation(false);
  };
  const getEducationFormData = (eventData) => {
    let postEducationData = [];
    let educationArray = eventData?.target?.elements?.levelofeducationids;
    if (educationArray?.length === undefined) {
      return educationArray.value;
    }
    if (educationArray?.length > 0) {
      educationArray?.forEach((element) => {
        postEducationData.push(element.value);
      });
      return postEducationData.toString();
    }
  };
  const getStudyFormData = (eventData) => {
    let postStudyData = [];
    let studyArray = eventData?.target?.elements?.fieldofstudiesids;
    if (studyArray?.length === undefined) {
      return studyArray.value;
    }
    if (studyArray?.length > 0) {
      studyArray?.forEach((element) => {
        postStudyData.push(element.value);
      });
      return postStudyData.toString();
    }
  };
  return (
    <>
      <Form onSubmit={(e) => getFormValidation(e)}>
        <Row>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label className="fw-semi-bold">
                Company name<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"companyName"}
                name={"companyName"}
                type={"text"}
                value={customerDetails.companyname}
                disabled
              />
              {companyValidation === true && (
                <FormText color="danger">Please enter company name</FormText>
              )}
            </FormGroup>
          </Col>
          {subsidiaryOption.length > 0 && (
            <Col md={6} lg={3}>
              <FormGroup>
                <Label for={"jobTitle"} className="fw-semi-bold">
                  Subsidiary name
                </Label>
                <Input
                  id={"subsidiaryid"}
                  name={"subsidiaryid"}
                  type={"select"}
                >
                  <option key={0} value={0}>
                    Select subsidiary
                  </option>
                  {subsidiaryOption.length > 0 &&
                    subsidiaryOption.map((options) => (
                      <option
                        key={options.subsidiaryid}
                        value={options.subsidiaryid}
                        selected={
                          prevStep === 3
                            ? preValue.subsidiaryid
                            : previousValue.subsidiaryid ===
                              options.subsidiaryid
                        }
                      >
                        {options.subsidiaryname}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
          )}
        </Row>
        <Row>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for={"jobTitle"} className="fw-semi-bold">
                Job title<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"jobTitle"}
                name={"jobTitle"}
                type={"text"}
                placeholder="Eg. UX UI Designer"
                defaultValue={
                  prevStep === 3 ? preValue.jobTitle : previousValue.jobTitle
                }
                maxLength={50}
                invalid={jobTitleValidation === true ? true : false}
                onChange={(e) => setJobTitleValidation(false)}
              />
              {jobTitleValidation === true && (
                <FormText color="danger">Please enter job title</FormText>
              )}
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="openPositions" className="fw-semi-bold">
                Number of position<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                id={"openPositions"}
                name={"openPositions"}
                type={"number"}
                placeholder="Eg. 2"
                defaultValue={
                  prevStep === 3
                    ? preValue.noOfPostions
                    : previousValue.noOfPostions
                }
                min={0}
                invalid={openPositionValidation === true ? true : false}
                onChange={(e) => setOpenPositionValidation(false)}
              />
              {openPositionValidation === true && (
                <FormText color="danger">
                  Please enter number of positions
                </FormText>
              )}
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="jobLocation" className="fw-semi-bold">
                Job location
              </Label>
              <Input id={"jobLocation"} name={"jobLocation"} type={"select"}>
                <option key={0} value={0}>
                  Select job location
                </option>
                {jobLocationOptions.length > 0 &&
                  jobLocationOptions.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                      selected={
                        prevStep === 3
                          ? preValue.jobLocation
                          : previousValue.jobLocation === options.id
                      }
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="address" className="fw-semi-bold">
                Address
              </Label>
              <Input
                id={"address"}
                name={"address"}
                type={"textarea"}
                placeholder="Enter address"
                defaultValue={
                  prevStep === 3 ? preValue.address : previousValue.address
                }
                maxLength={100}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                City<span style={{ color: "red" }}>* </span>
              </Label>
              <AsyncSelect
                name={"city"}
                placeholder="Search city"
                defaultValue={
                  {
                    value:
                      prevStep === 3
                        ? data?.cityId +
                          ", " +
                          data?.stateId +
                          ", " +
                          data?.cityName +
                          ", " +
                          data?.stateName
                        : previousData?.cityid +
                          ", " +
                          previousData?.stateid +
                          ", " +
                          previousData?.cityname +
                          ", " +
                          previousData?.statename,
                    label:
                      prevStep === 3 ? data?.cityName : previousData?.cityname,
                  }
                  // previousValue.statename
                }
                loadOptions={loadOptions}
                isMulti={false}
                styles={customStyles}
                onChange={(e) => getLocationDetails(e)}
                className={cityValidation === true ? "async-border-red" : ""}
              />
              {cityValidation === true && (
                <FormText color="danger">Please select city</FormText>
              )}
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                State
              </Label>
              <Input
                id={"state"}
                name={"state"}
                type={"text"}
                readOnly
                value={
                  stateData.stateName === undefined || stateOnchange === false
                    ? previousValue.stateName
                    : stateData.stateName
                }
                placeholder="Select state"
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="country" className="fw-semi-bold">
                Country
              </Label>
              <Input
                id={"country"}
                name={"country"}
                type={"text"}
                readOnly
                value={
                  countryOnchange === false ? previousValue.countryName : "US"
                }
                placeholder="Select country"
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="zipCode" className="fw-semi-bold">
                Zip code<span style={{ color: "red" }}>* </span>
              </Label>
              <InputMask
                className={
                  zipCodeValidation === true
                    ? "is-invalid form-control"
                    : "form-control "
                }
                id={"zipCode"}
                name={"zipCode"}
                mask={"99999"}
                maskChar={null}
                defaultValue={
                  prevStep === 3 ? preValue.zipcode : previousValue.zipcode
                }
                placeholder="Enter zip code"
              />
              {zipCodeValidation === true && (
                <FormText color="danger">Please enter zip code</FormText>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={3}>
            <FormGroup className="mt-4">
              <Input
                id={"authorizedtoworkinus"}
                name={"authorizedtoworkinus"}
                type={"checkbox"}
                defaultChecked={
                  prevStep === 3
                    ? preValue.authorizedtoworkinus
                    : previousValue.authorizedtoworkinus
                }
              />
              {"  "}
              <Label for="authorizedtoworkinus" className="fw-semi-bold">
                Authorized to work in United States
              </Label>
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup className="mt-4">
              <Input
                id={"sponsorshiprequiured"}
                name={"sponsorshiprequiured"}
                type={"checkbox"}
                defaultChecked={
                  prevStep === 3
                    ? preValue.sponsorshiprequiured
                    : previousValue.sponsorshiprequiured
                }
              />{" "}
              {"  "}
              <Label for="sponsorshiprequiured" className="fw-semi-bold">
                Sponsorship is required
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="levelofeducationids" className="fw-semi-bold">
                Level of education
              </Label>
              <Select
                defaultValue={educationData}
                isMulti
                name="levelofeducationids"
                options={educationOptions}
                classNamePrefix="select"
                placeholder="Select level of education"
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="fieldofstudiesids" className="fw-semi-bold">
                Field of Study
              </Label>
              <Select
                defaultValue={studyData}
                isMulti
                name="fieldofstudiesids"
                options={fieldStudyOptions}
                classNamePrefix="select"
                placeholder="Select field of study"
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={6}>
            <FormGroup>
              <Label for="certifications" className="fw-semi-bold">
                Certification
              </Label>
              <Input
                id={"certifications"}
                name={"certifications"}
                type={"text"}
                placeholder="Enter certification"
                defaultValue={
                  prevStep === 3
                    ? preValue.certifications
                    : previousValue.certifications
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} lg={6}>
            <FormGroup>
              <Label for="description" className="fw-semi-bold">
                Description<span style={{ color: "red" }}>* </span>
              </Label>
              <CKEditor
                name="description"
                id="description"
                maxLength={2000}
                initData={
                  prevStep === 3
                    ? preValue.description
                    : previousValue.description
                }
                onChange={(e) => {
                  setupDescriptionData(e.editor.getData());
                }}
                className={
                  descriptionValidation === true ? "ckeditor-invalid" : ""
                }
              />
            </FormGroup>
            {descriptionValidation === true && (
              <FormText color="danger">Please enter description</FormText>
            )}
          </Col>
          <Col md={6} lg={6}>
            <FormGroup>
              <Label for="companyDetails" className="fw-semi-bold">
                Company details
              </Label>
              <Input
                id={"companyDetails"}
                name={"companyDetails"}
                type={"textarea"}
                defaultValue={
                  prevStep === 3
                    ? preValue.companyDetail
                    : previousValue.companyDetail
                }
                placeholder="Enter company details"
                maxLength={1000}
                className={"textarea-height-custom"}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
        {successMessage === true && (
          <FormText
            color="success"
            className="d-flex align-items-center justify-content-center"
          >
            Basic information added successfully{" "}
          </FormText>
        )}
      </Form>
    </>
  );
}
