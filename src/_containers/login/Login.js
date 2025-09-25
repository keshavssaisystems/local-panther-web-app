import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  Card,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupText,
} from "reactstrap";

import Slider from "react-slick";
import { messaging } from "../../firebase";
import LoadingOverlay from "react-loading-overlay-ts";
import Loader from "react-loaders";

import { Col, Row, Button, Form, FormGroup, Label } from "reactstrap";

import { history } from "_helpers";
import { authActions } from "_store";

import logo from "../../assets/utils/images/panther-logo-2.png";
import logoOld from "../../assets/utils/images/panther-logo-2-old.png";
import footerImg from "../../assets/utils/images/panther-logo.png";
import loginBgImg from "../../assets/utils/images/login.png";
import OpenWorXAppCover from "../../assets/utils/images/OpenWorXAppCover.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { analytics } from "../../firebase";
import { getPublicIP, detectInputType } from "_helpers/helper";
import { VerifyEmailPhoneOTPModal } from "_components/modal/verifyEmailPhoneOTP";

import "./login.scss";
export function Login() {
  const dispatch = useDispatch();

  const authUser = useSelector((x) => x?.auth?.token);
  const authError = useSelector((x) => x.auth.error);
  const loading = useSelector((state) => state.auth.loader);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEPModal, setShowEPModal] = useState(false);
  const [companyName, setCompanyName] = useState(null);
  const [reload, setReload] = useState(false);
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

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });


  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cmpName = urlParams.get("companyName");
    setCompanyName(cmpName);
    if (cmpName) {
      getCompanyReferralLogs(cmpName);
    }

    if (authError) {
      setError(true);
      return;
    }
    if (authUser) {
      if (authUser) {
        history.navigate("/");
      } else {
        setError(true);
      }
    }
  }, [authUser, authError]);

  useEffect(() => {
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Login page",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email or phone is required")
      .test(
        "is-email-or-phone",
        "Enter a valid email or phone number",
        function (value) {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          const phoneRegex = /^\+?\d{10,15}$/; // Simple phone pattern

          return emailRegex.test(value || "") || phoneRegex.test(value || "");
        }
      ),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password can be at most 30 characters"),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, getValues } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit(payload) {
    firebasemessaging(payload);
  }
  const firebasemessaging = async (payload) => {
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
      const registration = await navigator.serviceWorker.ready;
      // Generate Token
      const token = await messaging?.getToken({
        vapidKey:
          "BHjlQysiVHS7rlDZRZpJC1mD8g9I8zm7l0bDS2cOKZOHD1-s0nmcACoFXkHZtowJ3v3MFS_kTU94lfMBA8o111c",
        serviceWorkerRegistration: registration,
      });
      payload.firebasetoken = token;
      let res = await dispatch(authActions.loginThunk(payload));

      if (res.payload && companyName) {
        let companyreferrallogid = localStorage.getItem("companyreferrallogid");
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
          companyName: companyName,
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
            id: companyreferrallogid,
            payload,
          })
        );
      }
      console.log("Token Gen", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      console.log("You denied for the notification");
      let res = await dispatch(authActions.loginThunk(payload));
      if (res.payload && companyName) {
        let companyreferrallogid = localStorage.getItem("companyreferrallogid");
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
          companyName: companyName,
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
            id: companyreferrallogid,
            payload,
          })
        );
      }
    }
  };

  const onGetMobileEmailOTP = async (isModal = false) => {
    let type = detectInputType(getValues("email"));
    let payload = {};
    if (type === "mobile") {
      payload = {
        phonenumber: getValues("email"),
        firebasetoken: "",
      };
    } else {
      payload = {
        email: getValues("email"),
        firebasetoken: "",
      };
    }

    if (!isModal) {
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
    }
    let response = await dispatch(authActions.loginWithOTP(payload));
    if (response.payload) {
      if (isModal) {
        showSweetAlert({
          title: response.payload.message,
          type: "success",
        });
      }

      if (!isModal) {
        setShowEPModal(true);
      }
    } else {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    }
  };

  const loginWithOTP = async (otp, type) => {
    let payload = {};
    if (type === "mobile") {
      payload = {
        phonenumber: getValues("email"),
        otp: otp,
        firebasetoken: "",
      };
    } else {
      payload = {
        email: getValues("email"),
        otp: otp,
        firebasetoken: "",
      };
    }

    let response = await dispatch(authActions.loginWithOTP(payload));
    if (response.payload) {
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
  const getCompanyReferralLogs = async (companyName) => {
    setReload(true);
    let payload = {
      referralLogUrl: window.location.href,
      companyName: companyName,
      companyid: 0,
      osversion: "string",
      ipaddress: "string",
      loginsource: "string",
      logindeviceid: "string",
      logindevice: "string",
      currentUserId: 0,
    };
    let res = await dispatch(authActions.postCompanyReferralLogs(payload));
    if (res.payload) {
      localStorage.setItem("logo", res?.payload?.data?.companyInfo?.logourl);
      localStorage.setItem(
        "companyreferrallogid",
        res?.payload?.data?.companyreferrallogid
      );
      localStorage.setItem("companyreferrallogname", companyName);
      localStorage.setItem(
        "referralLogdata",
        JSON.stringify(res?.payload?.data)
      );
    }
    setReload(false);
  };
  return (
    <>
      <div className="app-container login-container">
        <LoadingOverlay
          tag="div"
          active={loading}
          styles={{
            overlay: (base) => ({
              ...base,
              background: "#fff",
              opacity: 0.5,
            }),
          }}
          spinner={
            <Loader active={loading} type="line-scale-pulse-out-rapid"></Loader>
          }
        >
          <div className="h-100">
            <Row className="h-100 g-0">
              <Col
                xxl={{ order: 1, size: 4 }}
                xl={{ order: 1, size: 4 }}
                lg={{ order: 1, size: 4 }}
                md={{ order: 2, size: 12 }}
                sm={{ order: 2, size: 12 }}
                xs={{ order: 2, size: 12 }}
                className="d-lg-block"
              >
                <div className="">
                  <Slider {...sliderSettings}>
                    <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                      {/* <div
                        className="slide-img-bg"
                        style={{
                          backgroundImage: "url(" + OpenWorXAppCover + ")",
                        }}
                      /> */}
                      {/* <div className="login-slider-title">
                        <p>Experts In Human Capital</p>
                        <p className="login-slider-text m-5">
                          What makes The OpenWorX community the ideal career
                          partner? We focus on what you want most from your
                          career!
                        </p>
                      </div> */}
                    </div>
                  </Slider>
                </div>
              </Col>
              <Col
                xxl={{ order: 2, size: 8 }}
                xl={{ order: 2, size: 8 }}
                lg={{ order: 2, size: 8 }}
                md={{ order: 1, size: 12 }}
                sm={{ order: 1, size: 12 }}
                xs={{ order: 1, size: 12 }}
                className="h-100 d-flex bg-white justify-content-center align-items-center"
              >
                <Col lg="9" md="10" sm="12">
                  <div
                    className="mb-1"
                    style={{ width: "200px", height: "80px" }}
                  >
                    {!reload && (
                      <img
                        src={
                          localStorage.getItem("logo")
                            ? localStorage.getItem("logo")
                            : logoOld
                        }
                        className="logo mb-2"
                        style={{
                          objectFit: "contain",
                          height: "100%",
                          width: "100%",
                        }}
                        alt="logo"
                      />
                    )}
                  </div>
                  <Row className="login-divider" />
                  <p className="mb-3 mt-4 title-text">
                    Already Registered, Login Here
                  </p>
                  <div className="login-form">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="email" className="input-label">
                              Email or Phone{" "}
                              <span className="required-icon">*</span>
                            </Label>
                            <input
                              type="text"
                              name="email"
                              id="email"
                              placeholder="Enter email or phone"
                              {...register("email")}
                              className={`login-field-input placeholder-text form-control ${errors.email
                                ? "is-invalid error-text"
                                : "input-text"
                                }`}
                            />
                            <div className="invalid-feedback">
                              {errors.email?.message}
                            </div>
                            <div className="mt-2" style={{ textAlign: "end" }}>
                              <Button
                                style={{ fontSize: "10px" }}
                                color="primary"
                                className="btn-text"
                                size="sm"
                                disabled={!!errors.email}
                                onClick={() => onGetMobileEmailOTP()}
                              >
                                {" "}
                                Log in with code
                              </Button>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="password" className="input-label">
                              Password <span className="required-icon">*</span>
                            </Label>
                            <InputGroup>
                              <input
                                placeholder="Enter password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                {...register("password")}
                                className={`login-field-input placeholder-text form-control ${errors.password ? "is-invalid" : ""
                                  }`}
                              />
                              <InputGroupText
                                onClick={(evt) => togglePasswordVisibility()}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </InputGroupText>
                              <div className="invalid-feedback">
                                {errors.password?.message}
                              </div>
                            </InputGroup>
                            <div className="mt-2" style={{ textAlign: "end" }}>
                              <Link
                                to="/forgot-password"
                                className="text-primary forgot-pwd-text"
                              >
                                Forgot Password?
                              </Link>
                            </div>
                            <div className="mt-5 mb-3 float-end">
                              {/* <Link
                                to="/registration"
                                className="text-primary forgot-pwd-text"
                              >
                                Not a member yet?
                              </Link> */}
                              <Button
                                color="primary"
                                className="btn-text me-1"
                                size="lg"
                                tag={Link}
                                to="/registration"
                              >
                                <span className="btn-text">
                                  Not a member yet?
                                </span>
                              </Button>
                              <Button
                                disabled={isSubmitting}
                                color="primary"
                                className="btn-text me-2 ms-2"
                                size="lg"
                              >
                                {isSubmitting && (
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                )}
                                <span className="btn-text">Sign in</span>
                              </Button>

                              <div></div>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        {/* <Col className="login-divider me-2" /> */}

                        {/* <Col className="col-md-1 login-mt d-flex justify-content-center align-items-center">
                          or
                        </Col> */}
                        {/* <Col className="login-divider" /> */}
                      </Row>

                      {error && (
                        <div>
                          <Row>
                            <Col md="3">
                              <Card className="mb-3 text-center">
                                <CardBody>
                                  <CardTitle>Error</CardTitle>

                                  <SweetAlert
                                    title={authError.message}
                                    type="error"
                                    onConfirm={() => setError(false)}
                                  />
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Form>

                    <div className="mt-4 register-division">
                      <p className="mt-3 d-flex register-paragraph">
                        Welcome to our Career Portal
                      </p>

                      <p className="mt-3 d-flex  register-paragraph">
                        Thank you for your interest in joining our team! You're
                        just a few steps away from exploring exciting
                        opportunities with us.
                      </p>

                      <p className="mt-3 d-flex  register-paragraph">
                        To ensure a smooth and secure application process,
                        please register and create your profile here. This
                        allows us to match you with this and other best-fit
                        opportunities, and keeps us connected throughout the
                        hiring journey.
                      </p>

                      <p className="mt-3 d-flex  register-paragraph">
                        If you have any questions or need assistance, feel free
                        to reach out at any time. We look forward to reviewing
                        your application - welcome!
                      </p>
                    </div>
                  </div>
                  <footer className="footer mt-4">
                    <Row>
                      <Col
                        xxl={{ order: 1, size: 5 }}
                        xl={{ order: 1, size: 5 }}
                        lg={{ order: 1, size: 5 }}
                        md={{ order: 1, size: 12 }}
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
                        xxl={{ order: 2, size: 7 }}
                        xl={{ order: 2, size: 7 }}
                        lg={{ order: 2, size: 7 }}
                        md={{ order: 1, size: 12 }}
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
                          target="_blank"
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
                      </Col>
                    </Row>
                  </footer>
                </Col>
              </Col>
            </Row>
            {showEPModal && (
              <VerifyEmailPhoneOTPModal
                isOpen={showEPModal}
                email={getValues("email")}
                onClose={() => {
                  setShowEPModal(false);
                }}
                onGetMobileEmailOTP={() => {
                  onGetMobileEmailOTP(true);
                }}
                showSweetAlert={(title, type) =>
                  showSweetAlert({ title, type })
                }
                loginWithOTP={(otp, type) => loginWithOTP(otp, type)}
              ></VerifyEmailPhoneOTPModal>
            )}
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
          </div>
        </LoadingOverlay>
      </div>
    </>
  );
}
