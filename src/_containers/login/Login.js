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

import { BsLinkedin, BsGoogle, BsApple } from "react-icons/bs";

import { Col, Row, Button, Form, FormGroup, Label } from "reactstrap";

import { history } from "_helpers";
import { authActions } from "_store";

import logo from "../../assets/utils/images/panther-logo.png";
import loginBgImg from "../../assets/utils/images/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.scss";

export function Login() {
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x?.auth?.token);
  const authError = useSelector((x) => x.auth.error);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  useEffect(() => {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password can be at most 30 characters"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit(payload) {
    firebasemessaging(payload);
  }
  const firebasemessaging = async (payload) => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await messaging.getToken({
        vapidKey:
          "BHDRlNANNHYy5hL-T7sh4uQ3gJCWKxUhXJTRHc85d4mwj51Wo_27e7XHP-W6Ix1zlqvzU9hsiSz6kGXejwG406A",
      });
      payload.firebasetoken = token;
      dispatch(authActions.loginThunk(payload));
      console.log("Token Gen", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      console.log("You denied for the notification");
      dispatch(authActions.loginThunk(payload));
    }
  };

  return (
    <>
      <div className="app-container login-container">
        <div className="h-100">
          <Row className="h-100 g-0">
            <Col lg="4" className="d-lg-block">
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
                        What makes The Panther Group the ideal career partner?
                        We focus on what you want most from your career!
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
              <Col lg="9" md="10" sm="12">
                <img
                  src={logo}
                  className="logo mb-2"
                  width={"200px"}
                  alt="logo"
                />
                <Row className="login-divider" />

                <p className="mb-3 mt-4 title-text">
                  Please sign in to your account.
                </p>

                <div className="login-form">
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="email" className="input-label">
                            Email <span className="required-icon">*</span>
                          </Label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            {...register("email")}
                            className={`login-field-input placeholder-text form-control ${
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
                              className={`login-field-input placeholder-text form-control ${
                                errors.password ? "is-invalid" : ""
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
                          <div className="mt-4 mb-3 float-end">
                            <Link
                              to="/forgot-password"
                              className="text-primary forgot-pwd-text me-3 "
                            >
                              Forgot password?
                            </Link>

                            <Button
                              disabled={isSubmitting}
                              color="primary"
                              className="btn-text"
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
                      <Col className="login-divider me-2" />

                      <Col className="col-md-1 login-mt d-flex justify-content-center align-items-center">
                        or
                      </Col>
                      <Col className="login-divider" />
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

                  {/* <Row className="mt-5 d-flex justify-content-center align-items-center">
                    <Col></Col>
                    <Col>
                      <Row>
                        <Col className="text-center">
                          <div className="ellipse d-flex justify-content-center align-items-center">
                            <BsLinkedin className="icon" />
                          </div>
                        </Col>
                        <Col className="text-center">
                          <div className="ellipse d-flex justify-content-center align-items-center">
                            <BsGoogle className="icon" />
                          </div>
                        </Col>
                        <Col className="text-center">
                          <div className="ellipse d-flex justify-content-center align-items-center">
                            <BsApple className="icon" />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col></Col>
                  </Row> */}

                  <p className="mt-3 d-flex justify-content-center align-items-center">
                    <Link to="/registration" className="forgot-pwd-text">
                      Not a member yet?
                    </Link>
                  </p>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
