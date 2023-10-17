import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";

import Slider from "react-slick";
import "./registration.scss";

import bg3 from "../../assets/utils/images/originals/citynights.jpg";

import { Col, Row, Button, Form, FormGroup, Label, FormFeedback } from "reactstrap";

import { history } from "_helpers";

import { authActions } from "_store";
import logo from "../../assets/utils/images/panther-logo.png";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
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

  const dispatch = useDispatch();
  const authUser = useSelector((x) => x?.auth?.token);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
      .min(3, "First name must be at least 3 characters")
      .max(30, "First name must be at most 30 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
      .min(3, "First name must be at least 3 characters")
      .max(30, "First name must be at most 30 characters"),
    email: Yup.string().required("Email is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password can be at most 30 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required("Confirm Password is required")
      .min(4, "Confirm Password must be at least 4 characters")
      .max(30, "Confirm Password can be at most 30 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit(payload) {
    dispatch(authActions.registerThunk(payload))
  }

  return (
    <>
      <div className=" registration-container h-100">
        <Row className="h-100 g-0">
          <Col lg="7" md="12" className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
              <div className="">
                <img src={logo} width={"130px"} alt="logo" className="logo" /></div>
              <div className="app-logo" />
              <h4>
                <div className="title-text">Welcome,</div>
                <span className="title-text">
                  It only takes a{" "}
                  <span className="title-text">few seconds</span> to create
                  your account
                </span>
              </h4>
              <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
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
                          className={`form-control placeholder-name ${errors.firstName ? "is-invalid" : ""}`}
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
                          className={`form-control placeholder-name ${errors.lastName ? "is-invalid" : ""}`}
                        />
                        <FormFeedback>{errors.lastName?.message}</FormFeedback>

                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email" className="input-label">
                          <span className="text-danger">*</span> Email
                        </Label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter email id"
                          {...register("email")}
                          className={`form-control placeholder-name ${errors.email ? "is-invalid" : ""}`}
                        />
                        <FormFeedback>{errors.email?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="phoneNumber" className="input-label">Phone number</Label>
                        <InputMask
                          mask="(999)-999-9999"
                          maskChar={null}
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="Eg: (987)-654-3210"
                          {...register("phoneNumber")}
                          className={`form-control placeholder-name ${errors.phoneNumber ? "is-invalid" : ""}`}

                        />
                        <FormFeedback>{errors.phoneNumber?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="password" className="input-label">
                          <span className="text-danger">*</span> Password
                        </Label>
                        <input
                          placeholder="Enter password"
                          name="password"
                          type="password"
                          id="password"  {...register("password")}
                          className={`form-control placeholder-name ${errors.password ? "is-invalid" : ""}`} />
                        <FormFeedback>{errors.password?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="confirmPassword" className="input-label">
                          <span className="text-danger">*</span> Repeat Password
                        </Label>
                        <input
                          type="password"
                          placeholder="Enter confirm password"
                          name="confirmPassword"
                          id="confirmPassword"  {...register("confirmPassword")}
                          className={`form-control placeholder-name ${errors.confirmPassword ? "is-invalid" : ""}`} />
                        <FormFeedback>{errors.confirmPassword?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <FormGroup className="mt-3" check>

                    <Input
                      type="checkbox"
                      name="acceptTerms"
                      id="acceptTerms"
                    {...register("acceptTerms")}
                    invalid={!!errors.acceptTerms}
                    />
                    <Label for="acceptTerms" check>
                      Accept our{" "}
                      <a href="link" onClick={(e) => e.preventDefault()}>
                        Terms and Conditions
                      </a>
                      .
                    </Label>
                    <FormFeedback>{errors.acceptTerms?.message}</FormFeedback>
                  </FormGroup> */}
                  <div className="mt-4 d-flex align-items-center">
                    <h5 className="mb-0 account-text">
                      Already have an account?{" "}
                      <Link to="/login" >Sign in</Link>
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
                  <div className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + bg3 + ")",
                    }} />
                  <div className="slider-content">
                    <h3>Scalable, Modular, Consistent</h3>
                    <p>
                      Easily exclude the components you don't require.
                      Lightweight, consistent Bootstrap based styles across
                      all elements and components
                    </p>
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}