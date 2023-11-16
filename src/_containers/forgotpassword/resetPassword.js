import React, { Fragment } from "react";

import Slider from "react-slick";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import loginBgImg from "../../assets/utils/images/login.png";

import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import logo from "../../assets/utils/images/panther-logo.png";
import "./forgotpassword.scss";
import { history } from "_helpers";

export function ResetPassword() {
  const dispatch = useDispatch();
  const authError = useSelector((x) => x.auth.error);
  const [resetPassword, setResetPassword] = useState(false);
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

  useEffect(() => {}, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ email, password }) {}

  return (
    <Fragment>
      <div className="h-100 forgot-password">
        <Row className="h-100 g-0">
          <Col lg="4" className="d-none d-lg-block">
            <div className="">
              <Slider {...sliderSettings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                  <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + loginBgImg + ")",
                    }}
                  />
                  <div className="login-slider-title">
                    <p>Experts In Human Capital</p>
                    <p className="login-slider-text m-5">
                      What makes The Panther Group the ideal career partner? We
                      focus on what you want most from your career!
                    </p>
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
          <Col
            lg="8"
            md="12"
            className="h-100 d-flex bg-white justify-content-center align-items-center"
          >
            <Col lg="6" md="8" sm="12">
              <img
                src={logo}
                className="logo mb-2"
                width={"200px"}
                alt="logo"
              />

              <Row className="login-divider" />

              <p className="mb-1 mt-4 title-text">Reset Password</p>
              <p className="mb-3 header-text">Enter your new password</p>
              <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row Form>
                    <Col md={12}>
                      <FormGroup>
                        <Label className="input-label" for="password">
                          Password <span className="required-icon">*</span>
                        </Label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter new password"
                          {...register("password")}
                          className={`text-field-input placeholder-text form-control ${
                            errors.password
                              ? "is-invalid error-text"
                              : "input-text"
                          }`}
                        />
                        <div className="invalid-feedback">
                          {errors.password?.message}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md={12}>
                      <FormGroup>
                        <Label className="input-label" for="confirmPassword">
                          Confirm Password{" "}
                          <span className="required-icon">*</span>
                        </Label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="Confirm new password"
                          {...register("confirmPassword")}
                          className={`text-field-input placeholder-text form-control ${
                            errors.confirmPassword
                              ? "is-invalid error-text"
                              : "input-text"
                          }`}
                        />
                        <div className="invalid-feedback">
                          {errors.confirmPassword?.message}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mt-4 float-end">
                    <Link
                      to="/login"
                      className="text-primary account-text me-3"
                    >
                      Back to Sign in page
                    </Link>
                    <Button color="primary" size="lg" className="btn-text">
                      Reset Password
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}
