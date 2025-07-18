import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions, scheduleInterviewActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Button,
  Card,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  InputGroup,
  InputGroupText,
} from "reactstrap";

import { database } from "../../firebase/index";
import "firebase/database";
import "./guest-preview.css";
export const GuestPreview = (props) => {
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Your full name is required."),
    email: Yup.string()
      .required("Your email is required")
      .test("Enter a valid email", function (value) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        return emailRegex.test(value || "");
      }),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, getValues } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    const nameRef = database.ref(props.urlParams);
    nameRef.on("value", (snapshot) => {
      debugger;
      const data = snapshot.val();
      if (data) {
      }
    });

    // Cleanup listener on unmount
    return () => nameRef.off();
  });
  const handleAdd = () => {
    debugger;
    database.ref("items").push({
      value: "test1",
      createdAt: Date.now(),
    });
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    routeToHome();
  };
  const routeToHome = () => {
    if (
      localStorage.getItem("userroleid") &&
      localStorage.getItem("userroleid") === "2"
    ) {
      navigate("/scheduled-interview");
    } else {
      navigate("/");
    }
  };

  function onSubmit(payload) {}

  return (
    <div className="guest-cont">
      <Card className="card-div">
        <div className="div-title mt-3">Welcome to the Interview!</div>
        <div className="div-subt mt-2">
          Please enter your details to join the meeting.
        </div>
        <div className="mt-4">
          <Form className="form-div" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="email" className="input-label">
                    Your Full Name <span className="required-icon">*</span>
                  </Label>
                  <input
                    type="text"
                    name="fullname"
                    id="name"
                    placeholder="Enter your name"
                    {...register("name")}
                    className={` form-control ${
                      errors.name ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="email" className="input-label">
                    Your Email <span className="required-icon">*</span>
                  </Label>

                  <input
                    placeholder="Enter password"
                    name="email"
                    type={"text"}
                    id="email"
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />

                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>

                  <Button
                    className="mt-4"
                    style={{ width: "100%" }}
                    color="primary"
                    size="lg"
                  >
                    Join Meeting
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    </div>
  );
};
