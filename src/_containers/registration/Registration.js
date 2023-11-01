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

import bg3 from "../../assets/utils/images/originals/citynights.jpg";
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
  CardHeader,
  FormText,
  CardFooter,
  Input,
} from "reactstrap";

import { history } from "_helpers";
import successIcon from "../../assets/utils/images/success_icon.svg";
import errorIcon from "../../assets/utils/images/error_icon.png";

import { authActions } from "_store";
import logo from "../../assets/utils/images/panther-logo.png";
import { getLocationFilter } from "_store";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export function Registration() {
  const [sliderSettings] = useState({
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
  });

  const otpLength = ["1", "2", "3", "4", "5", "6"];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x?.auth?.token);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
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

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    jobProfile: Yup.string()
      .required("Job profile is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid profile")
      .min(3, "Job profile must be at least 3 characters")
      .max(30, "Job profile must be at most 30 characters"),

    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .min(3, "First name must be at least 3 characters")
      .max(30, "First name must be at most 30 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .min(3, "Last name must be at least 3 characters")
      .max(30, "Last name must be at most 30 characters"),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please enter valid email"
      ),
    phoneNumber: Yup.string().required("Phone number is required"),
    // .matches(phoneRegExp, "Phone number is not valid"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password can be at most 30 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required")
      .min(4, "Confirm Password must be at least 4 characters")
      .max(30, "Confirm Password can be at most 30 characters"),

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

  async function onSubmit(payload) {
    if (!validated.mobile || !validated.email) {
      setError(true);
      setMessage("Please verify your email/mobile to create account");
      return;
    }

    let response = await dispatch(authActions.registerThunk(payload));
    if (!response.payload) {
      setMessage(response.error.message);

      setError(true);
    }
  }

  const [mobileValidError, setMobileValidError] = useState(false);
  const [emailValidError, setEmailValidError] = useState(false);

  const validateOTP = function (check) {
    console.log(validationSchema);
    if (check === "phone") {
      if (
        validationSchema.fields.phoneNumber.isValidSync(
          getValues("phoneNumber")
        )
      ) {
        setMobileValidError(false);
        setOtpForm(true);
      } else {
        setMobileValidError(true);
      }
    }
    if (check === "email") {
      if (validationSchema.fields.email.isValidSync(getValues("email"))) {
        setEmailValidError(false);
        setEmailForm(true);
      } else {
        setEmailValidError(true);
      }
    }
  };

  const verifyMobileOTPDetails = function () {
    let new_data = { ...validated };
    if (otp.mobile !== "") {
      new_data.mobile = true;
      setOtpForm(false);
    }
    setValidated(new_data);
    if (otp.mobile !== "" && otp.email !== "") {
      onSubmit(postData);
    }
  };

  const verifyEMailOTPDetails = function () {
    let new_data = { ...validated };
    if (otp.email !== "") {
      new_data.email = true;
      setEmailForm(false);
    }
    setValidated(new_data);
    if (otp.mobile !== "" && otp.email !== "") {
      onSubmit(postData);
    }
  };

  const setAsyncSelectValue = (data) => {
    debugger;
    console.log(errors);
    setValue("cityid", String(data.value));
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("stateid", state);
  };

  const onSelectCountryDropdown = (data) => {
    setValue("countryid", String(data.value));
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

  const handleInputChange = (check, e) => {
    let otp_new = { ...otp };
    if (check === "mobile") {
      otp_new.mobile += e;
      setOtp(otp_new);
    }
    if (check === "email") {
      otp_new.email += e;
      setOtp(otp_new);
    }
  };

  const handleFormData = function (check, data) {
    debugger;
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

  return (
    <>
      <div className=" registration-container h-100">
        <Row className="h-100 g-0">
          <Col
            lg="7"
            md="12"
            className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center"
          >
            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
              <div className="">
                <img src={logo} width={"130px"} alt="logo" className="logo" />
              </div>
              <div className="app-logo" />
              <h4>
                <div className="title-text">Welcome,</div>
                <span className="title-text">
                  It only takes a{" "}
                  <span className="title-text">few seconds</span> to create your
                  account
                </span>
              </h4>
              <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="firstName" className="input-label">
                          <span className="text-danger">*</span> Job Profile
                        </Label>
                        <input
                          type="text"
                          name="jobProfile"
                          id="jobProfile"
                          placeholder="Enter job profile"
                          {...register("jobProfile")}
                          className={`form-control placeholder-name ${
                            errors.jobProfile ? "is-invalid" : ""
                          }`}
                        />
                        <FormFeedback>
                          {errors.jobProfile?.message}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="firstName" className="input-label">
                          <span className="text-danger">*</span> First name
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
                        />
                        <FormFeedback>{errors.firstName?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lastName" className="input-label">
                          <span className="text-danger">*</span> Last name
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
                        />
                        <FormFeedback>{errors.lastName?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email" className="input-label">
                          <span className="text-danger">*</span> Email
                        </Label>
                        <InputGroup>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email id"
                            {...register("email")}
                            className={`form-control placeholder-name ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            onClick={(e) =>
                              handleFormData("email", e.target.value)
                            }
                            autoComplete="off"
                          />
                          {!validated.email ? (
                            <Button
                              className="grp-btn"
                              color="light"
                              onClick={() => validateOTP("email")}
                            >
                              Verify
                            </Button>
                          ) : (
                            <Button
                              className="grp-btn"
                              color="light"
                              style={{
                                cursor: validated.email
                                  ? "not-allowed"
                                  : "pointer",
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
                          <span className="text-danger">*</span> Phone number
                        </Label>

                        <InputGroup>
                          <InputMask
                            placeholder="Enter phone number"
                            type="text"
                            mask="(999)-999-9999"
                            name="phoneNumber"
                            id="phoneNumber"
                            {...register("phoneNumber")}
                            className={`form-control placeholder-name ${
                              errors.phoneNumber ? "is-invalid" : ""
                            }`}
                            onInput={(e) =>
                              handleFormData("mobile", e.target.value)
                            }
                          />
                          {!validated.mobile ? (
                            <Button
                              className="grp-btn"
                              color="light"
                              onClick={() => validateOTP("phone")}
                            >
                              Verify
                            </Button>
                          ) : (
                            <Button
                              className="grp-btn"
                              color="light"
                              style={{
                                cursor: validated.email
                                  ? "not-allowed"
                                  : "pointer",
                                border: "1px solid #ced4da",
                              }}
                              disabled={validated.mobile}
                            >
                              <img src={validIcon} alt="valid-icon" />
                            </Button>
                          )}{" "}
                          <FormFeedback>
                            {errors.phoneNumber?.message}
                          </FormFeedback>
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
                          <span className="text-danger">*</span> Password
                        </Label>
                        <InputGroup>
                          <input
                            placeholder="Enter password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            {...register("password")}
                            className={`form-control placeholder-name ${
                              errors.password ? "is-invalid" : ""
                            }`}
                          />
                          <InputGroupText
                            onClick={(evt) => togglePasswordVisibility()}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                          <FormFeedback>
                            {errors.password?.message}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="confirmPassword" className="input-label">
                          <span className="text-danger">*</span> Confirm
                          Password
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
                          />
                          <InputGroupText
                            onClick={(evt) => toggleConfirmPassword()}
                          >
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                          <FormFeedback>
                            {errors.confirmPassword?.message}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <FormGroup>
                        <Label for="city" className="fw-semi-bold">
                          City, State <span className="required-icon">*</span>
                        </Label>
                        <AsyncSelect
                          name="city"
                          placeholder="Search to select"
                          placeholderText="search"
                          loadOptions={loadOptions}
                          isMulti={false}
                          className={`placeholder-name ${
                            errors.cityid
                              ? "async-border-red"
                              : "async-no-error"
                          }`}
                          {...register("cityid")}
                          onChange={(e) => setAsyncSelectValue(e)}
                        />
                        <div className="async-error-text">
                          {errors.cityid?.message}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="country" className="fw-semi-bold">
                          Country <span className="required-icon">*</span>
                        </Label>
                        <AsyncSelect
                          name="country"
                          placeholder="Select country"
                          placeholderText="search"
                          isMulti={false}
                          className={`placeholder-name ${
                            errors.countryid ? "async-border-red" : ""
                          }`}
                          {...register("countryid")}
                          defaultOptions={countryList}
                          onChange={(e) => onSelectCountryDropdown(e)}
                          onMenuOpen={() => checkCityValid()}
                        />
                        <div className="async-error-text">
                          {errors.countryid?.message}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex align-items-center">
                    <h5 className="mb-0 account-text">
                      Already have an account? <Link to="/login">Sign in</Link>
                    </h5>
                    <div className="ms-auto">
                      <Button color="primary" className=" btn-text" size="lg">
                        Create Account
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Col>
          <Col lg="5" className="d-xs-none">
            <div className="slider-light">
              <Slider {...sliderSettings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                  <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + bg3 + ")",
                    }}
                  />
                  <div className="slider-content">
                    <h3>Scalable, Modular, Consistent</h3>
                    <p>
                      Easily exclude the components you don't require.
                      Lightweight, consistent Bootstrap based styles across all
                      elements and components
                    </p>
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
        </Row>
      </div>

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
                  {otpLength?.map((item) => (
                    <FormGroup className="m-2">
                      <Input
                        type="text"
                        name="otp"
                        id="otp"
                        maxLength="1"
                        style={{ fontSize: "24px" }}
                        className="form-control placeholder-name text-center"
                        onInput={(e) =>
                          handleInputChange("mobile", e.target.value)
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
                        onClick={() => setTimer(30)}
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
                  {otpLength?.map((item) => (
                    <FormGroup className="m-2">
                      <Input
                        type="text"
                        name="otp"
                        id="otp"
                        maxLength="1"
                        style={{ fontSize: "24px" }}
                        className="form-control placeholder-name text-center"
                        onInput={(e) =>
                          handleInputChange("email", e.target.value)
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
                        onClick={() => setTimer(30)}
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
                onClick={() => verifyEMailOTPDetails()}
              >
                Verify OTP
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={error}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 mb-3 d-flex justify-content-center rejected-success-text">
              {message}
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setError(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

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
