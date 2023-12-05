import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";
import AsyncSelect from "react-select/async";

import Slider from "react-slick";
import "./registration.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SweetAlert from "react-bootstrap-sweetalert";
import bg1 from "../../assets/utils/images/login.png";
import validIcon from "../../assets/utils/images/valid-icon.svg";

import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Modal,
  Card,
  CardBody,
  InputGroup,
  InputGroupText,
  CardFooter,
  Input,
} from "reactstrap";

import { history } from "_helpers";
import errorIcon from "../../assets/utils/images/error_icon.png";
import { authActions, dropdownActions, addCustomerActions } from "_store";
import logo from "../../assets/utils/images/panther-logo.png";
import { getLocationFilter } from "_store";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*#^?&(),./+=._-]{6,}$/;

export function CustomerRegistration() {
  const dispatch = useDispatch();
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    initialSlide: 0,
    autoplay: true,
    adaptiveHeight: true,
  };

  useEffect(() => {
    dispatch(dropdownActions.getCompanyListPublicThunk());
  }, []);

  const companyDropdown = useSelector((state) => state.dropdown.companyList);

  const otpLength = ["1", "2", "3", "4", "5", "6"];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const authUser = useSelector((x) => x?.auth?.token);
  const [message, setMessage] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [cityReqError, setCityReqError] = useState(false);
  const [otp, setOtp] = useState({
    mobile: "",
    email: "",
  });
  const [validated, setValidated] = useState({
    mobile: false,
    email: false,
  });
  const [timer, setTimer] = useState(0);
  const [showOtpForm, setOtpForm] = useState(false);
  const [showEmailOtp, setEmailForm] = useState(false);
  const [companyValue, setCompanyValue] = useState(1);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    companyid: Yup.string().required("Company is required"),
    jobprofile: Yup.string()
      .required("Prefix is required")
      .min(2, "Please enter minimum 2 characters")
      .matches(/^[A-Za-z ]*$/, "Please enter valid profile"),

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
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters")
      .matches(
        passwordRegex,
        "Password must contain atleast 1 special character, 1 uppercase, 1 lowercase and 1 number"
      )
      .max(30, "Password can be at most 30 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required")
      .min(4, "Confirm password must be at least 4 characters")
      .max(30, "Confirm password can be at most 30 characters"),

    cityid: Yup.string().required("City, State is required"),
    stateid: Yup.string(),
    countryid: Yup.string().required("Country is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;
  const [cityList, setCityList] = useState([]);
  const [postData, setPostData] = useState({});

  async function onSubmit(formData) {
    if (!validated.mobile || !validated.email) {
      showSweetAlert({
        title: "Please verify your email/mobile to create account",
        type: "warning",
      });
      return;
    }
    let payload = {
      customerid: 0,
      companyid: parseInt(formData.companyid),
      userid: 0,
      userroleid: 2,
      title: formData.jobprofile,
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      phonenumber: formData.phoneNumber,
      address: "",
      zipcode: "",
      cityid: Number(formData.cityid),
      stateid: Number(formData.stateid),
      countryid: 1,
      isactive: true,
      customerstatusid: 0,
      currentUserId: 0,
    };

    let response = await dispatch(authActions.registerCustomer(payload));
    if (!response.payload) {
      setMessage(response.error.message);

      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    } else {
      history.navigate("/registration-success");
    }
  }

  const [mobileValidError, setMobileValidError] = useState(false);
  const [emailValidError, setEmailValidError] = useState(false);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [field, setField] = useState(false);
  const [otpDetails, setOTPDetails] = useState([]);

  const validateOTP = async function (check) {
    let formDetails = getValues();
    let data = { ...field };
    data = "";

    if (companyValue === 0) {
      data = "company";
    }

    if (
      formDetails.jobprofile === "" ||
      !validationSchema.fields.jobprofile.isValidSync(getValues("jobprofile"))
    ) {
      data = data !== "" ? data + ", title" : "title";
    }
    if (
      formDetails.firstName === "" ||
      !validationSchema.fields.firstName.isValidSync(getValues("firstName"))
    ) {
      data = data !== "" ? data + ", first name" : "first name";
    }
    if (
      formDetails.lastName === "" ||
      !validationSchema.fields.lastName.isValidSync(getValues("lastName"))
    ) {
      data = data !== "" ? data + ", last name" : "last name";
    }
    if (
      formDetails.email === "" ||
      !validationSchema.fields.email.isValidSync(getValues("email"))
    ) {
      data = data !== "" ? data + ", email" : "email";
    }
    if (
      formDetails.phoneNumber === "" ||
      !validationSchema.fields.phoneNumber.isValidSync(getValues("phoneNumber"))
    ) {
      data = data !== "" ? data + ", phone number" : "phone number";
    }
    if (cityValue === 0) {
      data = data !== "" ? data + ", city, state" : "city, state";
    }
    if (countryValue === 0) {
      data = data !== "" ? data + ", country" : "country";
    }

    if (data !== "") {
      setField(data);

      showSweetAlert({
        title: "Please enter valid " + data + " to verify email/phone",
        type: "warning",
      });

      return;
    }
    let userRegistrationId = otpDetails.userregistrationid;
    let post_data = {
      userregistrationid: 0,
      firstname: getValues("firstName"),
      lastname: getValues("lastName"),
      phonenumber: getValues("phoneNumber").replace(/\D/g, ""),
      email: getValues("email"),
      countryid: countryValue,
      stateid: parseInt(getValues("stateid")),
      cityid: cityValue,
      phoneotp: null,
      phoneotpgeneratedate: new Date().toISOString(),
      isphonenumberverify: false,
      emailotp: null,
      emailotpgeneratedate: null,
      isemailverify: false,
      isactive: true,
      currentuserid: 0,
      type: "phone",
    };
    let response;
    if (check === "phone") {
      if (!validated.email) {
        response = await dispatch(authActions.userRegisterThunk(post_data));
      } else {
        post_data.isemailverify = true;
        post_data.userregistrationid = otpDetails.userregistrationid;
        response = await dispatch(
          authActions.userRegisterThunkNew({ userRegistrationId, post_data })
        );
      }

      if (response?.payload) {
        setOTPDetails(response.payload.data);
        setOtpForm(true);
      } else {
        setMessage(response?.error?.message);
        showSweetAlert({
          title: response?.error?.message,
          type: "warning",
        });
        setOtpForm(false);
      }
    }
    if (check === "email") {
      post_data.type = "email";
      post_data.emailotpgeneratedate = new Date().toISOString();
      post_data.phoneotpgeneratedate = null;
      post_data.isemailverify = false;
      post_data.isphonenumberverify = false;

      if (!validated.mobile) {
        response = await dispatch(authActions.userRegisterThunk(post_data));
      } else {
        post_data.isphonenumberverify = true;
        post_data.userregistrationid = otpDetails.userregistrationid;
        response = await dispatch(
          authActions.userRegisterThunkNew({ userRegistrationId, post_data })
        );
      }

      if (response?.payload) {
        setOTPDetails(response.payload.data);
        setEmailForm(true);
      } else {
        setMessage(response?.error?.message);
        showSweetAlert({
          title: response?.error?.message,
          type: "warning",
        });
        setOtpForm(false);
      }
    }
  };

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

  const verifyMobileOTPDetails = async function () {
    let new_data = { ...validated };
    let otp_new = { ...otp };
    if (otp.mobile !== "") {
      otpDetails.phoneotp = otp.mobile;
      otpDetails.emailotp = null;
      let userRegistrationId = otpDetails.userregistrationid;

      let response = await dispatch(
        authActions.verifyOTPThunk({ userRegistrationId, otpDetails })
      );
      if (response.payload) {
        setSaveOTP([]);
        new_data.mobile = true;
        setValidated(new_data);
        showSweetAlert({
          title: response.payload.message,
          type: "success",
        });
        setOtpForm(false);
        setMessage("Phone number verified");
      } else {
        otp_new.mobile = "";
        setMessage("Something went wrong");
        showSweetAlert({
          title: "Something went wrong, please try later!!",
          type: "error",
        });
      }

      setOtp(otp_new);
    }
  };

  const verifyEmailOTPDetails = async function () {
    let new_data = { ...validated };
    let otp_new = { ...otp };
    if (otp.email !== "") {
      new_data.email = true;
      otpDetails.phoneotp = null;
      otpDetails.emailotp = otp.email;

      let userRegistrationId = otpDetails.userregistrationid;

      let response = await dispatch(
        authActions.verifyOTPThunk({ userRegistrationId, otpDetails })
      );
      if (response.payload) {
        new_data.email = true;
        setValidated(new_data);
        setSaveOTP([]);
        showSweetAlert({
          title: response.payload.message,
          type: "success",
        });
        setEmailForm(false);
        setMessage("Email verified");
      } else {
        otp_new.email = "";
        setMessage("Something went wrong");
        showSweetAlert({
          title: "Something went wrong, please try later!!",
          type: "error",
        });
      }
      setOtp(otp_new);
    }
  };

  const [countryValue, setCountryValue] = useState(0);
  const [cityValue, setCityValue] = useState(0);

  const setAsyncSelectValue = (data) => {
    setValue("cityid", String(data.value));
    setCityValue(data.value);
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("stateid", state);
  };

  const onSelectCountryDropdown = (data) => {
    setCountryValue(data.value);
    setValue("countryid", String(data.value));
  };

  const onSelectCompanyDropdown = (data) => {
    setCompanyValue(data);
    setValue("companyid", String(data));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirm(!showConfirm);
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

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const [saveOTP, setSaveOTP] = useState([]);

  const handleInputChange = (check, e, index) => {
    let new_data = [...saveOTP];
    let otp_new = { ...otp };
    if (check === "mobile") {
      new_data[index] = e;

      setSaveOTP(new_data);
      otp_new.mobile = new_data.join("");
      setOtp(otp_new);
      if (e !== "") {
        // Automatically focus on the next input field
        const nextInput = document.getElementById(`mobile-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
      if (e === "") {
        const prevInput = document.getElementById(`mobile-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
    if (check === "email") {
      new_data[index] = e;

      setSaveOTP(new_data);
      otp_new.email = new_data.join("");
      setOtp(otp_new);

      if (e !== "") {
        // Automatically focus on the next input field
        const nextInput = document.getElementById(`email-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
      if (e === "") {
        const prevInput = document.getElementById(`email-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handleFormData = function (check, data) {
    console.log(getValues("email"));
    if (check === "mobile") {
      if (validationSchema.fields.phoneNumber.isValidSync(data)) {
        setMobileValidError(false);
      } else {
        setMobileValidError(true);
      }
    }

    if (check === "email") {
      if (validationSchema.fields.email.isValidSync(data)) {
        setEmailValidError(false);
      } else {
        setEmailValidError(true);
      }
    }
  };

  const resendOTP = function (check) {
    setTimer(60);

    if (check === "mobile") {
      validateOTP("phone");
    }
    if (check === "email") {
      validateOTP("email");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="companyid" className="input-label">
                Company <span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                name="companyid"
                {...register("companyid")}
                className={`form-control placeholder-name ${
                  errors.companyid && companyValue === 0 ? "is-invalid" : ""
                }`}
                onChange={(e) => onSelectCompanyDropdown(e.target.value)}
              >
                <option value={0}>Select company</option>
                {companyDropdown?.length > 0 &&
                  companyDropdown?.map((options) => (
                    <option key={options.companyid} value={options.companyid}>
                      {" "}
                      {options.companyname}{" "}
                    </option>
                  ))}
              </Input>
              <FormFeedback>
                {errors.companyid && companyValue === 0?.message}
              </FormFeedback>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label for="jobprofile" className="input-label">
                Prefix <span className="text-danger">*</span>
              </Label>
              <input
                type="text"
                name="jobprofile"
                id="jobprofile"
                placeholder="Enter prefix"
                {...register("jobprofile")}
                className={`form-control placeholder-name ${
                  errors.jobprofile ? "is-invalid" : ""
                }`}
                maxLength={5}
              />
              <FormFeedback>{errors.jobprofile?.message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="firstName" className="input-label">
                First name <span className="text-danger">*</span>
              </Label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
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
                Last name <span className="text-danger">*</span>
              </Label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter last name"
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
                  disabled={validated.email}
                  placeholder="Enter email id"
                  {...register("email")}
                  className={`form-control placeholder-name ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  onClick={(e) => handleFormData("email", e.target.value)}
                  autoComplete="off"
                  maxLength={70}
                />
                {!validated.email ? (
                  <Button
                    className="grp-btn"
                    color="light"
                    onClick={() => validateOTP("email", errors)}
                  >
                    Verify
                  </Button>
                ) : (
                  <Button
                    className="grp-btn"
                    color="light"
                    style={{
                      cursor: validated.email ? "not-allowed" : "pointer",
                      border: "1px solid #ced4da",
                    }}
                    disabled={validated.email}
                  >
                    <img src={validIcon} alt="valid-icon" />
                  </Button>
                )}{" "}
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
                  placeholder="Enter phone number"
                  type="text"
                  mask="(999)-999-9999"
                  name="phoneNumber"
                  id="phoneNumber"
                  disabled={validated.mobile}
                  {...register("phoneNumber")}
                  className={`form-control placeholder-name ${
                    errors.phoneNumber ? "is-invalid" : ""
                  }`}
                  maxLength={20}
                  onInput={(e) => handleFormData("mobile", e.target.value)}
                />
                {!validated.mobile ? (
                  <Button
                    className="grp-btn"
                    color="light"
                    onClick={() => validateOTP("phone", errors)}
                  >
                    Verify
                  </Button>
                ) : (
                  <Button
                    className="grp-btn"
                    color="light"
                    style={{
                      cursor: validated.email ? "not-allowed" : "pointer",
                      border: "1px solid #ced4da",
                    }}
                    disabled={validated.mobile}
                  >
                    <img src={validIcon} alt="valid-icon" />
                  </Button>
                )}{" "}
                <FormFeedback>{errors.phoneNumber?.message}</FormFeedback>
              </InputGroup>
              <div className="async-error-text">
                {mobileValidError && !errors.phoneNumber
                  ? "Please enter valid phone number to verify"
                  : ""}
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="password" className="input-label">
                Password <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <input
                  placeholder="Enter password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  maxLength={30}
                  {...register("password")}
                  className={`form-control placeholder-name ${
                    errors.password ? "is-invalid" : ""
                  }`}
                />
                <InputGroupText onClick={(evt) => togglePasswordVisibility()}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroupText>
                <FormFeedback>{errors.password?.message}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="confirmPassword" className="input-label">
                Confirm password <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Enter confirm password"
                  name="confirmPassword"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className={`form-control placeholder-name ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  maxLength={30}
                />
                <InputGroupText onClick={(evt) => toggleConfirmPassword()}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </InputGroupText>
                <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                City, State <span className="text-danger">* </span>
              </Label>
              <AsyncSelect
                name="city"
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
          <Col>
            <FormGroup>
              <Label for="country" className="fw-semi-bold">
                Country <span className="text-danger">* </span>
              </Label>
              <AsyncSelect
                name="country"
                placeholder="Select country"
                placeholderText="search"
                isMulti={false}
                className={`placeholder-name ${
                  errors.countryid && countryValue === 0
                    ? "async-border-red"
                    : ""
                }`}
                {...register("countryid")}
                defaultOptions={countryList}
                onChange={(e) => onSelectCountryDropdown(e)}
                onMenuOpen={() => checkCityValid()}
              />
              <div className="async-error-text">
                {errors.countryid && countryValue === 0
                  ? "Country is required"
                  : ""}
              </div>
            </FormGroup>
          </Col>
        </Row>

        <div className="mt-4 d-flex align-items-center">
          <h5 className="mb-0 account-text ms-auto me-4">
            <Link to="/login" style={{ borderBottom: "1px solid #545cd8" }}>
              Already a member? Sign in
            </Link>
          </h5>
          <div>
            <Button color="primary" className=" btn-text" size="lg">
              Register
            </Button>
          </div>
        </div>
      </Form>

      <Modal
        className="modal-reject-align registration-container"
        size="md"
        isOpen={showOtpForm}
      >
        <Card>
          <CardBody>
            <div className="justify-content-center align-items-center text-center mb-4">
              <div className="font-size-lg fw-normal">
                <p className="otp-header-text">We sent you OTP</p>
              </div>

              <div className="font-size-md  fw-normal">
                Please, enter it below to verify your phone
              </div>
              <div style={{ color: "#545cd8" }}>{getValues("phoneNumber")}</div>
            </div>

            <div>
              <Form>
                <div className="d-flex justify-content-center align-items-center">
                  {otpLength?.map((item, index) => (
                    <FormGroup className="m-2">
                      <Input
                        type="text"
                        name="otp"
                        id={`mobile-${index}`}
                        maxLength="1"
                        style={{ fontSize: "24px" }}
                        className="form-control placeholder-name text-center"
                        onInput={(e) =>
                          handleInputChange("mobile", e.target.value, index)
                        }
                      />
                    </FormGroup>
                  ))}
                </div>
              </Form>
              <Row>
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    Don't received OTP?
                    {timer > 0 ? (
                      <span style={{ marginLeft: "5px" }}>
                        Resend OTP in
                        <span className="otp-link-label"> {timer} </span>
                        seconds
                      </span>
                    ) : (
                      <a
                        href="javascript:void(0)"
                        onClick={() => resendOTP("mobile")}
                        className="btn-lg btn btn-link otp-link-label"
                      >
                        Resend otp
                      </a>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
          <CardFooter>
            <div className="me-auto ms-auto justify-content-center align-items-center">
              <Button
                color="secondary"
                className="btn"
                onClick={() => setOtpForm(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="m-2"
                style={{ background: "#2f479b" }}
                onClick={() => verifyMobileOTPDetails()}
              >
                Verify OTP
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Modal>

      <Modal
        className="modal-reject-align registration-container"
        size="md"
        isOpen={showEmailOtp}
      >
        <Card>
          <CardBody>
            <div className="justify-content-center align-items-center text-center mb-4">
              <div className="font-size-lg fw-semi-bold">
                <p className="otp-header-text">We sent you OTP</p>
              </div>

              <div className="font-size-md  fw-normal">
                Please, enter it below to verify your phone
              </div>
              <div style={{ color: "#545cd8" }}>{getValues("email")}</div>
            </div>

            <div>
              <Form>
                <div className="d-flex justify-content-center align-items-center">
                  {otpLength?.map((item, index) => (
                    <FormGroup className="m-2">
                      <Input
                        type="text"
                        name="otp"
                        id={`email-${index}`}
                        maxLength="1"
                        style={{ fontSize: "24px" }}
                        className="form-control placeholder-name text-center"
                        onInput={(e) =>
                          handleInputChange("email", e.target.value, index)
                        }
                      />
                    </FormGroup>
                  ))}
                </div>
              </Form>
              <Row>
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    Don't received OTP?
                    {timer > 0 ? (
                      <span style={{ marginLeft: "5px" }}>
                        Resend OTP in
                        <span className="otp-link-label"> {timer} </span>
                        seconds
                      </span>
                    ) : (
                      <a
                        href="javascript:void(0)"
                        onClick={() => resendOTP("email")}
                        className="btn-lg btn btn-link otp-link-label"
                      >
                        Resend otp
                      </a>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
          <CardFooter>
            <div className="me-auto ms-auto justify-content-center align-items-center">
              <Button
                color="secondary"
                className="btn"
                onClick={() => setEmailForm(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="m-2"
                style={{ background: "#2f479b" }}
                onClick={() => verifyEmailOTPDetails()}
              >
                Verify OTP
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Modal>

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

      <Modal className="modal-reject-align profile-view" isOpen={cityReqError}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Please select City, State to filter
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Country
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setCityReqError(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}
