import React, { useEffect, useState } from "react";

import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
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

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [emailForPassword, setEmailForPassword] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

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
    if (props?.interviewSessionAccessData && getValues("email") !== "") {
      if (props?.interviewSessionAccessData && props?.interviewSessionAccessData?.role?.toLowerCase() === "host"
        && props?.interviewSessionAccessData?.requirelogin === true) {
        navigate("/login", {
          state: {
            redirect: location.pathname,
            email: getValues("email")
          }
        });
        return;
      }
      else if (props?.interviewSessionAccessData && props?.interviewSessionAccessData?.canjoin === true) {
        showSweetAlert({
          title: "The host hasn’t started the meeting yet. Please wait",
          type: "error",
        });
        return;
      }
      else {
        showSweetAlert({
          title: "You’re not authorized to join this meeting.",
          type: "error",
        });
      }
    }

  }, [props.interviewSessionAccessData]);

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
  };
  const routeToHome = () => {
    if (
      localStorage.getItem("userroleid") &&
      (localStorage.getItem("userroleid") === "2" || localStorage.getItem("userroleid") === "4")
    ) {
      navigate("/scheduled-interview");
    } else {
      navigate("/");
    }
  };

  const submitAsGuestUser = () => {
    const values = getValues();
    props.submitGuestUserData({ email: values?.email, name: values?.name });
  }
  function onSubmit(payload) {
    if (props?.fbUsersData?.length > 0) {
      let ind = props.fbUsersData.findIndex(
        (d) => d.email === payload.email && !d.isDenied && !d.isAllowed
      );
      let ind2 = props.fbUsersData.findIndex(
        (d) => d.email === payload.email && d.isDenied && !d.isAllowed
      );
      if (ind > -1) {
        props.submitGuestUserData(payload);

        let users = [...props.fbUsersData];
        users[ind].isJoined = true;
        users[ind].name = payload.name;

        database.ref("users/" + props.urlParams).update(users);
      } else {
        if (ind2 > -1) {
          props.showSweetAlert({
            title: "Access denied. The host did not grant permission.",
            type: "error",
          });
        } else {

          props.checkSessionAccess(payload);
          // showSweetAlert({
          //   title: "You’re not authorized to join this meeting.",
          //   type: "error",
          // });
        }
      }
    }
    else {
      // Open password modal instead of showing error
      // setEmailForPassword(payload.email);
      // setShowPasswordModal(true);
      // setPassword("");
      props.checkSessionAccess(payload);
    }
    // else {
    //   showSweetAlert({
    //     title: "The host hasn’t started the meeting yet. Please wait",
    //     type: "error",
    //   });
    // }
  }
  const handlePasswordSubmit = () => {
    if (password.trim() === "") {
      showSweetAlert({
        title: "Please enter a password",
        type: "error",
      });
      return;
    }

    // Add your password validation logic here
    // For now, this is a placeholder - replace with actual API call or validation
    console.log("Password submitted for email:", emailForPassword, "Password:", password);

    // If password is valid:
    // props.submitGuestUserData({ email: emailForPassword, name: getValues("name"), password });
    // setShowPasswordModal(false);
    // setPassword("");

    // For demo - show error
    showSweetAlert({
      title: "Invalid password",
      type: "error",
    });
    setPassword("");
  };



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
                    Your full name <span className="required-icon">*</span>
                  </Label>
                  <input
                    type="text"
                    name="fullname"
                    id="name"
                    placeholder="Enter your full name"
                    {...register("name")}
                    className={` form-control ${errors.name ? "is-invalid error-text" : "input-text"
                      }`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="email" className="input-label">
                    Your email <span className="required-icon">*</span>
                  </Label>

                  <input
                    placeholder="Enter your email"
                    name="email"
                    type={"text"}
                    id="email"
                    {...register("email")}
                    className={`form-control ${errors.email ? "is-invalid" : ""
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
      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
      <Modal isOpen={showPasswordModal} toggle={() => setShowPasswordModal(false)}>
        <ModalHeader toggle={() => setShowPasswordModal(false)}>
          Enter Password
        </ModalHeader>
        <ModalBody>
          <p>Please enter the password for <strong>{emailForPassword}</strong></p>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handlePasswordSubmit}>
            Submit
          </Button>
          {/* <Button color="primary" onClick={submitAsGuestUser}>
            Join as Guest
          </Button> */}
        </ModalFooter>
      </Modal>
    </div>
  );
};
