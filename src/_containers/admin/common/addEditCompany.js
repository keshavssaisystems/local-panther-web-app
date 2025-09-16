import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { getLocationFilter } from "_store";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import { BsTrash3 } from "react-icons/bs";

import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  Input,
} from "reactstrap";

import InputMask from "react-input-mask";
import { analytics } from "../../../firebase/index";
import debounce from "lodash/debounce";
import "./adminListing.scss";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export const AddEditCompany = (props) => {
  const dispatch = useDispatch();
  const { companyDropdownData } = useSelector(
    (state) => state?.addCustomer ?? {}
  );

  const {
    openModal,
    entity,
    isAddMode,
    data,
    setIsAddMode,
    onClose,
    isViewMode,
  } = props;
  const [logourl, setLogoUrl] = useState(data?.logourl);
  const [editData, setEditData] = useState(data);

  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cityValue, setCityValue] = useState(0);
  const [countryValue, setCountryValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [logo, setLogo] = useState([]);
  const [error, setError] = useState(false);
  const employeeList = useSelector((state) => state.dropdown.employeeList);
  const [companyValidation, setCompanyValidation] = useState(false);

  const [locationValidation, setLocationValidation] = useState(false);
  const [countryValidation, setCountryValidation] = useState(false);
  const [save, setSave] = useState(false);
  useEffect(() => {
    if (!isAddMode) {
      let name = data?.logourl?.replace(/^.*[\\\/]/, "");
      setSelectedFile(name);
    }
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin add/edit company",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  let url = `${process.env.REACT_APP_MAIN_API_URL}`;
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
    company: Yup.string().required("Company is required"),
    industry: Yup.string(),
    city: Yup.string().required("City is required"),
    state: Yup.string(),
    aboutCompany: Yup.string().max(50),
    numOfEmployees: Yup.string(),
    phone: Yup.string(),
    email: Yup.string()
      // .required("Email is required")
      .matches(emailRegex, "Email is not valid"),
    zipcode: Yup.string(),
    countryid: Yup.string().required("Country is required"),
    address: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );

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

  const handleInputChange = (event, check) => {
    let data = { ...editData };
    if (check === "company") {
      data.companyname = event.target.value;
      if (data.company === "") {
        setCompanyValidation(true);
      } else {
        setCompanyValidation(false);
      }
    } else if (check === "industry") {
      data.industry = event.target.value;
    } else if (check === "description") {
      data.description = event.target.value;
    } else if (check === "numberOfEmployees") {
      data.noofemployees = parseInt(event.target.value);
    } else if (check === "email") {
      data.contactemail = event.target.value;
    } else if (check === "phone") {
      data.contactphonenumber = event.target.value;
    } else if (check === "location") {
      data.cityid = parseInt(event.value);
      data.stateid = String(
        cityList?.find((x) => x.cityid === parseInt(event.value))?.stateid
      );
      if (data.cityid === 0) {
        setLocationValidation(true);
      } else {
        setLocationValidation(false);
      }
    } else if (check === "country") {
      data.countryid = parseInt(event.value);

      if (data.countryid === 0) {
        setCountryValidation(true);
      } else {
        setCountryValidation(false);
      }
    } else if (check === "address") {
      data.address = event.target.value;
    } else if (check === "zipcode") {
      data.zipcode = event.target.value;
    }
    setEditData(data);
  };

  const onCancel = (acceptedFiles) => {
    setLogo(null);
    setSelectedFile("");
    setLogoUrl(null);
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

  const getValidation = (event) => {
    event.preventDefault();
    setSave(true);
    event.target.elements.company.value === ""
      ? setCompanyValidation(true)
      : setCompanyValidation(false);
    event.target.elements.city.value === ""
      ? setLocationValidation(true)
      : setLocationValidation(false);
    event.target.elements.countryid.value === ""
      ? setCountryValidation(true)
      : setCountryValidation(false);
    if (
      event.target.elements.company.value !== "" &&
      event.target.elements.city.value !== "" &&
      event.target.elements.countryid.value !== ""
    ) {
      setSave(false);
      onSubmit();
    }
  };

  const onSubmit = async () => {
    var form = new FormData();

    form.append("Companyname", editData.companyname);
    form.append("Industry", editData.industry ? editData.industry : "");
    form.append(
      "Contactemail",
      editData.contactemail ? editData.contactemail : ""
    );
    form.append(
      "Description",
      editData.description ? editData.description : ""
    );
    form.append(
      "Noofemployees",
      editData.noofemployees ? editData.noofemployees : 0
    );
    form.append(
      "Contactphonenumber",
      editData.contactphonenumber ? editData.contactphonenumber : ""
    );
    form.append("Cityid", editData.cityid);
    form.append("Stateid", editData.stateid);
    form.append("Countryid", editData.countryid);
    form.append(
      "CurrentUserId",
      JSON.parse(localStorage.getItem("userDetails"))?.UserId
    );
    form.append("Zipcode", editData.zipcode);
    form.append("Address", editData.address);
    form.append("Logourl", logourl ? logourl : "");
    form.append("Logourlfile", logo?.[0] ? logo[0] : logo);
    if (isAddMode) {
      form.append("Companyid", 0);

      axios
        .post(`${url}/api/Company`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              // showSweetAlert({
              //   title: result.data.message,
              //   type: "success",
              // });
              dispatch(showSnackbar({
                message: result.data.message,
                type: SNACKBAR_TYPES.SUCCESS,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
              }));

            } else {
              // showSweetAlert({
              //   title: result.data.message,
              //   type: "error",
              // });
              dispatch(showSnackbar({
                message: result.data.message,
                type: SNACKBAR_TYPES.ERROR,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
              }));

              setError(true);
            }
          } else {
            setError(true);
            // showSweetAlert({
            //   title: "Something went wrong, please try again later",
            //   type: "warning",
            // });
            dispatch(showSnackbar({
              message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
              type: SNACKBAR_TYPES.ERROR,
              position: SNACKBAR_POSITION.TOP_CENTER,
              autoClose: true,
              autoCloseDelay: 3000,
              maxWidth: 500,
            }));

          }
        })
        .catch((error) => { });
    } else {
      form.append("Companyid", data.companyid);
      axios
        .put(`${url}/api/Company/${data.companyid}`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              // showSweetAlert({
              //   title: result.data.message,
              //   type: "success",
              // });
              dispatch(showSnackbar({
                message: result.data.message,
                type: SNACKBAR_TYPES.SUCCESS,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
              }));
              onClose();
            } else {
              // showSweetAlert({
              //   title: result.data.message,
              //   type: "error",
              // });
              dispatch(showSnackbar({
                message: result.data.message,
                type: SNACKBAR_TYPES.ERROR,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
              }));
              setError(true);
            }
          } else {
            setError(true);
            // showSweetAlert({
            //   title: "Something went wrong, please try again later",
            //   type: "warning",
            // });
            dispatch(showSnackbar({
              message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
              type: SNACKBAR_TYPES.ERROR,
              position: SNACKBAR_POSITION.TOP_CENTER,
              autoClose: true,
              autoCloseDelay: 3000,
              maxWidth: 500,
            }));

          }
        })
        .catch((error) => { });
    }
  };
  const onDrop = (acceptedFiles) => {
    setLogo(acceptedFiles);
    setSelectedFile(acceptedFiles[0]?.name);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .rtf",
  });

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
        <strong className="card-title-text">
          {isViewMode
            ? "View Company Details"
            : isAddMode
              ? "Add New Company"
              : "Edit Company"}
        </strong>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Form onSubmit={(e) => getValidation(e)}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="company">
                    Company <span style={{ color: "red" }}>* </span>
                  </Label>
                  <input
                    type="text"
                    name="company"
                    disabled={isViewMode || props?.isCompanyAdmin}
                    defaultValue={isAddMode ? "" : data?.companyname}
                    onInput={(e) => handleInputChange(e, "company")}
                    placeholder="Enter company"
                    className={`field-input placeholder-text form-control ${companyValidation ? "is-invalid error-text" : "input-text"
                      }`}
                    maxLength={50}
                  />
                  <div className="invalid-feedback">
                    {companyValidation ? "Company is required" : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="industry">Industry</Label>
                  <input
                    type="text"
                    name="industry"
                    disabled={isViewMode}
                    onInput={(e) => handleInputChange(e, "industry")}
                    placeholder="Enter industry"
                    maxLength={200}
                    defaultValue={isAddMode ? "" : data?.industry}
                    className={`field-input placeholder-text form-control `}
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    disabled={isViewMode}
                    name="description"
                    id="description"
                    maxLength={250}
                    onInput={(e) => handleInputChange(e, "description")}
                    placeholder="Enter description"
                    defaultValue={isAddMode ? "" : data?.description}
                    className={`field-input placeholder-text form-control ${errors?.aboutCompany
                      ? "is-invalid error-text"
                      : "input-text"
                      }`}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="employee">No of employees</Label>
                  <Input
                    type="select"
                    name="employee"
                    disabled={isViewMode}
                    id="employee"
                    placeholder="company..."
                    className={`form-control placeholder-name`}
                    onChange={(e) => handleInputChange(e, "numberOfEmployees")}
                  >
                    <option key={0} value={0}>
                      Select no of employee
                    </option>
                    {employeeList?.length > 0 &&
                      employeeList?.map((options) => (
                        <option
                          key={options.id}
                          value={options.id}
                          selected={
                            isAddMode ? 0 : data?.noofemployees === options.id
                          }
                        >
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
                    disabled={isViewMode}
                    type="text"
                    name="phone"
                    maxLength={50}
                    onInput={(e) => handleInputChange(e, "phone")}
                    placeholder="Enter phone"
                    defaultValue={isAddMode ? "" : data?.contactphonenumber}
                    className={`field-input placeholder-text form-control `}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <input
                    type="email"
                    name="email"
                    disabled={isViewMode || props?.isCompanyAdmin}
                    onInput={(e) => handleInputChange(e, "email")}
                    defaultValue={isAddMode ? "" : data?.contactemail}
                    maxLength={50}
                    placeholder="Enter email"
                    className={`field-input placeholder-text form-control ${errors?.email ? "is-invalid error-text" : "input-text"
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
                    isDisabled={isViewMode}
                    placeholder="Search to select"
                    placeholderText="search"
                    loadOptions={loadOptionsDeb}
                    cacheOptions
                    isMulti={false}
                    className={`placeholder-name ${locationValidation ? "async-border-red" : "async-no-error"
                      }`}
                    {...register("city")}
                    onChange={(e) => handleInputChange(e, "location")}
                    defaultValue={
                      isAddMode
                        ? []
                        : {
                          value:
                            data?.cityid +
                            ", " +
                            data?.stateid +
                            ", " +
                            data?.cityname +
                            ", " +
                            data?.statename,
                          label: data?.cityname + ", " + data?.statename,
                        }
                    }
                  />
                  <div className="async-error-text">
                    {locationValidation ? "City, State is required" : ""}
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
                    isDisabled={isViewMode}
                    placeholder="Select country"
                    placeholderText="search"
                    isMulti={false}
                    {...register("countryid")}
                    defaultOptions={countryList}
                    className={`placeholder-name ${countryValidation ? "async-border-red" : "async-no-error"
                      }`}
                    onChange={(e) => handleInputChange(e, "country")}
                    // onMenuOpen={() => checkCityValid()}

                    defaultValue={
                      isAddMode
                        ? []
                        : {
                          value: 1,
                          label: data?.countryname,
                        }
                    }
                  />
                  <div className="async-error-text">
                    {countryValidation ? "Country is required" : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="zipcode">Zip code</Label>
                  <InputMask
                    mask="99999"
                    type="text"
                    disabled={isViewMode}
                    name="zipcode"
                    maxLength={50}
                    onInput={(e) => handleInputChange(e, "zipcode")}
                    placeholder="Enter zipcode"
                    defaultValue={isAddMode ? "" : data?.zipcode}
                    className={`field-input placeholder-text form-control ${errors?.zipcode ? "is-invalid error-text" : "input-text"
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
                    disabled={isViewMode}
                    defaultValue={isAddMode ? "" : data?.address}
                    onInput={(e) => handleInputChange(e, "address")}
                    placeholder="Enter address"
                    maxLength={100}
                    className={`field-input placeholder-text form-control`}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                {!isViewMode && (
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
                )}
              </Col>
            </Row>
            {selectedFile !== "" && (
              <Col>
                <b className="mb-2 d-block mt-2 ">Uploaded logo</b>
                <div>
                  <span className="me-3"> {selectedFile}</span>

                  <BsTrash3
                    className="icons"
                    style={{ cursor: "pointer" }}
                    onClick={() => onCancel()}
                  />
                </div>
              </Col>
            )}
            {!isViewMode && (
              <Button
                className="mt-3 float-end"
                type="submit"
                color="primary"
                disabled={formState.isSubmitting}
              >
                {/* {isAddMode ? "Submit" : "Update"} */}
                Submit
              </Button>
            )}
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
