import React, { useState, useEffect } from "react";
import { Label, Input } from "reactstrap";
import { settingsActions } from "_store";
import {
  Row,
  Col,
  FormFeedback,
  Card,
  CardBody,
  InputGroup,
  Button,
  FormGroup,
  InputGroupText,
  Form,
  Modal,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SuccessPopUp } from "./successPopUp";

export function ChangePassword(props) {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = (check) => {
    if (check === "current") {
      setCurrentPassword(!currentPassword);
    } else if (check === "new") {
      setShowPassword(!showPassword);
    } else {
      setConfirmPassword(!confirmPassword);
    }
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*#^?&(),./+=._-]{6,}$/;
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Current password is required")
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password can be at most 30 characters"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(4, "Password must be at least 4 characters")
      .matches(
        passwordRegex,
        "Password must contain atleast 1 special character, 1 uppercase, 1 lowercase and 1 number"
      )
      .max(30, "Password can be at most 30 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required")
      .min(4, "Confirm password must be at least 4 characters")
      .max(30, "Confirm password can be at most 30 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  async function onSubmit(payload) {
    let password_data = {
      userId: JSON.parse(localStorage.getItem("userDetails"))?.UserId,
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    };

    let response = await dispatch(
      settingsActions.changePassword({ password_data })
    );
    if (!response.payload) {
      setError(true);
      setMessage(response.error.message);
    } else {
      setSuccess(true);
    }
  }

  return (
    <>
      <div className="profile-view react-date-picker-profile">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <div>
                <FormGroup>
                  <Label for="currentPassword" className="fw-semi-bold">
                    Current Password <span className="required-icon"> *</span>
                  </Label>
                  <InputGroup>
                    <input
                      placeholder="Enter current password"
                      name="currentPassword"
                      type={currentPassword ? "text" : "password"}
                      id="currentPassword"
                      {...register("currentPassword")}
                      className={`form-control placeholder-name ${
                        errors.currentPassword ? "is-invalid" : ""
                      }`}
                      maxLength={30}
                    />
                    <InputGroupText
                      onClick={(evt) => togglePasswordVisibility("current")}
                    >
                      {currentPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                    <FormFeedback>
                      {errors.currentPassword?.message}
                    </FormFeedback>
                  </InputGroup>
                </FormGroup>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div>
                <FormGroup>
                  <Label for="newPassword" className="fw-semi-bold">
                    New password <span className="required-icon"> *</span>
                  </Label>
                  <InputGroup>
                    <input
                      placeholder="Enter new password"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      {...register("newPassword")}
                      className={`form-control placeholder-name ${
                        errors.newPassword ? "is-invalid" : ""
                      }`}
                      maxLength={30}
                    />
                    <InputGroupText
                      onClick={(evt) => togglePasswordVisibility("new")}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                    <FormFeedback>{errors.newPassword?.message}</FormFeedback>
                  </InputGroup>
                </FormGroup>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div>
                <FormGroup>
                  <Label for="confirmPassword" className="fw-semi-bold">
                    Confirm new password{" "}
                    <span className="required-icon"> *</span>
                  </Label>
                  <InputGroup>
                    <input
                      placeholder="Enter confirm password"
                      name="confirmPassword"
                      type={confirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      {...register("confirmPassword")}
                      className={`form-control placeholder-name ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      maxLength={30}
                    />
                    <InputGroupText
                      onClick={(evt) => togglePasswordVisibility()}
                    >
                      {confirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                    <FormFeedback>
                      {errors.confirmPassword?.message}
                    </FormFeedback>
                  </InputGroup>
                </FormGroup>
              </div>
            </Col>
          </Row>

          <div className="float-end">
            <Button className="me-2 save-btn" type="submit">
              Save
            </Button>
            <Button
              type="button"
              className="close-btn"
              onClick={() => props.callBackError()}
            >
              Close
            </Button>
          </div>
        </Form>
      </div>

      <Modal size="md" isOpen={success}>
        <SuccessPopUp
          icon={"success"}
          message={"Password changed"}
          callBack={() => [setSuccess(false), props.callBack()]}
        />
      </Modal>

      <Modal size="md" isOpen={error}>
        <SuccessPopUp
          icon={"error"}
          message={message}
          callBack={() => setError(false)}
        />
      </Modal>
    </>
  );
}
