import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

import Slider from "react-slick";

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
      .required("Phone number is required")
      .matches(phoneRegExp, 'Phone number is not valid'),
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
      <div className="h-100">
        <Row className="h-100 g-0">
          <Col lg="7" md="12" className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
              <img src={logo} width={"130px"} alt="logo" />
              <div className="app-logo" />
              <h4>
                <div>Welcome,</div>
                <span>
                  It only takes a{" "}
                  <span className="text-success">few seconds</span> to create
                  your account
                </span>
              </h4>
              <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="firstName">
                          <span className="text-danger">*</span> First name
                        </Label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="First Name"
                            {...register("firstName")}
                            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                          />
                        <FormFeedback>{errors.firstName?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lastName">
                          <span className="text-danger">*</span> Last name
                        </Label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Last Name"
                            {...register("lastName")}
                            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                          />
                        <FormFeedback>{errors.lastName?.message}</FormFeedback>

                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">
                          <span className="text-danger">*</span> Email
                        </Label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            {...register("email")}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                          />
                        <FormFeedback>{errors.email?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="phoneNumber">Phone number</Label>
                        <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="Phone number here..."
                            {...register("phoneNumber")}
                            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                          />
                        <FormFeedback>{errors.phoneNumber?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="password">
                          <span className="text-danger">*</span> Password
                        </Label>
                        <input 
                          placeholder="password" 
                          name="password"
                          type="password"
                          id="password"  {...register("password")}
                          className={`form-control ${errors.password ? "is-invalid" : ""}`} />
                        <FormFeedback>{errors.password?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="confirmPassword">
                          <span className="text-danger">*</span> Repeat Password
                        </Label>
                        <input 
                          type="password"
                          placeholder="confirmPassword" 
                          name="confirmPassword"
                          id="confirmPassword"  {...register("confirmPassword")}
                          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} />
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
                    <h5 className="mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary">Sign in</Link>
                    </h5>
                    <div className="ms-auto">
                      <Button color="primary" className="btn-wide btn-pill btn-shadow btn-hover-shine" size="lg">
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