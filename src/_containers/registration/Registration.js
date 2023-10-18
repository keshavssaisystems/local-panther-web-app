import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";

import Slider from "react-slick";
import "./registration.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import bg3 from "../../assets/utils/images/originals/citynights.jpg";

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
} from "reactstrap";

import { history } from "_helpers";
import successIcon from "../../assets/utils/images/success_icon.svg";
import errorIcon from "../../assets/utils/images/error_icon.png";

import { authActions } from "_store";
import logo from "../../assets/utils/images/panther-logo.png";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x?.auth?.token);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
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
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(payload) {
    let response = await dispatch(authActions.registerThunk(payload));
    if (!response.payload) {
      setMessage(response.error.message);

      setError(true);
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirm(!showConfirm);
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
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter email id"
                          {...register("email")}
                          className={`form-control placeholder-name ${
                            errors.email ? "is-invalid" : ""
                          }`}
                        />
                        <FormFeedback>{errors.email?.message}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="phoneNumber" className="input-label">
                          <span className="text-danger">*</span> Phone number
                        </Label>
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
                        />
                        <FormFeedback>
                          {errors.phoneNumber?.message}
                        </FormFeedback>
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
    </>
  );
}
