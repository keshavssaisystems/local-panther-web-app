import React, { Fragment, useEffect } from "react";

import Slider from "react-slick";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import loginBgImg from "../../assets/utils/images/login.png";
import { authActions } from "_store";
import footerImg from "../../assets/utils/images/panther-logo.png";
import "../static/terms.scss";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import logo from "../../assets/utils/images/panther-logo-2.png";
import "./forgotpassword.scss";
import { history } from "_helpers";
import { analytics } from "../../firebase/index";

export function ForgotPassword() {
  const dispatch = useDispatch();
  const [emailError, setError] = useState(false);
  const [message, setMessage] = useState("");
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

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Forgot password",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);
  async function onSubmit({ email }) {
    let userId = 0;
    let loggedInUserId = 0;
    let emailId = email;

    let response = await dispatch(
      authActions.forgotPasswordThunk({ userId, emailId, loggedInUserId })
    );
    if (response?.error) {
      setError(true);
      setMessage(response?.error?.message);
    } else {
      history.navigate("/forgot-password-success");
    }
  }

  return (
    <Fragment>
      <div className="h-100 forgot-password">
        <Row className="h-100 g-0">
          <Col lg="4" className="d-none d-lg-block">
            <div className="">
              <Slider {...sliderSettings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                  {/* <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + loginBgImg + ")",
                    }}
                  />
                  <div className="slider-title">
                    <p>Experts In Human Capital</p>
                    <p className="slider-text m-5">
                      What makes The OpenWorX community the ideal career
                      partner? We focus on what you want most from your career!
                    </p>
                  </div> */}
                </div>
              </Slider>
            </div>
          </Col>
          <Col
            lg="8"
            md="12"
            className="h-100 d-flex bg-white justify-content-center align-items-center"
          >
            <Col lg="6" md="8" sm="12" className="ps-2">
              <div style={{ width: "200px", height: "80px" }}>
                <img
                  src={
                    localStorage.getItem("logo")
                      ? localStorage.getItem("logo")
                      : logo
                  }
                  className="logo mb-2"
                  style={{
                    objectFit: "contain",
                    height: "100%",
                    width: "100%",
                  }}
                  alt="logo"
                />
              </div>
              <Row className="login-divider" />
              <p className="mb-2 mt-4 title-text">Forgot Password?</p>
              <p className="mb-3 header-text">
                Enter your registered Email to reset the password
              </p>
              <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label className="input-label" for="exampleEmail">
                          Email <span className="required-icon">*</span>
                        </Label>
                        <input
                          type="email"
                          name="Email"
                          id="email"
                          placeholder="Enter email"
                          {...register("email")}
                          className={`text-field-input placeholder-text form-control ${
                            errors.email
                              ? "is-invalid error-text"
                              : "input-text"
                          }`}
                        />
                        <div className="invalid-feedback">
                          {errors.email?.message}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mt-4 float-end">
                    <Link
                      to="/login"
                      className="text-primary account-text me-3"
                    >
                      Sign in existing account
                    </Link>
                    <Button color="primary" size="lg" className="btn-text">
                      Recover Password
                    </Button>
                  </div>
                </Form>
              </div>
              <br /> <br />
              <div
                style={{ visibility: "hidden" }}
                className="text-center mt-5"
              >
                Powered by <br />
                <img
                  src={footerImg}
                  className="logo mb-2"
                  width="155px"
                  alt="logo"
                />
              </div>
            </Col>
            <footer className="footer--pin-registration">
              <Row>
                <Col lg="4" md="4" sm="12"></Col>
                <Col
                  xxl={{ order: 1, size: 3 }}
                  xl={{ order: 1, size: 3 }}
                  lg={{ order: 1, size: 3 }}
                  md={{ order: 1, size: 3 }}
                  sm={{ order: 1, size: 12 }}
                  xs={{ order: 1, size: 12 }}
                  className="text-start mt-1"
                >
                  <span className="mt-2">Powered by</span>
                  <img
                    src={footerImg}
                    className="logo ms-1"
                    width="135px"
                    alt="logo"
                  />
                </Col>
                <Col
                  xxl={{ order: 2, size: 5 }}
                  xl={{ order: 2, size: 5 }}
                  lg={{ order: 2, size: 5 }}
                  md={{ order: 1, size: 5 }}
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
                  <a href="/" rel="noopener noreferrer" className="footer-link">
                    Home
                  </a>
                </Col>
              </Row>
            </footer>
          </Col>
        </Row>

        {emailError ? (
          <div>
            <Row>
              <Col md="3">
                <Card className="mb-3 text-center">
                  <CardBody>
                    <CardTitle>Error</CardTitle>

                    <SweetAlert
                      title={message}
                      type="error"
                      onConfirm={() => setError(false)}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Fragment>
  );
}
