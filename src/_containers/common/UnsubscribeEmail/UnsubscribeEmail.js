
import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { unsubscribeActions } from "_store/unsubscribeemail.slice";
import {
    Col,
    Row,
    Button,
    Form,
    FormGroup,
    Label,
    Card,
    CardBody,
    CardTitle,
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import logo from "../../../assets/utils/images/panther-logo-2.png";
import { useDispatch } from "react-redux";
import footerImg from "../../../assets/utils/images/panther-logo.png";

export function UnsubscribeEmail() {

    const dispatch = useDispatch();
    const [emailError, setError] = useState(false);
    const [message, setMessage] = useState("");
    const { token } = useParams();
    const [isUnsubscribed, setIsUnsubscribed] = useState(false);


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

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    async function onSubmit({ email }) {
        console.log(token);
        let response = await dispatch(
            unsubscribeActions.getUnsubscribeEmail(token)
        );
        if (response?.payload) {
            setIsUnsubscribed(response?.payload?.statusCode == 200 ? true : false);
            // console.log(response);
        }
        if (response?.error) {
            setError(true);
            setMessage(response?.error?.message);
        }
    }

    return (
        <Fragment>
            <div className="h-100 forgot-password">
                <Row className="h-100 g-0">
                    <Col lg="4" className="d-none d-lg-block">
                        <div className="">
                            <Slider {...sliderSettings}>
                                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                                </div>
                            </Slider>
                        </div>
                    </Col>
                    <Col
                        lg="8"
                        md="12"
                        className="h-100 d-flex bg-white justify-content-center align-items-center"
                    >
                        <Col lg="6" md="8" sm="12" className="ps-2">
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
                            {isUnsubscribed ? (<div>
                                <p className="mb-3 header-text">
                                    You have been unsubscribed
                                </p>
                            </div>
                            ) : <div> <p className="mb-2 mt-4 title-text">Unsubscribe Email</p>
                                <p className="mb-3 header-text">
                                    Are you sure you want to unsubscribe the email?
                                </p>
                                <div>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mt-4 float-end">
                                            <Button color="primary" size="lg" className="btn-text">
                                                Yes
                                            </Button>
                                        </div>
                                    </Form>
                                </div></div>}
                            <br /> <br />
                            <div
                                style={{ visibility: "hidden" }}
                                className="text-center mt-5 pb-text"
                            >
                                Powered by <br />
                                <img
                                    src={footerImg}
                                    className="logo mb-2"
                                    width="155px"
                                    alt="logo"
                                />
                            </div>
                        </Col>
                        <footer className="footer--pin-registration">
                            <Row>
                                <Col lg="4" md="4" sm="12"></Col>
                                <Col
                                    xxl={{ order: 1, size: 3 }}
                                    xl={{ order: 1, size: 3 }}
                                    lg={{ order: 1, size: 3 }}
                                    md={{ order: 1, size: 3 }}
                                    sm={{ order: 1, size: 12 }}
                                    xs={{ order: 1, size: 12 }}
                                    className="text-start mt-1"
                                >
                                    <span className="mt-2 pb-text">Powered by</span>
                                    <img
                                        src={footerImg}
                                        className="logo ms-1"
                                        width="135px"
                                        alt="logo"
                                    />
                                </Col>
                                <Col
                                    xxl={{ order: 2, size: 5 }}
                                    xl={{ order: 2, size: 5 }}
                                    lg={{ order: 2, size: 5 }}
                                    md={{ order: 1, size: 5 }}
                                    sm={{ order: 1, size: 12 }}
                                    xs={{ order: 1, size: 12 }}
                                    className="text-end mt-1"
                                >
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link"
                                    >
                                        Privacy Policy
                                    </a>
                                    <span className="mx-2">|</span>
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link"
                                    >
                                        Terms & Conditions
                                    </a>
                                    <span className="mx-2">|</span>
                                    <a
                                        href="/support"
                                        rel="noopener noreferrer"
                                        className="footer-link"
                                    >
                                        Support
                                    </a>
                                    <span className="mx-2">|</span>
                                    <a
                                        href="/contact"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link"
                                    >
                                        Contact Us
                                    </a>
                                    <span className="mx-2">|</span>
                                    <a href="/" rel="noopener noreferrer" className="footer-link">
                                        Home
                                    </a>
                                </Col>
                            </Row>
                        </footer>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}