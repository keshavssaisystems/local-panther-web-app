import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

import Slider from "react-slick";

import bg1 from "../assets/utils/images/originals/city.jpg";
import bg2 from "../assets/utils/images/originals/citydark.jpg";
import bg3 from "../assets/utils/images/originals/citynights.jpg";

import { Col, Row, Button, Form, FormGroup, Label } from "reactstrap";

import { history } from "_helpers";
import { authActions } from "_store";
import logo from "../assets/utils/images/panther-logo.png";

export { Login };

function Login() {
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x.auth.user);
  const authError = useSelector((x) => x.auth.error);

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
    // redirect to home if already logged in
    if (authUser) history.navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
    return dispatch(authActions.login({ username, password }));
  }

  return (
    <>
      <div className="app-container">
        <div className="h-100">
          <Row className="h-100 g-0">
            <Col lg="4" className="d-none d-lg-block">
              <div className="slider-light">
                <Slider {...sliderSettings}>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                    <div className="slide-img-bg"
                      style={{
                        backgroundImage: "url(" + bg1 + ")",
                      }}/>
                    <div className="slider-content">
                      <h3>Perfect Balance</h3>
                      <p>
                        ArchitectUI is like a dream. Some think it's too good to
                        be true! Extensive collection of unified React Boostrap
                        Components and Elements.
                      </p>
                    </div>
                  </div>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                    <div className="slide-img-bg"
                      style={{
                        backgroundImage: "url(" + bg3 + ")",
                      }}/>
                    <div className="slider-content">
                      <h3>Scalable, Modular, Consistent</h3>
                      <p>
                        Easily exclude the components you don't require.
                        Lightweight, consistent Bootstrap based styles across
                        all elements and components
                      </p>
                    </div>
                  </div>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
                    <div className="slide-img-bg opacity-6"
                      style={{
                        backgroundImage: "url(" + bg2 + ")",
                      }}/>
                    <div className="slider-content">
                      <h3>Complex, but lightweight</h3>
                      <p>
                        We've included a lot of components that cover almost all
                        use cases for any type of application.
                      </p>
                    </div>
                  </div>
                </Slider>
              </div>
            </Col>
            <Col lg="8" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
              <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                <img src={logo} width={"130px"} alt="logo"/>
                
                <div className="app-logo" />
                <h4 className="mb-0">
                  <div>Welcome back,</div>
                  <span>Please sign in to your account.</span>
                </h4>
                {/* <h6 className="mt-3">
                  No account?{" "}
                  <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="text-primary">
                    Sign up now
                  </a>
                </h6> */}
                <Row className="divider" />
                <div>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="userName">Email</Label>
                          <input 
                            type="text" 
                            name="username" 
                            id="userName"
                            placeholder="User name here..." 
                            {...register("username")}
                            className={`form-control ${
                              errors.username ? "is-invalid" : ""
                            }`}
                            />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="password">Password</Label>
                          <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Password here..."
                            {...register("password")}
                            className={`form-control ${
                              errors.password ? "is-invalid" : ""
                            }`}
                          />
                          <div className="invalid-feedback">{errors.password?.message}</div>
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* <FormGroup check>
                      <Input type="checkbox" name="check" id="exampleCheck" />
                      <Label for="exampleCheck" check>
                        Keep me logged in
                      </Label>
                    </FormGroup> */}
                    <Row className="divider" />
                    <div className="d-flex align-items-center">
                      <div className="ms-auto">
                        {/* <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="btn-lg btn btn-link" >
                          Recover Password
                        </a>{" "} */}
                        <Button disabled={isSubmitting} color="primary" size="lg">
                          {isSubmitting && (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                          )}
                          Login
                        </Button>
                      </div>
                    </div>

                    {authError && (
                      <div className="alert alert-danger mt-3 mb-0">
                        {authError.message}
                      </div>
                    )}
                  </Form>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}
