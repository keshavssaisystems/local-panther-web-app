import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Button,
  ModalHeader,
  FormGroup,
  Label,
  Form,
  FormFeedback,
  InputGroup,
} from "reactstrap";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMask from "react-input-mask";
import AsyncSelect from "react-select/async";
import SweetAlert from "react-bootstrap-sweetalert";
import { getLocationFilter, authActions } from "_store";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { adminListingActions } from "_store";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const NewCandidateModal = (props) => {
  const dispatch = useDispatch();
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [countryValue, setCountryValue] = useState([]);
  const [cityValue, setCityValue] = useState(0);
  const [countryList, setCountryList] = useState([]);
  const [cityReqError, setCityReqError] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [mobileValidError, setMobileValidError] = useState(false);
  const [emailValidError, setEmailValidError] = useState(false);
  const [authToWork, setAuthToWork] = useState(true);
  const [btnType, setBtnType] = useState("");
  useEffect(() => {
    let country_response;
    country_response = cityList.map(({ countryid: value, ...rest }) => {
      return {
        value,
        label: `${rest.countryname}`,
      };
    });

    let data = [];
    if (country_response.length > 0) {
      data = Array.from(new Set(country_response.map((item) => item.id))).map(
        (id) => {
          return country_response.find((item) => item.id === id);
        }
      );
      setCountryList(data);
    } else {
      setCountryList(data);
    }
  }, [cityList]);

  const checkCityValid = function () {
    if (cityList?.length === 0) {
      setCityReqError(true);
    } else {
      setCityReqError(false);
    }
  };
  const validationSchema = Yup.object().shape({
    // jobprofile: Yup.string()
    //   .required("Job profile is required")
    //   .matches(/^[A-Za-z ]*$/, "Please enter valid profile")
    //   .min(3, "Job profile must be at least 3 characters"),

    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please enter valid email"
      ),
    phoneNumber: Yup.string().required("Phone number is required"),

    cityid: Yup.string().required("City, State is required"),
    stateid: Yup.string(),
    countryid: Yup.string().required("Country is required"),
    authorize: Yup.string(),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  };
  const { register, handleSubmit, formState, setValue, getValues, reset } =
    useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(payload, e) {
    let data = {
      candidateid: 0,
      firstname: payload.firstName,
      lastname: payload.lastName,
      dob: null,
      email: payload.email,
      phonenumber: payload.phoneNumber.replace(/\D/g, ""),
      address: "",
      pronounid: 0,
      genderid: 0,
      cityid: payload.cityid,
      stateid: payload.stateid,
      countryid: payload.countryid,
      zipcode: "",
      jobprofile: "",
      availabilitytowork: "",
      ethnicityid: 0,
      employmenteligiblity: payload.authorize ? 1 : 0,
      isreadytoworkimmediately: true,
      isexcludemycurrentemployer: true,
      isactive: true,
      userid: 0,
      currentUserId: localStorage.getItem("userId")
        ? localStorage.getItem("userId")
        : 0,
    };
    let res = await dispatch(adminListingActions.admAddCandidate(data));
    if (res?.payload?.statusCode === 201) {
      showSweetAlert({
        title: res?.payload?.message
          ? res.payload.message
          : "Candidate Added successfully.",
        type: "success",
      });
      let res1 = await dispatch(
        authActions.postAddAuditLogs({
          useractivityid: 0,
          userid: localStorage.getItem("userId")
            ? localStorage.getItem("userId")
            : 0,
          datasource: "add candidate",
          ipaddress: localStorage.getItem("publicip")
            ? localStorage.getItem("publicip")
            : "Web",
          resource: "admin",
          functionname: "addCandidate",
          pagename: "candidateRegistration",
          createddate: new Date().toISOString(),
        })
      );
      if (btnType === "2") {
        props.onSaveCloseNext(res.payload.data.candidateid);
      } else {
        props.onSaveClose();
      }
    } else {
      showSweetAlert({
        title: res?.error?.message
          ? res?.error?.message
          : "Error while adding Candidate",
        type: "error",
      });
    }
  }
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const setAsyncSelectValue = (data) => {
    setValue("cityid", String(data.value));
    setCityValue(data.value);
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("stateid", state);
    setCountryValue([{ value: 1, label: "USA" }]);
    setValue("countryid", String(1));
  };

  const onSelectCountryDropdown = (data) => {
    setCountryValue([{ value: 1, label: "USA" }]);
    setValue("countryid", String(1));
  };

  const loadOptions = async function (inputValue) {
    const { data = [] } = await getLocationFilter(inputValue);
    setCityList(data);

    let filter_data = data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location + ", " + rest.statename}`,
      };
    });

    return filter_data;
  };

  const handleFormData = function (check, data) {
    if (check === "mobile") {
      if (data.replace(/\D/g, "").length <= 10) {
        if (data !== "" && data.replace(/\D/g, "").length === 10) {
          setMobileValidError(false);
        } else {
          setMobileValidError(true);
        }
      }
    }
    if (check === "email") {
      if (data !== "" && emailRegex.test(data)) {
        setEmailValidError(false);
      } else {
        setEmailValidError(true);
      }
    }
  };

  return (
    <Modal
      size="xl"
      //   toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      className="payment-cont"
      fade={true}
    >
      <ModalHeader toggle={() => props.onClose()}>
        Candidate Registration
      </ModalHeader>
      <ModalBody style={{ maxHeight: "80vh", overflow: "auto" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="firstName" className="input-label">
                  First Name <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter First Name"
                  {...register("firstName")}
                  className={`form-control placeholder-name ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                  maxLength={50}
                />
                <FormFeedback>{errors.firstName?.message}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="lastName" className="input-label">
                  Last Name <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter Last Name"
                  {...register("lastName")}
                  className={`form-control placeholder-name ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                  maxLength={50}
                />
                <FormFeedback>{errors.lastName?.message}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email" className="input-label">
                  Email <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    {...register("email")}
                    className={`form-control placeholder-name ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    onInput={(e) => handleFormData("email", e.target.value)}
                    maxLength={50}
                    autoComplete="off"
                  />

                  <FormFeedback>{errors.email?.message}</FormFeedback>
                </InputGroup>

                <div className="async-error-text">
                  {!errors.email && emailValidError
                    ? "Please enter valid email to verify"
                    : ""}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phoneNumber" className="input-label">
                  Phone <span className="text-danger">*</span>
                </Label>

                <InputGroup>
                  <InputMask
                    placeholder="Enter Phone Number"
                    type="text"
                    mask="(999)-999-9999"
                    name="phoneNumber"
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    className={`form-control placeholder-name ${
                      errors.phoneNumber ? "is-invalid" : ""
                    }`}
                    onInput={(e) => handleFormData("mobile", e.target.value)}
                  />

                  <FormFeedback>{errors.phoneNumber?.message}</FormFeedback>
                </InputGroup>
                <div className="async-error-text">
                  {mobileValidError && !errors.phoneNumber
                    ? "Please enter valid phone number to verify"
                    : ""}
                </div>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="cityid" className="fw-semi-bold">
                  City, State <span className="text-danger">* </span>
                </Label>
                <AsyncSelect
                  name="cityid"
                  placeholder="Search to select"
                  placeholderText="search"
                  loadOptions={loadOptions}
                  isMulti={false}
                  className={`placeholder-name ${
                    errors.cityid && cityValue === 0
                      ? "async-border-red"
                      : "async-no-error"
                  }`}
                  {...register("cityid")}
                  onChange={(e) => setAsyncSelectValue(e)}
                />
                <div className="async-error-text">
                  {errors.cityid && cityValue === 0
                    ? "City, State is required"
                    : ""}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="country" className="fw-semi-bold">
                  Country <span className="text-danger">* </span>
                </Label>
                <AsyncSelect
                  name="country"
                  placeholder="Select Country"
                  placeholderText="search"
                  isMulti={false}
                  className={`placeholder-name ${
                    errors.countryid && countryValue?.length === 0
                      ? "async-border-red"
                      : ""
                  }`}
                  {...register("countryid")}
                  value={countryValue}
                  defaultOptions={countryList}
                  onChange={(e) => onSelectCountryDropdown(e)}
                  onMenuOpen={() => checkCityValid()}
                />
                <div className="async-error-text">
                  {errors.countryid && countryValue?.length === 0
                    ? "Country is required"
                    : ""}
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="authorize" check>
                  <input
                    name="authorize"
                    {...register("authorize")}
                    type="checkbox"
                    checked={authToWork}
                    onChange={(e) => setAuthToWork(e.checked)}
                  />{" "}
                  Authorized to work in United States
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <hr style={{ margin: "0.25rem" }}></hr>
          <div className="mt-3 d-flex align-items-center float-end">
            <div>
              <Button
                type="submit"
                onClick={() => setBtnType("1")}
                color="primary"
                id="btn1"
                style={{ marginRight: "0.5rem" }}
              >
                Save
              </Button>
              <Button
                type="submit"
                onClick={() => setBtnType("2")}
                color="primary"
                id="btn2"
                style={{ marginRight: "0.5rem" }}
              >
                Save & Continue
              </Button>
              {/* <Button
                type="submit"
                color="secondary"
                onClick={() => props.onClose()}
              >
                Close
              </Button> */}
            </div>
          </div>
        </Form>
      </ModalBody>

      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
    </Modal>
  );
};
