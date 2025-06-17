import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  FormFeedback,
  FormGroup,
  Label,
  InputGroup,
  Modal,
  Card,
  CardBody,
  CardFooter,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import AsyncCreatableSelect from "react-select/async-creatable";
import { debounce } from "lodash";
import { postCompanySearch } from "_store";
import { authActions } from "_store";
import { useDispatch } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import emailVerify from "../../assets/utils/images/emailverify.svg";
import infoIcon from "../../assets/utils/images/info-circle-fill-blue.svg";
import { messaging } from "../../firebase";
import { getPublicIP } from "_helpers/helper";

export function EmployerRegistration() {
  const dispatch = useDispatch();
  const [selectedComp, setSelectedComp] = useState(null);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [showEmailOtp, setEmailForm] = useState(false);
  const otpLength = ["1", "2", "3", "4", "5", "6"];
  const [saveOTP, setSaveOTP] = useState([]);

  const [otp, setOtp] = useState({
    mobile: "",
    email: "",
  });
  const [data, setData] = useState({});
  // form validation rules
  const validationSchema = Yup.object().shape({
    companyname: Yup.string().required("Company name is required"),

    companyemail: Yup.string()
      .required("Company Email Id is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please enter valid email"
      ),
    empname: Yup.string()
      .required("Hiring Manager name is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
    empemail: Yup.string()
      .required("Hiring Manager Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please enter valid email"
      ),
    empphone: Yup.string().required("Hiring Manager Phone number is required"),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm(formOptions);
  const { errors, isValid } = formState;
  async function onSubmit(formData) {
    if (selectedComp.value === "0") {
      let data = await postCompanySearch(getValues("empemail"));
      if (data?.data?.companyDetailsList?.length > 0) {
        showSweetAlert({
          title: "User with the same domain already exists in our system.",
          type: "error",
        });
      }
      return;
    }
    let name = formData.empname.split(" ");
    let payload = {
      email: getValues("empemail"),
      type: "email",
      userroleid: 2,
      firstname: name[0],
      phonenumber: getValues("empphone").replace(/\D/g, ""),
      lastname: name.length > 1 ? name[name.length - 1] : "",
    };

    let response = await dispatch(authActions.userRegisterThunk(payload));
    if (response?.payload && response?.payload?.statusCode === 201) {
      setEmailForm(true);
      setData(response?.payload?.data);
    } else {
      showSweetAlert({
        title: response?.error?.message,
        type: "error",
      });
    }
  }

  const formatCreateLabel = () => {
    return (
      <span style={{ cursor: "pointer", color: "#052f5f" }}>
        Add new company +{" "}
      </span>
    );
  };
  const addNewCompany = () => {
    //Added for bypass validation
    setValue("companyemail", "sample@gmail.com");
    setValue("companyname", "");

    setSelectedComp({ value: "0", label: "New Company", email: "" });
  };
  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );

  const loadOptions = async function (inputValue) {
    const { data = [] } = await postCompanySearch(inputValue);
    if (data.companyDetailsList.length > 0) {
      let filter_data = data.companyDetailsList.map((data) => {
        return {
          value: data.companyid,
          label: data.companyname,
          email: data.contactemail,
        };
      });

      return filter_data;
    } else {
      return [];
    }
  };
  const onCompanySelected = (evt) => {
    setValue("companyemail", evt.email);
    setValue("companyname", evt.label);
    setSelectedComp(evt);
  };

  const showSweetAlert = ({ title, type, redirect = false }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    data.redirect = redirect;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    if (data.redirect) {
      regEmpLogin();
    }
    SetShowAlert(data);
  };
  const regEmpLogin = async () => {
    let payload = {};
    let name = getValues("empname").split(" ");
    if (selectedComp?.value !== "0") {
      payload = {
        companyid: selectedComp?.value,
        email: getValues("empemail"),
        firstname: name[0],
        lastname: name.length > 1 ? name[name.length - 1] : "",
        isEditEmail: false,
        isEditPhone: false,
        isRegistration: true,
        isSendEmail: true,
        isSendPhone: false,
        pageTitle: "Enter Code",
        phonenumber: getValues("empphone").replace(/\D/g, ""),
        registrationID: data?.userregistrationid,
        type: "email",
        userroleid: 2,
      };
    } else {
      payload = {
        email: getValues("empemail"),
        firstname: name[0],
        lastname: name.length > 1 ? name[name.length - 1] : "",
        isEditEmail: false,
        isEditPhone: false,
        isRegistration: true,
        isSendEmail: true,
        isSendPhone: false,
        pageTitle: "Enter Code",
        phonenumber: getValues("empphone").replace(/\D/g, ""),
        registrationID: data?.userregistrationid,
        type: "email",
        userCompany: {
          companycontactemail: getValues("empemail"),
          companycontactphonenumber: getValues("empphone").replace(/\D/g, ""),
          companyid: 0,
          companyname: getValues("companyname"),
        },
        userroleid: 2,
      };
    }
    const permission = await Notification.requestPermission();
    let ipdata = await getPublicIP();
    if (ipdata?.ip) {
      localStorage.setItem("publicip", ipdata.ip);
    }
    if (permission === "granted") {
      // Generate Token
      const token = await messaging.getToken({
        vapidKey:
          "BHjlQysiVHS7rlDZRZpJC1mD8g9I8zm7l0bDS2cOKZOHD1-s0nmcACoFXkHZtowJ3v3MFS_kTU94lfMBA8o111c",
      });
      payload.firebasetoken = token;
    } else if (permission === "denied") {
      console.log("You denied for the notification");
    }
    let res = await dispatch(
      authActions.putRegisterCustomer({
        payload,
        userRegistrationId: data?.userregistrationid,
      })
    );

    if (res.payload) {
      //need to redirect
    } else {
      showSweetAlert({
        title: res.error.message,
        type: "error",
      });
    }
  };
  const handleInputChange = (check, e, index) => {
    let new_data = [...saveOTP];
    let otp_new = { ...otp };

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
    }
  };

  const verifyEmailOTPDetails = async function (otp) {
    let response = await dispatch(
      authActions.verifyOTPThunk({
        userRegistrationId: data?.userregistrationid,
        otpDetails: {
          userregistrationid: data?.userregistrationid,

          emailotp: otp.email,
          type: "email",
        },
      })
    );

    if (response.payload) {
      setEmailForm(false);
      showSweetAlert({
        title: response.payload.message,
        type: "success",
        redirect: true,
      });
    } else {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    }
  };

  const resendOTP = (e) => {
    onSubmit(getValues());
  };
  return (
    <>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for={"mustHave"} className="fw-semi-bold">
              Select Company <span style={{ color: "red" }}>* </span>
              {selectedComp?.value && selectedComp?.value === "0" && (
                <>
                  <UncontrolledTooltip
                    placement="bottom"
                    target={"info-new-comp"}
                  >
                    When you add a new company, an hiring manager profile will
                    be created automatically.
                  </UncontrolledTooltip>
                  <img
                    id="info-new-comp"
                    src={infoIcon}
                    alt="info icon"
                    height={14}
                    width={14}
                  />
                </>
              )}
            </Label>

            <AsyncCreatableSelect
              name="mustHave"
              placeholder="Search company using your email"
              loadOptions={loadOptionsDeb}
              value={selectedComp}
              // defaultOptions={[{ value: "", key: "" }]}
              // value={
              //   type === "new_template" &&
              //   previousStep !== 3 &&
              //   keyQualicationChange === false
              //     ? []
              //     : previousStep === 3
              //     ? keyQualificationArr1
              //     : prevKeyQualificationArr1
              // }
              // onKeyDown={(e) => handleKeyDown(e)}
              isValidNewOption={() => true}
              onChange={(evt) => {
                onCompanySelected(evt);
              }}
              allowCreateWhileLoading={true}
              formatCreateLabel={formatCreateLabel}
              onCreateOption={addNewCompany}
            />
          </FormGroup>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {selectedComp?.value && (
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="companyname" className="input-label">
                  Company Name <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  name="companyname"
                  disabled={selectedComp?.value && selectedComp?.value !== "0"}
                  id="companyname"
                  placeholder="Enter company name"
                  {...register("companyname")}
                  className={`form-control placeholder-name ${
                    errors.companyname ? "is-invalid" : ""
                  }`}
                  maxLength={50}
                />
                <FormFeedback>{errors.companyname?.message}</FormFeedback>
              </FormGroup>
            </Col>
            {selectedComp?.value && selectedComp.value !== "0" && (
              <Col md={6}>
                <FormGroup>
                  <Label for="companyemail" className="input-label">
                    Company Email <span className="text-danger">*</span>
                  </Label>
                  <InputGroup>
                    <input
                      type="email"
                      name="companyemail"
                      id="companyemail"
                      disabled={
                        selectedComp?.value && selectedComp?.value !== "0"
                      }
                      placeholder="Enter company email id"
                      {...register("companyemail")}
                      className={`form-control placeholder-name ${
                        errors.companyemail ? "is-invalid" : ""
                      }`}
                      maxLength={50}
                      autoComplete="off"
                    />

                    <FormFeedback>{errors.companyemail?.message}</FormFeedback>
                  </InputGroup>
                </FormGroup>
              </Col>
            )}
            <Col md={6}>
              <FormGroup>
                <Label for="empname" className="input-label">
                  {selectedComp.value && selectedComp.value === "0"
                    ? "Contact Person Name"
                    : "Hiring Manager Name"}{" "}
                  <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  name="empname"
                  id="empname"
                  placeholder="Enter contact person name"
                  {...register("empname")}
                  className={`form-control placeholder-name ${
                    errors.empname ? "is-invalid" : ""
                  }`}
                  maxLength={50}
                />
                <FormFeedback>{errors.empname?.message}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="empphone" className="input-label">
                  {selectedComp.value && selectedComp.value === "0"
                    ? "Contact Person Mobile"
                    : "Hiring Manager Mobile"}{" "}
                  <span className="text-danger">*</span>
                </Label>

                <InputGroup>
                  <InputMask
                    placeholder="Enter contact person mobile number"
                    type="text"
                    mask="(999)-999-9999"
                    name="empphone"
                    id="empphone"
                    {...register("empphone")}
                    className={`form-control placeholder-name ${
                      errors.empphone ? "is-invalid" : ""
                    }`}
                  />

                  <FormFeedback>{errors.empphone?.message}</FormFeedback>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="empemail" className="input-label">
                  {selectedComp.value && selectedComp.value === "0"
                    ? "Contact Person Email"
                    : "Hiring Manager Email"}{" "}
                  <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <input
                    type="email"
                    name="empemail"
                    id="empemail"
                    placeholder="Enter contact person email id"
                    {...register("empemail")}
                    className={`form-control placeholder-name ${
                      errors.empemail ? "is-invalid" : ""
                    }`}
                    maxLength={50}
                    autoComplete="off"
                  />

                  <FormFeedback>{errors.empemail?.message}</FormFeedback>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        )}
        <div className="mt-4 d-flex align-items-center">
          <h5 className="mb-0 account-text ms-auto me-4">
            <Link
              to="/login"
              className="pb-text"
              style={{ borderBottom: "1px solid #545cd8" }}
            >
              Already a member? Sign in
            </Link>
          </h5>
          <div>
            <Button
              disabled={!isValid}
              color="primary"
              className=" btn-text"
              size="lg"
            >
              Next
            </Button>
          </div>
        </div>
      </Form>
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
      <Modal
        className="modal-reject-align registration-container"
        size="md"
        isOpen={showEmailOtp}
      >
        <Card>
          <CardBody>
            <div className="justify-content-center align-items-center text-center mb-4">
              <div>
                <img
                  src={emailVerify}
                  className="mb-4 mt-4"
                  width="80px"
                  alt="logo"
                />
              </div>
              <div className="font-size-lg fw-semi-bold">
                <p className="otp-header-text">
                  <h3>Verify Your Email</h3>
                </p>
              </div>

              <div className="font-size-md  fw-normal">
                To proceed, please enter the code sent to
              </div>
              <div style={{ color: "#545cd8" }}>{getValues("empemail")}</div>
            </div>

            <div>
              <Form>
                <div className="d-flex justify-content-center align-items-center">
                  {otpLength?.map((item, index) => (
                    <FormGroup className="m-2">
                      <Input
                        type="text"
                        name="otp"
                        id={`email-${index}`}
                        maxLength="1"
                        style={{ fontSize: "24px" }}
                        className="form-control placeholder-name text-center"
                        onInput={(e) =>
                          handleInputChange("email", e.target.value, index)
                        }
                        onPaste={(e) => handlePaste(e, "email")}
                      />
                    </FormGroup>
                  ))}
                </div>
              </Form>
              <Row>
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center">
                    Don't received code ?
                    <Button color="link" onClick={() => resendOTP("email")}>
                      Resend code
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row className="mt-1">
                <Col>
                  <div className="ms-auto d-flex justify-content-center align-items-center"></div>
                </Col>
              </Row>
            </div>
          </CardBody>
          <CardFooter>
            <div className="me-auto ms-auto justify-content-center align-items-center">
              <Button
                color="secondary"
                className="btn"
                onClick={() => setEmailForm(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="m-2"
                style={{ background: "#2f479b" }}
                onClick={() => verifyEmailOTPDetails(otp)}
              >
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Modal>
    </>
  );
}
