import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import {
  getStatesList,
  getCitiesList,
  getCompaniesList,
  getCountriesList,
  addCustomer,
} from "_containers/admin/_redux/addCustomer.slice";
import AsyncSelect from "react-select/async";
import { getLocationFilter } from "_store";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";

import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  FormText,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  Input,
} from "reactstrap";
import { async } from "q";
import { addCompany } from "../_redux/addCustomer.slice";
import InputMask from "react-input-mask";
import "./adminListing.scss";

export const AddEditCompany = (props) => {
  const dispatch = useDispatch();
  const { companyDropdownData } = useSelector(
    (state) => state?.addCustomer ?? {}
  );

  const {
    openModal,
    entity,
    isAddMode,
    selectedRowData,
    setIsAddMode,
    onClose,
  } = props;
  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cityValue, setCityValue] = useState(0);
  const [countryValue, setCountryValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [logo, setLogo] = useState([]);
  const [error, setError] = useState(false);
  const employeeList = useSelector((state) => state.dropdown.employeeList);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  let url = `${process.env.REACT_APP_PANTHER_URL}`;
  const authData = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : "";
  const config = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${authData}`,
    },
  };
  useEffect(() => {
    let country_response;
    country_response = cityList.map(({ countryid: value, ...rest }) => {
      return {
        value,
        label: `${rest.countryname}`,
      };
    });

    let data = [];
    if (country_response.length > 0) {
      data = Array.from(new Set(country_response.map((item) => item.id))).map(
        (id) => {
          return country_response.find((item) => item.id === id);
        }
      );
      setCountryList(data);
    } else {
      setCountryList(data);
    }
  }, [cityList]);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  // form validation rules
  const validationSchema = Yup.object().shape({
    company: Yup.string().required("Company is required").max(50),
    industry: Yup.string().max(30),
    city: Yup.string().required("City is required").max(30),
    state: Yup.string(),
    aboutCompany: Yup.string().max(50),
    numOfEmployees: Yup.string(),
    phone: Yup.string()
      // .required("phone is required")
      // .matches(phoneRegExp, "phone number is not valid")
      .max(20),
    email: Yup.string()
      // .required("Email is required")
      .matches(emailRegex, "Email is not valid")
      .max(30),
    zipcode: Yup.string().max(15),
    countryid: Yup.string().required("Country is required"),
    address: Yup.string().max(250),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const loadOptions = async function (inputValue) {
    const { data = [] } = await getLocationFilter(inputValue);
    setCityList(data);

    let filter_data = data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location + ", " + rest.statename}`,
      };
    });

    return filter_data;
  };

  const onSelectCountryDropdown = (data) => {
    setCountryValue(data.value);
    setValue("countryid", String(data.value));
  };

  const setAsyncSelectValue = (data) => {
    setValue("city", String(data.value));
    setCityValue(data.value);
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("state", state);
  };

  const handleInputChange = (event) => {
    setValue("numOfEmployees", event.target.value);
  };

  const onCancel = (acceptedFiles) => {
    setSelectedFile(null);
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
    setSuccess(false);
    setError(false);
    onClose();
  };

  const onSubmit = async (data) => {
    var form = new FormData();
    form.append("Companyid", 0);
    form.append("Companyname", data.company);
    form.append("Industry", data.industry);
    form.append("Contactemail", data.email);
    form.append("Description", data.aboutCompany);
    form.append("Noofemployees", data.numOfEmployees);
    form.append("Contactphonenumber", data.phone);
    form.append("Cityid", data.city);
    form.append("Stateid", data.state);
    form.append("Countryid", data.countryid);
    form.append(
      "CurrentUserId",
      JSON.parse(localStorage.getItem("userDetails"))?.UserId
    );
    form.append("Zipcode", data.zipcode);
    form.append("Address", data.address);
    form.append("Logourl", logo);

    axios
      .post(`${url}/api/Company`, form, config)
      .then((result) => {
        if (result.data) {
          if (result.data.status === "Success") {
            setSuccess(true);
            showSweetAlert({
              title: result.data.message,
              type: "success",
            });
          } else {
            showSweetAlert({
              title: result.data.message,
              type: "error",
            });
            setError(true);
          }
        } else {
          setError(true);
          showSweetAlert({
            title: "Something went wrong, please try again later",
            type: "warning",
          });
        }
      })
      .catch((error) => {});

    // await dispatch(addCompany(payload));
  };
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0].size > 5 * 1024 * 1024) {
      // setSizeError(true);

      return;
    }

    setLogo(acceptedFiles);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .rtf",
  });

  useEffect(() => {
    if (isAddMode) {
      dispatch(getStatesList());
      dispatch(getCitiesList());
      dispatch(getCountriesList());
    } else {
      // console.log("NG This is EDIT mode !!!")
    }
  }, []);

  return (
    <Modal
      isOpen={openModal}
      fullscreen={"lg"}
      size="lg"
      backdrop={"static"}
      toggle={() => onClose()}
      onClosed={() => onClose()}
    >
      <ModalHeader toggle={() => onClose()}>
        <strong className="card-title-text">Add new company</strong>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="company">
                    Company <span style={{ color: "red" }}>* </span>
                  </Label>
                  <input
                    type="text"
                    name="company"
                    {...register("company")}
                    placeholder="Enter company"
                    className={`field-input placeholder-text form-control ${
                      errors?.company ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.company?.message}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="industry">Industry</Label>
                  <input
                    type="text"
                    name="industry"
                    {...register("industry")}
                    placeholder="Enter industry"
                    className={`field-input placeholder-text form-control `}
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label for="aboutCompany">Description</Label>
                  <Input
                    type="textarea"
                    name="aboutCompany"
                    {...register("aboutCompany")}
                    placeholder="Enter description"
                    className={`field-input placeholder-text form-control ${
                      errors?.aboutCompany
                        ? "is-invalid error-text"
                        : "input-text"
                    }`}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="companyname">No of employees</Label>
                  <Input
                    type="select"
                    name="companyname"
                    placeholder="company..."
                    className={`form-control placeholder-name`}
                    onChange={(e) => handleInputChange(e)}
                  >
                    <option key={0} value={0}>
                      Select no of employee
                    </option>
                    {employeeList?.length > 0 &&
                      employeeList?.map((options) => (
                        <option key={options.id} value={options.id}>
                          {options.name}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <InputMask
                    mask="(999)-999-9999"
                    type="text"
                    name="phone"
                    {...register("phone")}
                    placeholder="Enter phone"
                    className={`field-input placeholder-text form-control `}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <input
                    type="email"
                    name="email"
                    {...register("email")}
                    maxLength={50}
                    placeholder="Enter email"
                    className={`field-input placeholder-text form-control ${
                      errors?.email ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.email?.message}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="city" className="fw-semi-bold">
                    City, State <span className="text-danger">*</span>
                  </Label>
                  <AsyncSelect
                    name="city"
                    placeholder="Search to select"
                    placeholderText="search"
                    loadOptions={loadOptions}
                    isMulti={false}
                    className={`placeholder-name ${
                      errors.city && cityValue === 0
                        ? "async-border-red"
                        : "async-no-error"
                    }`}
                    {...register("city")}
                    onChange={(e) => setAsyncSelectValue(e)}
                  />
                  <div className="async-error-text">
                    {errors.city && cityValue === 0
                      ? "City, State is required"
                      : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="country" className="fw-semi-bold">
                    Country <span className="text-danger">*</span>
                  </Label>
                  <AsyncSelect
                    name="country"
                    placeholder="Select country"
                    placeholderText="search"
                    isMulti={false}
                    {...register("countryid")}
                    defaultOptions={countryList}
                    className={`placeholder-name ${
                      errors.countryid && countryValue === 0
                        ? "async-border-red"
                        : "async-no-error"
                    }`}
                    onChange={(e) => onSelectCountryDropdown(e)}
                    // onMenuOpen={() => checkCityValid()}
                  />
                  <div className="async-error-text">
                    {errors.countryid && countryValue === 0
                      ? "City, State is required"
                      : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="zipcode">Zip code</Label>
                  <input
                    type="text"
                    name="zipcode"
                    {...register("zipcode")}
                    placeholder="Enter zipcode"
                    maxLength={50}
                    className={`field-input placeholder-text form-control ${
                      errors?.zipcode ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.zipcode?.message}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <input
                    type="text"
                    name="address"
                    {...register("address")}
                    placeholder="Enter address"
                    maxLength={100}
                    className={`field-input placeholder-text form-control`}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <div className="dropzone-wrapper dropzone-wrapper-sm">
                  <Dropzone
                    onDrop={(e) => onDrop(e)}
                    onFileDialogCancel={onCancel}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                          <p>Upload logo</p>
                          <p>
                            Try dropping some files here, or click to select
                            files to upload.
                          </p>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>
              </Col>
            </Row>
            <Col></Col>
            <Button
              className="mt-3 float-end"
              type="submit"
              color="primary"
              disabled={formState.isSubmitting}
            >
              {/* {isAddMode ? "Submit" : "Update"} */}
              Submit
            </Button>
          </Form>
        </Row>
      </ModalBody>
      {success && (
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
      )}

      {error && (
        <>
          {" "}
          <SweetAlert
            title={showAlert.title}
            show={showAlert.show}
            type={showAlert.type}
            onConfirm={() => setError(false)}
          />
          {showAlert.description}
        </>
      )}
    </Modal>
  );
};
