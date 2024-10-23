import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import bg1 from "../../assets/utils/images/login.png";

import { Col, Row, Button } from "reactstrap";

import "./registrationsuccess.scss";

import logo from "../../assets/utils/images/panther-logo-2.png";
import footerImg from "../../assets/utils/images/panther-logo.png";
export const RegistrationSuccess = () => {
  useEffect(() => {
    return () => {
      localStorage.removeItem("iscustomerreg");
    };
  });
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

  return (
    <>
      <div className="registrationsuccess-container h-100">
        <Row className="h-100 g-0">
          <Col
            lg="7"
            md="12"
            className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center"
          >
            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
              <img src={logo} width={"130px"} alt="logo" className="logo" />
              <div className="app-logo" style={{ height: "0px" }} />
              <h6>
                <div className="succese-text">
                  Account created successfully!
                </div>
                {/* <span className="success-msg">
                  Please check your register email for email verification.
                </span> */}
              </h6>
              <div className="mt-4">
                {localStorage.getItem("iscustomerreg") ? (
                  <>
                    <Link
                      to={`/payment/${localStorage.getItem("iscustomerreg")}`}
                    >
                      <Button color="dark" className=" btn-text" size="lg">
                        Add Billing Details
                      </Button>
                    </Link>
                    <span className="ms-2 me-2">or</span>{" "}
                  </>
                ) : (
                  <></>
                )}
                <Link to="/login">
                  <Button color="primary" className=" btn-text" size="lg">
                    Proceed to login
                  </Button>
                </Link>
              </div>
              <div className="text-center mt-3">
                powered by <br />
                <img
                  src={footerImg}
                  className="mb-2"
                  width="155px"
                  alt="logo"
                />
              </div>
            </Col>
          </Col>
          <Col lg="5" className="d-xs-none">
            <div className="slider-light">
              <Slider {...sliderSettings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                  <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + bg1 + ")",
                    }}
                  />
                  <div>
                    <h3 className="slider-title">Experts In Human Capital</h3>
                    <p className="m-5 slider-content">
                      What makes The OpenWorX community the ideal career
                      partner? We focus on what you want most from your career!
                    </p>
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
