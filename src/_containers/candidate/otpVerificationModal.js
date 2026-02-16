import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Form,
  FormGroup
} from "reactstrap";
import "./otpVerificationModal.css";
const OTP_EXPIRY_SECONDS = 120;   // 2 minutes
const RESEND_DELAY_SECONDS = 30;  // 30 sec before resend enabled

const OtpVerificationModal = ({
  isOpen,
  mobileNumber,
  onClose,
  onVerify,
  onResend,
  loading
}) => {
  const type = mobileNumber ? "mobile" : "email";
  const otpLength = ["1", "2", "3", "4", "5", "6"];
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendCountdown, setResendCountdown] = useState(RESEND_DELAY_SECONDS);

  /* ---------------------------------- */
  /* Timer Logic                        */
  /* ---------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    setSecondsLeft(OTP_EXPIRY_SECONDS);
    setResendCountdown(RESEND_DELAY_SECONDS);
    setOtp("");
    setError("");

    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
      setResendCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  /* ---------------------------------- */
  /* Handle Verify                      */
  /* ---------------------------------- */

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");

    const result = await onVerify(otp);

    if (!result?.success) {
      setError(result?.message || "Invalid or expired OTP");
    }
  };

  /* ---------------------------------- */
  /* Handle Resend                      */
  /* ---------------------------------- */

  const handleResend = async () => {
    await onResend();

    setResendCountdown(RESEND_DELAY_SECONDS);
    setSecondsLeft(OTP_EXPIRY_SECONDS);
    setOtp("");
    setError("");
  };

  /* ---------------------------------- */
  /* Format Timer Display               */
  /* ---------------------------------- */

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm}:${ss.toString().padStart(2, "0")}`;
  };

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */

  const [saveOTP, setSaveOTP] = useState([]);
  const handleInputChange = (check, e, index) => {
    let new_data = [...saveOTP];
    let otp_new = { ...otp };
    if (check === "mobile") {
      new_data[index] = e;

      setSaveOTP(new_data);
      otp_new = new_data.join("");
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
      if (otp_new.length === 6) {
       onVerify(otp_new);
      }
    }
  };

  const handlePaste = (e, check) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const pasted = pasteData.split("");
    if (check === "mobile") {
      let new_data = [...saveOTP];
      let otp_new = { ...otp };
      pasted.map((digit, i) => {
        new_data[i] = digit;
        document.getElementById(`mobile-${i}`).value = digit;
      });
      setSaveOTP(new_data);
      otp_new = new_data.join("");
      setOtp(otp_new);
      if (otp_new.length === 6) {
        onVerify(otp_new);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      keyboard={false}
      className="otp-modal"
    >
      {/* <Modal isOpen={isOpen} toggle={onClose} centered> */}
      <ModalHeader toggle={onClose}>
        Verify Mobile Number
      </ModalHeader>

      <ModalBody>

        <p className="mb-2">
          Enter the 6-digit OTP sent to
        </p>

        <p className="fw-bold mb-3">
          {mobileNumber}
        </p>
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
        {error && (
          <div className="text-danger mt-2 small">
            {error}
          </div>
        )}

        {/* <div className="mt-3 small text-muted">
          OTP expires in {formatTime(secondsLeft)}
        </div> */}

        <div className="d-flex justify-content-between align-items-center mt-4">
          {resendCountdown === 0 ? (
            <Button
              color="link"
              className="p-0"
              onClick={handleResend}
            >
              Resend OTP
            </Button>
          ) : (
            <span className="text-muted small">
              Resend available in {resendCountdown}s
            </span>
          )}

          <div>
            <Button
              color="secondary"
              className="me-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              color="primary"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>

        </div>

      </ModalBody>
    </Modal>
  );
};

OtpVerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mobileNumber: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default OtpVerificationModal;
