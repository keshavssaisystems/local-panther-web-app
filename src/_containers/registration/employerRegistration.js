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
} from "reactstrap";
import SafeUncontrolledTooltip from "_components/common/SafeUncontrolledTooltip";
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
import { BsPlus, BsArrowLeft } from "react-icons/bs";
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
  const [csError, setCSError] = useState(false);
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
          title: "This company domain is already registered.",
          type: "error",
        });
        return;
      }
    }

    if (selectedComp.value && selectedComp.value !== "0") {
      let ind = formData?.empemail?.indexOf(selectedComp?.email?.split("@")[1]);
      if (ind === -1) {
        showSweetAlert({
          title:
            "This email doesn’t match the company’s domain. Please use your company email to continue.",
          type: "error",
        });
        return;
      }
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
      <span style={{ cursor: "pointer", color: "#038FFE", display: "flex", alignItems: "center", gap: "4px" }}>
        <BsPlus size={16} color="#038FFE" />
        Add New Company
      </span>
    );
  };
  const addNewCompany = () => {
    //Added for bypass validation
    setValue("companyemail", "sample@gmail.com");
    setValue("companyname", "");

    setSelectedComp({ value: "0", label: "New Company", email: "" });
  };

  const backToSearch = () => {
    setSelectedComp(null);
    setValue("companyemail", "");
    setValue("companyname", "");
    setCSError(false);
  };
  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );

  const loadOptions = async function (inputValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (emailRegex.test(inputValue)) {
      setCSError(false);
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
    } else {
      setCSError(true);
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
    let permission = "denied";
      try {
        if ('Notification' in window) {
          permission = await Notification?.requestPermission();
        }
      } catch (e) { console.log(e) }
    let ipdata = await getPublicIP();
    if (ipdata?.ip) {
      localStorage.setItem("publicip", ipdata.ip);
    }
    if (permission === "granted") {
      // Generate Token
      const token = await messaging?.getToken({
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
      if (
        localStorage.getItem("referralLogdata") &&
        JSON.parse(localStorage.getItem("referralLogdata"))?.companyid
      ) {
        let logData = JSON.parse(localStorage.getItem("referralLogdata"));
        const userAgent = navigator.userAgent;
        let os = "Unknown OS";

        if (userAgent.indexOf("Win") != -1) os = "Windows";
        if (userAgent.indexOf("Mac") != -1) os = "MacOS";
        if (userAgent.indexOf("X11") != -1) os = "UNIX";
        if (userAgent.indexOf("Linux") != -1) os = "Linux";
        if (userAgent.indexOf("Android") != -1) os = "Android";
        if (userAgent.indexOf("like Mac") != -1) os = "iOS";
        let payload = {
          referralLogUrl: window.location.href,
          companyName: logData?.companyName,
          // companyid: 0,
          osversion: "string",
          ipaddress: localStorage.getItem("publicip")
            ? localStorage.getItem("publicip")
            : "Web",
          loginsource: "Web",
          logindeviceid: os,
          logindevice: os,
          currentUserId: localStorage.getItem("userId")
            ? Number(localStorage.getItem("userId"))
            : 0,
        };
        console.log(payload);
        dispatch(
          authActions.putCompanyReferralLogs({
            id: logData?.companyreferrallogid,
            payload,
          })
        );
        localStorage.removeItem("referralLogdata");
      }
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
      {!selectedComp?.value || (selectedComp?.value && selectedComp?.value !== "0") ? (
        <Row>
          <Col md={8}>
            <FormGroup>
              <Label for={"mustHave"} className="fw-semi-bold">
                Select Company <span style={{ color: "red" }}>* </span>
                {!selectedComp?.value && (
                  <>
                    <SafeUncontrolledTooltip
                      placement="bottom"
                      target={"info-no-comp"}
                    >
                      If your company is already registered, it will appear in the search result.
                    </SafeUncontrolledTooltip>
                    <img
                      id="info-no-comp"
                      src={infoIcon}
                      alt="info icon"
                      height={14}
                      width={14}
                    />
                  </>
                )}
                {selectedComp?.value && selectedComp?.value !== "0" && (
                  <>
                    <SafeUncontrolledTooltip
                      placement="bottom"
                      target={"info-new-comp"}
                    >
                      Your account will be created under this company with the role of Hiring Manager.
                    </SafeUncontrolledTooltip>
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

              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <AsyncCreatableSelect
                    name="mustHave"
                    placeholder="Enter your work email to find your company"
                    loadOptions={loadOptionsDeb}
                    value={selectedComp}
                    onChange={(evt) => {
                      onCompanySelected(evt);
                    }}
                    formatCreateLabel={() => null}
                    className={csError ? "comp-search-reg-error " : "comp-search-reg"}
                    classNamePrefix="react-select"
                  />
                  <div style={{ fontSize: "12px", color: "#6c757d", marginTop: "4px" }}>
                    Example: johndoe@companyname.com
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={addNewCompany}
                  style={{
                    background: "#038FFE",
                    border: "none",
                    color: "white",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    whiteSpace: "nowrap",
                    height: "fit-content",
                  }}
                >
                  <BsPlus size={16} color="white" />
                  Add New Company
                </Button>
              </div>
              {csError && (
                <div style={{ color: "red", marginTop: "4px" }}>
                  Please enter valid domain name for company search
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        {selectedComp?.value && selectedComp?.value === "0" && (
          <Row className="mb-3">
            <Col>
              <Button
                type="button"
                onClick={backToSearch}
                style={{
                  background: "#038FFE",
                  border: "none",
                  color: "white",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                <BsArrowLeft size={16} color="white" />
                Back to Search
              </Button>
            </Col>
          </Row>
        )}
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
                  placeholder="Company name"
                  {...register("companyname")}
                  className={`form-control placeholder-name ${errors.companyname ? "is-invalid" : ""
                    }`}
                  maxLength={50}
                />
                <FormFeedback>{errors.companyname?.message}</FormFeedback>
              </FormGroup>
            </Col>
            {/* {selectedComp?.value && selectedComp.value !== "0" && ( */}
            {(!selectedComp?.value) && (
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
                      placeholder="Company email id"
                      {...register("companyemail")}
                      className={`form-control placeholder-name ${errors.companyemail ? "is-invalid" : ""
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
                  placeholder={
                    selectedComp.value && selectedComp.value === "0"
                      ? "Contact person name"
                      : "Hiring manager name"
                  }
                  {...register("empname")}
                  className={`form-control placeholder-name ${errors.empname ? "is-invalid" : ""
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
                    ? "Company Admin Mobile"
                    : "Hiring Manager Mobile"}{" "}
                  <span className="text-danger">*</span>
                </Label>

                <InputGroup>
                  <InputMask
                    placeholder={
                      selectedComp.value && selectedComp.value === "0"
                        ? "Admin mobile number"
                        : "Hiring manager mobile number"
                    }
                    type="text"
                    mask="(999)-999-9999"
                    name="empphone"
                    id="empphone"
                    {...register("empphone")}
                    className={`form-control placeholder-name ${errors.empphone ? "is-invalid" : ""
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
                    ? "Company Admin Email"
                    : "Hiring Manager Email"}{" "}
                  <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <input
                    type="email"
                    name="empemail"
                    id="empemail"
                    placeholder={
                      selectedComp.value && selectedComp.value === "0"
                        ? "Company admin email id"
                        : "Hiring manager email id"
                    }
                    {...register("empemail")}
                    className={`form-control placeholder-name ${errors.empemail ? "is-invalid" : ""
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
            >
              {/* Already a member? Sign in */}
              Already Registered?{" "}
                      <span style={{ textDecoration: "underline", color: "#038FFE" }}>
                        Login Here
                      </span>
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
