import React, { Fragment } from "react";

import Slider from "react-slick";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import loginBgImg from "../../assets/utils/images/login.png";
import { authActions } from "_store";

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
import logo from "../../assets/utils/images/panther-logo.png";
import "./forgotpassword.scss";
import { history } from "_helpers";

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
                  <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + loginBgImg + ")",
                    }}
                  />
                  <div className="slider-title">
                    <p>Experts In Human Capital</p>
                    <p className="slider-text m-5">
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

              <p className="mb-2 mt-4 title-text">Forgot Password?</p>
              <p className="mb-3 header-text">
                Enter your registered Email id to reset the password
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
                          placeholder="Enter email id"
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
            </Col>
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
