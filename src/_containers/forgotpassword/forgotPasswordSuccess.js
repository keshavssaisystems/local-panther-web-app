import { useState } from "react";
import "./forgotpassword.scss";
import Slider from "react-slick";
import loginBgImg from "../../assets/utils/images/login.png";
import { Col, Row, Button } from "reactstrap";

import { history } from "_helpers";

import logo from "../../assets/utils/images/panther-logo-2.png";
import footerImg from "../../assets/utils/images/panther-logo.png";

export function ForgotPasswordSuccess() {
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
  const login = function () {
    history.navigate("/login");
  };

  return (
    <>
      <div className="h-100 forgot-password">
        <Row className="h-100 g-0">
          <Col lg="4" className="d-xs-none">
            <div className="">
              <Slider {...sliderSettings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                  {/* <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + loginBgImg + ")",
                    }}
                  />
                  <div className="login-slider-title">
                    <p>Experts In Human Capital</p>
                    <p className="login-slider-text m-5">
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
            className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center"
          >
            <Col lg="6" md="8" sm="12">
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

              <p className="mb-2 mt-4 title-text">
                New Password Sent Successfully
              </p>
              <p className="mb-3 header-text">
                Please check your email for new password.
              </p>
              <div>
                <Button
                  color="primary"
                  className="btn-text"
                  onClick={(evt) => login()}
                >
                  Proceed to Sign in
                </Button>
              </div>
              <div className="text-center mt-5">
                Powered by <br />
                <img
                  src={footerImg}
                  className="logo mb-2"
                  width="155px"
                  alt="logo"
                />
              </div>
            </Col>
          </Col>
        </Row>
      </div>
    </>
  );
}
