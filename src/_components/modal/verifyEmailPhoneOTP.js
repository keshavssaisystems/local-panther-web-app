import React, { useState, useEffect } from "react";
import {
  Modal,
  CardBody,
  Card,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  CardFooter,
} from "reactstrap";
import logo from "../../assets/utils/images/panther-logo-2.png";
import phone from "../../assets/utils/images/phone_verify.svg";
import { detectInputType } from "_helpers/helper";
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const VerifyEmailPhoneOTPModal = (props) => {
  const otpLength = ["1", "2", "3", "4", "5", "6"];
  const [otp, setOtp] = useState({
    mobile: "",
    email: "",
  });
  const [saveOTP, setSaveOTP] = useState([]);
  const [timer, setTimer] = useState(0);
  const [mobileValidError, setMobileValidError] = useState(false);
  const [emailValidError, setEmailValidError] = useState(false);
  const [type, setType] = useState(detectInputType(props.email));
  const initialSeconds = 120;
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const resendOTP = function (check) {
    setTimer(60);

    if (check === "mobile") {
      validateOTP("phone");
    }
    if (check === "email") {
      validateOTP("email");
    }
  };

  const validateOTP = async function (check) {
    let data;
    if (check === "phone") {
      data = props?.phone.replace(/\D/g, "");
      if (data === "" || data.length < 10) {
        setMobileValidError(true);
        return;
      } else {
        setMobileValidError(false);
      }
    } else {
      data = props?.email;

      if (data === "" || !emailRegex.test(data)) {
        setEmailValidError(true);
        return;
      } else {
        setEmailValidError(false);
      }
    }
  };
  const handleInputChange = (check, e, index) => {
    let new_data = [...saveOTP];
    let otp_new = { ...otp };
    if (check === "mobile") {
      new_data[index] = e;

      setSaveOTP(new_data);
      otp_new.mobile = new_data.join("");
      setOtp(otp_new);
      if (e !== "") {
        // Automatically focus on the next input field
        const nextInput = document.getElementById(`mobile-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }

      if (e === "") {
        const prevInput = document.getElementById(`mobile-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
      if (otp_new.mobile.length === 6) {
        verifyMobileOTPDetails(otp_new);
      }
    }
    if (check === "email") {
      new_data[index] = e;

      setSaveOTP(new_data);
      otp_new.email = new_data.join("");
      setOtp(otp_new);

      if (e !== "") {
        // Automatically focus on the next input field
        const nextInput = document.getElementById(`email-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
      if (e === "") {
        const prevInput = document.getElementById(`email-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
      if (otp_new.email.length === 6) {
        verifyEmailOTPDetails(otp_new);
      }
    }
  };

  const handlePaste = (e, check) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const pasted = pasteData.split("");
    if (check === "email") {
      let new_data = [...saveOTP];
      let otp_new = { ...otp };
      pasted.map((digit, i) => {
        new_data[i] = digit;
        document.getElementById(`email-${i}`).value = digit;
      });
      setSaveOTP(new_data);
      otp_new.email = new_data.join("");
      setOtp(otp_new);
      if (otp_new.email.length === 6) {
        verifyEmailOTPDetails(otp_new);
      }
    } else if (check === "mobile") {
      let new_data = [...saveOTP];
      let otp_new = { ...otp };
      pasted.map((digit, i) => {
        new_data[i] = digit;
        document.getElementById(`mobile-${i}`).value = digit;
      });
      setSaveOTP(new_data);
      otp_new.mobile = new_data.join("");
      setOtp(otp_new);
      if (otp_new.mobile.length === 6) {
        verifyMobileOTPDetails(otp_new);
      }
    }
  };

  const verifyMobileOTPDetails = (otp) => {
    if (otp[type].length < 6) {
      props.showSweetAlert("Please enter valid OTP", "error");
    } else {
      props.loginWithOTP(otp[type], type);
    }
  };

  const verifyEmailOTPDetails = (otp) => {
    if (otp[type].length < 6) {
      props.showSweetAlert("Please enter valid OTP", "error");
    } else {
      props.loginWithOTP(otp[type], type);
    }
  };


  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    // Exit condition to stop the timer at 0
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    // Clear interval on cleanup
    return () => clearInterval(intervalId);
  }, [timeLeft]); // Dependency on timeLeft re-runs the effect (and interval)


  return (
    <Modal
      className="modal-reject-align registration-container"
      isOpen={props?.isOpen}
    >
      <Card>
        <CardBody>
          <div className="justify-content-center align-items-center text-center mb-4">
            <div className="font-size-lg fw-normal">
              <p className="otp-header-text">
                {" "}
                <img
                  src={logo}
                  className="logo mb-2"
                  style={{
                    objectFit: "contain",
                    height: "60px",
                    width: "100%",
                  }}
                  alt="logo"
                ></img>
              </p>
            </div>
            <div>
              <img
                src={phone}
                className="logo mb-2"
                style={{
                  objectFit: "contain",
                  height: "60px",
                  width: "60px",
                }}
                alt="phone verify"
              ></img>
            </div>

            <div className="font-size-md  fw-normal">
              <b>Enter Code </b>
              <div>To proceed, please enter the code sent to</div>
            </div>
            <div style={{ color: "#545cd8" }}>{props.email}</div>
          </div>

          <div>
            <Form>
              <div className="d-flex justify-content-center align-items-center">
                {otpLength?.map((item, index) => (
                  <FormGroup className="m-2">
                    <Input
                      type="text"
                      name="otp"
                      id={
                        type === "mobile" ? `mobile-${index}` : `email-${index}`
                      }
                      maxLength="1"
                      style={{ fontSize: "24px" }}
                      className="form-control placeholder-name text-center"
                      onInput={(e) =>
                        handleInputChange(
                          type === "mobile" ? "mobile" : "email",
                          e.target.value,
                          index
                        )
                      }
                      onPaste={(e) =>
                        handlePaste(e, type === "mobile" ? "mobile" : "email")
                      }
                    />
                  </FormGroup>
                ))}
              </div>
            </Form>
            <Row>
              <Col>
                <div className="ms-auto d-flex justify-content-center align-items-center">
                  {" "}
                  <button
                    href="#"
                    onClick={() => {
                      if (timeLeft > 0) return;
                      props.onGetMobileEmailOTP();
                      setTimeLeft(initialSeconds);
                    }}
                    className="btn-lg btn btn-link otp-link-label"
                  >
                    {timeLeft > 0 ? `Wait for ${parseInt(timeLeft / 60)}m:${timeLeft % 60}s to sent code again` : "Resend code"}
                  </button>
                </div>
              </Col>
            </Row>

            {/* <Row className="mt-1">
              <Col>
                <div className="ms-auto d-flex justify-content-center align-items-center">
                  {timer > 0 ? (
                    <span style={{ marginLeft: "5px" }}>
                      Resend verification code in
                      <span className="otp-link-label"> {timer} </span>
                      seconds
                    </span>
                  ) : (
                    <a
                      href="#"
                      onClick={() => resendOTP("mobile")}
                      className="btn-lg btn btn-link otp-link-label"
                    >
                      Resend verification code
                    </a>
                  )}
                </div>
              </Col>
            </Row> */}
          </div>
        </CardBody>
        <CardFooter>
          <div className="me-auto ms-auto justify-content-center align-items-center">
            <Button
              color="secondary"
              className="btn"
              onClick={() => props.onClose(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="m-2"
              style={{ background: "#2f479b" }}
              onClick={() => verifyMobileOTPDetails(otp)}
            >
              Submit
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Modal>
  );
};
