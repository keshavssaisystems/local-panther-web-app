import React, { useState, useEffect } from "react";
import { Row, Col, Input, Label } from "reactstrap";
import Slider from "react-slick";
import logo from "../../assets/utils/images/panther-logo.png";
import bg1 from "../../assets/utils/images/login.png";
import { PaymentDetails } from "./paydetails";
import "./payment.scss";

export const Payment = () => {
  let settings = {
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
  };
  return (
    <>
      <div className="payment-cont">
        <div className=" registration-container h-100">
          <Row className="h-100 g-0">
            <Col
              lg="7"
              md="12"
              className="h-100 d-md-flex d-sm-block bg-white justify-content-center align-items-center"
              style={{ overflow: "auto" }}
            >
              <Col
                lg="9"
                md="10"
                sm="12"
                className="mx-auto app-login-box me-2 ms-2"
              >
                <div className="">
                  <img src={logo} alt="logo" className="logo mb-2" />
                </div>
                <Row className="login-divider" />
                <PaymentDetails />
              </Col>
            </Col>
            <Col lg="5" className="d-xs-none">
              <div className="slider-light">
                <Slider {...settings}>
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
                        partner? We focus on what you want most from your
                        career!
                      </p>
                    </div>
                  </div>
                </Slider>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
