import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

import Slider from "react-slick";

import bg3 from "../../assets/utils/images/originals/citynights.jpg";

import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";

import { history } from "_helpers";
import { authActions } from "_store";
import logo from "../../assets/utils/images/panther-logo.png";

export function Registration() {
  const dispatch = useDispatch();
  const authUser = useSelector((x) => x?.auth?.token);
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
      <div className="h-100">
        <Row className="h-100 g-0">
          <Col lg="7" md="12" className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center">
            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
              <img src={logo} width={"130px"} alt="logo"/>
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
                <Form>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleEmail">
                          <span className="text-danger">*</span> Email
                        </Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="Email here..."/>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleName">Name</Label>
                        <Input type="text" name="text" id="exampleName" placeholder="Name here..."/>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="examplePassword">
                          <span className="text-danger">*</span> Password
                        </Label>
                        <Input type="password" name="password" id="examplePassword" placeholder="Password here..."/>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="examplePasswordRep">
                          <span className="text-danger">*</span> Repeat
                          Password
                        </Label>
                        <Input type="password" name="passwordrep" id="examplePasswordRep" placeholder="Repeat Password here..."/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup className="mt-3" check>
                    <Input type="checkbox" name="check" id="exampleCheck" />
                    <Label for="exampleCheck" check>
                      Accept our{" "}
                      <a href="link" onClick={(e) => e.preventDefault()}>
                        Terms and Conditions
                      </a>
                      .
                    </Label>
                  </FormGroup>
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
              </Slider>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}
