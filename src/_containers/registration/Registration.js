import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";
import AsyncSelect from "react-select/async";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import Slider from "react-slick";
import "./registration.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BsBriefcase, BsPeople, BsArrowLeft } from "react-icons/bs";
import SweetAlert from "react-bootstrap-sweetalert";
import bg1 from "../../assets/utils/images/login.png";
import validIcon from "../../assets/utils/images/valid-icon.svg";
import footerImg from "../../assets/utils/images/panther-logo.png";
import { messaging } from "../../firebase";
import { getPublicIP } from "_helpers/helper";
import "../static/terms.scss";

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
import { authActions } from "_store";
import logo from "../../assets/utils/images/panther-logo-2.png";
import { getLocationFilter } from "_store";
import { CustomerRegistration } from "./customerRegistration";
import { analytics } from "../../firebase/index";
import debounce from "lodash/debounce";
import { EmployerRegistration } from "./employerRegistration";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*#^?&(),./+=._-]{6,}$/;

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function Registration() {
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
  const dispatch = useDispatch();
  const [registrationType, setRegistrationType] = useState([
    {
      id: 1,
      name: "Candidate",
    },
    {
      id: 2,
      name: "Employer",
    },
  ]);

  const [countryValue, setCountryValue] = useState([]);
  const [cityValue, setCityValue] = useState(0);
  const { role } = useParams();
  const [selected, setSelected] = useState(role === 'hm' ? 2 : role ? 1 : 0);
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

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Registration page",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
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
    // password: Yup.string()
    //   .required("Password is required")
    //   .min(4, "Password must be at least 4 characters")
    //   .matches(
    //     passwordRegex,
    //     "Password must contain atleast 1 special character, 1 uppercase, 1 lowercase and 1 number"
    //   )
    //   .max(30, "Password can be at most 30 characters"),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("password"), null], "Passwords must match")
    //   .required("Confirm Password is required")
    //   .min(4, "Confirm Password must be at least 4 characters")
    //   .max(30, "Confirm Password can be at most 30 characters"),

    // cityid: Yup.string().required("City, State is required"),
    // stateid: Yup.string(),
    // countryid: Yup.string().required("Country is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue, getValues, reset } =
    useForm(formOptions);
  const { errors } = formState;
  const [cityList, setCityList] = useState([]);
  //new reg flow
  async function onSubmit1(payload) {
    validateOTP("phone", payload?.firstName ? false : true);
  }

  async function onSubmit(payload) {
    if (!validated.mobile || !validated.email) {
      showSweetAlert({
        title: "Please verify your email/phone to create account",
        type: "warning",
      });
      return;
    }
    let newPayload;
    newPayload = payload;
    newPayload.stateid = cityList?.find(
      (x) => x.cityid == newPayload.cityid
    )?.stateid;

    newPayload.phoneNumber = payload?.phoneNumber?.replace(/\D/g, "");
    let response = await dispatch(authActions.registerThunk(newPayload));
    if (!response.payload) {
      setMessage(response.error.message);
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
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
  const [otpDetails, setOTPDetails] = useState([]);

  const validateOTP = async function (check, showPopup = false) {
    let data;
    if (check === "phone") {
      data = getValues("phoneNumber").replace(/\D/g, "");
      if (data === "" || data.length < 10) {
        setMobileValidError(true);
        return;
      } else {
        setMobileValidError(false);
      }
    } else {
      data = getValues("email");

      if (data === "" || !emailRegex.test(data)) {
        setEmailValidError(true);
        return;
      } else {
        setEmailValidError(false);
      }
    }

    let userRegistrationId = otpDetails.userregistrationid;
    let post_data = {
      userregistrationid: 0,
      firstname: getValues("firstName"),
      lastname: getValues("lastName"),
      phonenumber: getValues("phoneNumber").replace(/\D/g, ""),
      email: getValues("email"),
      countryid: null,
      stateid: null,
      cityid: null,
      // phoneotp: null,
      // phoneotpgeneratedate: new Date().toISOString(),
      // isphonenumberverify: false,
      // emailotp: null,
      // emailotpgeneratedate: null,
      // isemailverify: false,
      isactive: true,
      currentuserid: 0,
      type: "phone",
      userroleid: 3,
      // password: "Temp@123",
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
        if (showPopup) {
          showSweetAlert({
            title: response.payload.message,
            type: "success",
          });
        }

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

  const showSweetAlert = ({ title, type, redirect = false }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    data.redirect = redirect;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    if (data.redirect) {
      loginWithOTP("phone");
    }
    data.redirect = false;
    SetShowAlert(data);
  };

  const loginWithOTP = async () => {
    let payload = {
      cityid: null,
      countryid: null,
      email: getValues("email"),
      firstname: getValues("firstName"),
      lastname: getValues("lastName"),
      phonenumber: getValues("phoneNumber").replace(/\D/g, ""),
      stateid: null,
    };
      let permission = "denied";
      try {
        if ('Notification' in window) {
          permission = await Notification?.requestPermission();
        }
      } catch (e) { console.log(e) }
    let data = await getPublicIP();
    if (data?.ip) {
      localStorage.setItem("publicip", data.ip);
    }
    if (permission === "granted") {
      // Generate Token
      const token = await messaging?.getToken({
        vapidKey:
          "BHjlQysiVHS7rlDZRZpJC1mD8g9I8zm7l0bDS2cOKZOHD1-s0nmcACoFXkHZtowJ3v3MFS_kTU94lfMBA8o111c",
      });
      payload.firebasetoken = token;
    } else if (permission === "denied") {
      console.log("You denied for the notification");
    }
    let response = await dispatch(authActions.candRegisterOTPThunk(payload));
    if (response.payload) {
      if (
        localStorage.getItem("referralLogdata") &&
        JSON.parse(localStorage.getItem("referralLogdata"))?.companyid
      ) {
        let logData = JSON.parse(localStorage.getItem("referralLogdata"));
        const userAgent = navigator.userAgent;
        let os = "Unknown OS";

        if (userAgent.indexOf("Win") != -1) os = "Windows";
        if (userAgent.indexOf("Mac") != -1) os = "MacOS";
        if (userAgent.indexOf("X11") != -1) os = "UNIX";
        if (userAgent.indexOf("Linux") != -1) os = "Linux";
        if (userAgent.indexOf("Android") != -1) os = "Android";
        if (userAgent.indexOf("like Mac") != -1) os = "iOS";
        let payload = {
          referralLogUrl: window.location.href,
          companyName: logData?.companyName,
          // companyid: 0,
          osversion: "string",
          ipaddress: localStorage.getItem("publicip")
            ? localStorage.getItem("publicip")
            : "Web",
          loginsource: "Web",
          logindeviceid: os,
          logindevice: os,
          currentUserId: localStorage.getItem("userId")
            ? Number(localStorage.getItem("userId"))
            : 0,
        };
        console.log(payload);
        dispatch(
          authActions.putCompanyReferralLogs({
            id: logData?.companyreferrallogid,
            payload,
          })
        );
        localStorage.removeItem("referralLogdata");
      }
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    } else {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    }
  };

  const verifyMobileOTPDetails = async function (data) {
    let new_data = { ...validated };
    let otp_new = data;
    if (otp_new.mobile !== "") {
      otpDetails.phoneotp = otp_new.mobile;
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
          redirect: true,
        });
        setOtpForm(false);
        setMessage("Phone number verified");
      } else {
        otp_new.mobile = "";
        setMessage(response.error.message);
        showSweetAlert({
          title: response.error.message,
          type: "error",
        });
      }

      setOtp(otp_new);
    }
  };

  const verifyEmailOTPDetails = async function (data) {
    let new_data = { ...validated };
    let otp_new = data;
    if (otp_new.email !== "") {
      new_data.email = true;
      otpDetails.phoneotp = null;
      otpDetails.emailotp = otp_new.email;

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
        setMessage(response.error.message);
        showSweetAlert({
          title: response.error.message,
          type: "error",
        });
      }
      setOtp(otp_new);
    }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirm(!showConfirm);
  };

  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );

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
      if (otp_new.mobile.length === 6) {
        verifyMobileOTPDetails(otp_new);
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
      if (otp_new.email.length === 6) {
        verifyEmailOTPDetails(otp_new);
      }
    }
  };

  const handlePaste = (e, check) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const pasted = pasteData.split("");
    if (check === "email") {
      let new_data = [...saveOTP];
      let otp_new = { ...otp };
      pasted.map((digit, i) => {
        new_data[i] = digit;
        document.getElementById(`email-${i}`).value = digit;
      });
      setSaveOTP(new_data);
      otp_new.email = new_data.join("");
      setOtp(otp_new);
      if (otp_new.email.length === 6) {
        verifyEmailOTPDetails(otp_new);
      }
    } else if (check === "mobile") {
      let new_data = [...saveOTP];
      let otp_new = { ...otp };
      pasted.map((digit, i) => {
        new_data[i] = digit;
        document.getElementById(`mobile-${i}`).value = digit;
      });
      setSaveOTP(new_data);
      otp_new.mobile = new_data.join("");
      setOtp(otp_new);
      if (otp_new.mobile.length === 6) {
        verifyMobileOTPDetails(otp_new);
      }
    }
  };
  const onHandleInputChange = (data) => {
    setCountryValue([]);
    reset({ resolver: yupResolver(validationSchema) });
    setSelected(data);
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
      <div className=" registration-container h-100">
        <Row className="h-100 g-0">
          <Col
            lg="8"
            md="12"
            className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center"
            style={{ overflow: "auto" }}
          >
            <Col
              lg="9"
              md="10"
              sm="12"
              className="mx-auto app-login-box me-2 ms-2"
            >
              <div className="" style={{ width: "200px", height: "80px" }}>
                <img
                  src={
                    localStorage.getItem("logo")
                      ? localStorage.getItem("logo")
                      : logo
                  }
                  alt="logo"
                  className="logo mb-2"
                  style={{
                    objectFit: "contain",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
              <Row className="login-divider" />
              <div className="app-logo mb-0" />
              <div className="title-text">Registration</div>
              <span className="title-content">
              Welcome, It only takes a few seconds to create your account
              </span>
              {selected === 0 && (
                <div className="mt-5 mb-3">
                  <Label className="input-label mb-4">
                    Please select your account type{" "}
                    <span className="text-danger">*</span>
                  </Label>
                  <Row className="g-2">
                    <Col md={6} lg={5} sm={12} xs={12} className="role-card-col">
                      <div
                        className={`role-selection-card ${
                          selected === 1 ? "role-card-selected" : ""
                        }`}
                        onClick={() => onHandleInputChange(1)}
                      >
                        <div className="role-card-header">
                          <div className="role-card-icon">
                            <BsBriefcase size={32} color="#038FFE" />
                          </div>
                          <h5 className="role-card-title">Candidate (Job Seeker)</h5>
                        </div>
                        <p className="role-card-description">
                          I am looking for a new job or opportunity.
                        </p>
                        {selected === 1 && (
                          <div className="role-card-checkmark">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="10" cy="10" r="10" fill="#28a745" />
                              <path
                                d="M6 10l3 3 5-5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={6} lg={5} sm={12} xs={12} className="role-card-col">
                      <div
                        className={`role-selection-card ${
                          selected === 2 ? "role-card-selected" : ""
                        }`}
                        onClick={() => onHandleInputChange(2)}
                      >
                        <div className="role-card-header">
                          <div className="role-card-icon">
                            <BsPeople size={32} color="#038FFE" />
                          </div>
                          <h5 className="role-card-title">
                            Hiring Manager (Company)
                          </h5>
                        </div>
                        <p className="role-card-description">
                          I want to post jobs and manage my team's hiring.
                        </p>
                        {selected === 2 && (
                          <div className="role-card-checkmark">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="10" cy="10" r="10" fill="#28a745" />
                              <path
                                d="M6 10l3 3 5-5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="pb-text"
                      style={{ color: "#052f5f", textDecoration: "none" }}
                    >
                      Already Registered?{" "}
                      <span style={{ textDecoration: "underline", color: "#038FFE" }}>
                        Login Here
                      </span>
                    </Link>
                  </div>
                </div>
              )}
              <div className="mt-5">
                {selected === 1 && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        Create your{" "}
                        <span style={{ color: "#052f5f" }}>
                          Candidate (Job Seeker)
                        </span>{" "}
                        Account
                      </h5>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onHandleInputChange(0);
                        }}
                        className="change-role-link"
                        style={{ color: "#038FFE", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <BsArrowLeft size={20} color="#038FFE" />
                        <span style={{ textDecoration: "underline", color: "#038FFE" }}>
                        Change Role</span>
                      </Link>
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit1)}>
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
                          <FormFeedback>
                            {errors.firstName?.message}
                          </FormFeedback>
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
                          <FormFeedback>
                            {errors.lastName?.message}
                          </FormFeedback>
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
                              onInput={(e) =>
                                handleFormData("email", e.target.value)
                              }
                              maxLength={50}
                              autoComplete="off"
                              disabled={validated.email}
                            />
                            {/* {!validated.email ? (
                              <Button
                                className="grp-btn"
                                color="light"
                                disabled={emailValidError}
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
                            )}{" "} */}
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
                              onInput={(e) =>
                                handleFormData("mobile", e.target.value)
                              }
                              disabled={validated.mobile}
                            />
                            {/* {!validated.mobile ? (
                              <Button
                                className="grp-btn"
                                color="light"
                                disabled={mobileValidError}
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
                            )}{" "} */}
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
                      {/* new updated flow */}
                      {/* <Col md={6}>
                        <FormGroup>
                          <Label for="password" className="input-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <InputGroup>
                            <input
                              placeholder="Enter Password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              id="password"
                              maxLength={30}
                              {...register("password")}
                              className={`form-control placeholder-name ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              autoComplete="new-password"
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
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <InputGroup>
                            <input
                              type={showConfirm ? "text" : "password"}
                              placeholder="Enter Confirm Password"
                              name="confirmPassword"
                              id="confirmPassword"
                              {...register("confirmPassword")}
                              className={`form-control placeholder-name ${
                                errors.confirmPassword ? "is-invalid" : ""
                              }`}
                              maxLength={30}
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
                      <Col>
                        <FormGroup>
                          <Label for="cityid" className="fw-semi-bold">
                            City, State <span className="text-danger">* </span>
                          </Label>
                          <AsyncSelect
                            name="cityid"
                            placeholder="Search to select"
                            placeholderText="search"
                            cacheOptions
                            loadOptions={loadOptionsDeb}
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
                      </Col> */}
                    </Row>
                    <div className="mt-4 d-flex align-items-center">
                      <h5 className="mb-0 account-text ms-auto me-4">
                        <Link
                          to="/login"
                          className="pb-text"
                          
                        >
                          {/* Already a member? Sign in */}
                          Already Registered?{" "}
                      <span style={{ textDecoration: "underline", color: "#038FFE" }}>
                        Login Here
                      </span>
                        </Link>
                      </h5>
                      <div>
                        <Button color="primary" className=" btn-text" size="lg">
                          Create account
                        </Button>
                      </div>
                    </div>
                  </Form>
                  </div>
                )}
                {/* {selected === 2 && <CustomerRegistration />} */}
                {selected === 2 && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        Create your{" "}
                        <span style={{ color: "#052f5f", fontSize:"1.1rem", fontWeight:"600" }}>
                          Hiring Manager
                        </span>{" "}
                        Account
                      </h5>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onHandleInputChange(0);
                        }}
                        className="change-role-link"
                        style={{ color: "#038FFE", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <BsArrowLeft size={20} color="#038FFE" />
                        <span style={{ textDecoration: "underline", color: "#038FFE" }}>
                        Change Role</span>
                      </Link>
                    </div>
                    <EmployerRegistration />
                  </div>
                )}
              </div>
              {selected === 2 ? "" : <br />}
              <br></br>
              <br></br>

              <footer className="footer--pin">
                <Row>
                  {/* <Col lg="2" md="2" sm="12"></Col> */}
                  <Col
                    xxl={{ order: 1, size: 3 }}
                    xl={{ order: 1, size: 3 }}
                    lg={{ order: 1, size: 3 }}
                    md={{ order: 1, size: 3 }}
                    sm={{ order: 1, size: 12 }}
                    xs={{ order: 1, size: 12 }}
                    className="text-start mt-1"
                  >
                    <span className="mt-2 pb-text">Powered by</span>
                    <img
                      src={footerImg}
                      className="logo ms-1"
                      width="135px"
                      alt="logo"
                    />
                  </Col>
                  <Col
                    xxl={{ order: 2, size: 4 }}
                    xl={{ order: 2, size: 4 }}
                    lg={{ order: 2, size: 4 }}
                    md={{ order: 1, size: 4 }}
                    sm={{ order: 1, size: 12 }}
                    xs={{ order: 1, size: 12 }}
                    className="text-end mt-1"
                  >
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      Privacy Policy
                    </a>
                    <span className="mx-2">|</span>
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      Terms & Conditions
                    </a>
                    <span className="mx-2">|</span>
                    <a
                      href="/support"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      Support
                    </a>
                    <span className="mx-2">|</span>
                    <a
                      href="/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      Contact Us
                    </a>
                    <span className="mx-2">|</span>
                    <a
                      href="/"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      Home
                    </a>
                  </Col>
                </Row>
              </footer>
            </Col>
          </Col>
          <Col lg="4" className="d-xs-none">
            <div className="slider-light">
              <Slider {...settings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                  <p className="m-5 slider-content"></p>
                  {/* <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + bg1 + ")",
                    }}
                  />
                  <div>
                    <h3 className="slider-title">Experts In Human Capital</h3>
                    <p className="m-5 slider-content">
                      What makes The OpenWorX community the ideal career
                      partner? We focus on what you want most from your career!
                    </p>
                  </div> */}
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
                <p className="otp-header-text">We sent you verification code</p>
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
                        onPaste={(e) => handlePaste(e, "mobile")}
                      />
                    </FormGroup>
                  ))}
                </div>
              </Form>
              <Row>
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    Don't received verification code?
                  </div>
                </Col>
              </Row>

              <Row className="mt-1">
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    {/* {timer > 0 ? (
                      <span style={{ marginLeft: "5px" }}>
                        Resend verification code in
                        <span className="otp-link-label"> {timer} </span>
                        seconds
                      </span>
                    ) : (
                      <a
                        href="#"
                        onClick={() => resendOTP("mobile")}
                        className="btn-lg btn btn-link otp-link-label"
                      >
                        Resend verification code
                      </a>
                    )} */}
                    <button
                      href="#"
                      onClick={() => {
                        onSubmit1(true);
                      }}
                      className="btn-lg btn btn-link otp-link-label"
                    >
                      Resend Code
                    </button>
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
                onClick={() => verifyMobileOTPDetails(otp)}
              >
                Verify
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
                <p className="otp-header-text">We sent you verification code</p>
              </div>

              <div className="font-size-md  fw-normal">
                Please, enter it below to verify your email
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
                        onPaste={(e) => handlePaste(e, "email")}
                      />
                    </FormGroup>
                  ))}
                </div>
              </Form>
              <Row>
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    Don't received verification code?
                  </div>
                </Col>
              </Row>

              <Row className="mt-1">
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    {timer > 0 ? (
                      <span style={{ marginLeft: "5px" }}>
                        Resend verification code in
                        <span className="otp-link-label"> {timer} </span>
                        seconds
                      </span>
                    ) : (
                      <a
                        href="#"
                        onClick={() => resendOTP("email")}
                        className="btn-lg btn btn-link otp-link-label"
                      >
                        Resend verification code
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
                onClick={() => verifyEmailOTPDetails(otp)}
              >
                Verify
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
