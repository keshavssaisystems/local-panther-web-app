import { useState } from "react";
import "./forgotpassword.scss";
import Slider from "react-slick";

import bg3 from "../../assets/utils/images/originals/citynights.jpg";

import { Col, Row, Button } from "reactstrap";

import { history } from "_helpers";

import logo from "../../assets/utils/images/panther-logo.png";

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
          <Col
            lg="7"
            md="12"
            className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center"
          >
            <Col lg="6" md="8" sm="12">
              <img
                src={logo}
                className="logo mb-4"
                width={"200px"}
                alt="logo"
              />

              <Row className="login-divider" />

              <p className="mb-2 mt-4 title-text">
                New Password Sent Successfully
              </p>
              <p className="mb-3 header-text">
                Please check your register email for new password.
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
            </Col>
          </Col>
        </Row>
      </div>
    </>
  );
}
