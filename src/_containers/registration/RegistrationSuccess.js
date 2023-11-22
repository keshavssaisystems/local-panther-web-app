import { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import bg3 from "../../assets/utils/images/originals/citynights.jpg";

import { Col, Row, Button } from "reactstrap";

import "./registrationsuccess.scss";

import logo from "../../assets/utils/images/panther-logo.png";

export function RegistrationSuccess() {
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
                <Link to="/login">
                  <Button color="primary" className=" btn-text" size="lg">
                    Proceed to login
                  </Button>
                </Link>
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
    </>
  );
}
