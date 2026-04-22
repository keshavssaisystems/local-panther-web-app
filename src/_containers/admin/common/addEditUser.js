import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";

import { Form, FormGroup, Label, Row, Col, Button, Input, FormText } from "reactstrap";

import InputMask from "react-input-mask";
import { analytics } from "../../../firebase/index";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { dropdownActions } from "_store";
import { use } from "react";
import { getCompaniesList } from "_containers/admin/_redux/addCustomer.slice";
export const AddEditUser = (props) => {
  const { isAddMode, data, isView } = props;
  const [roleId, setRoleId] = useState(0);
  const [currentRoleId, setCurrentRoleId] = useState(parseInt(JSON.parse(localStorage.getItem("userDetails"))?.UserroleId) || 0);
  const [companyId, setCompanyId] = useState(parseInt(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0);
  const [isCompanyUserRole, setIsCompanyUserRole] = useState(false);
  let isCompanyAdmin = localStorage.getItem("isCompanyAdmin") ? localStorage.getItem("isCompanyAdmin") === "true" : false;
  const dispatch = useDispatch();
  const rolesList = useSelector((state) => state.adminListing.rolesList);
  console.log(rolesList);
  let url = `${process.env.REACT_APP_MAIN_API_URL}`;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  /*
  companyid
  countryid
  countryname
  customerid
  cityid : city
  stateid : state
  isactive
  title
  userid
  userroleid
  
  companyname : companyname
  firstname
  lastname
  address
  cityname : city
  statename : //need to figure out label for the value
  zipcode
  phonenumber
  email

  */
  // form validation rules
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const validationSchema = Yup.object().shape({
    // prefix: Yup.string().required("Prefix is required"),
    firstname: Yup.string().required("First name is required"),
    middlename: Yup.string(),
    lastname: Yup.string().required("Last name is required"),
    address: Yup.string(),
    phonenumber: Yup.string().required("Phone number is required"),
    email: Yup.string()
      .required("Email is required")
      .matches(emailRegex, "Email is not valid"),
    roleid: Yup.string().required("User role is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // functions to build form returned by useForm() hook
  // const { register, handleSubmit, reset, setValue, getValues, formState } = useForm({
  //   resolver: yupResolver(validationSchema)
  // });

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;
  const customStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: "30px",
      padding: "0 6px",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
  };

  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyValue, setCompanyValue] = useState(null);
  const [companyValidation, setCompanyValidation] = useState(false);
  const [companyDomain, setCompanyDomain] = useState("");
  const createEntity = async (payload) => {
    if (!validateEmailDomain(payload.email)) {
      dispatch(showSnackbar({
        message: `Email must match domain ${companyDomain}`,
        type: "error"
      }));
      return;
    }

    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${authData}`,
      },
    };

    let form = new FormData();

    form.append("Prefix", "");
    form.append("Firstname", payload.firstname);
    form.append("Middlename", payload.middlename);
    form.append("Lastname", payload.lastname);
    form.append("Email", payload.email);
    form.append("Phonenumber", payload.phonenumber);
    form.append("Userroleid", payload.roleid);
    form.append(
      "Rolename",
      rolesList?.find((x) => x.userroleid == payload.roleid)?.rolename
    );
    form.append("Isactive", true);
    form.append(
      "CurrentUserId",
      JSON.parse(localStorage.getItem("userDetails"))?.UserId
    );
    form.append("Profilephotopath", null);
    form.append("ProfileFile", null);
    if ((localStorage.getItem("isCompanyAdmin") && localStorage.getItem("isCompanyAdmin") === "true") || currentRoleId === 4) {
      form.append("Companyname", JSON.parse(localStorage.getItem("userDetails"))?.Companyname);
      form.append("Companyid", JSON.parse(localStorage.getItem("userDetails"))?.CompanyId);
    } else {
      form.append("Companyid", companyValue?.value ? companyValue?.value : 0);
    }

    if (isAddMode) {
      form.append("UserId", 0);

      axios
        .post(`${url}/api/User/AddUser`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              // showSweetAlert({
              //   title: `${result.data.message}`,
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
              setSuccess(false);
              setError(false);
              props.callBack();
            } else {
              setError(true);
              // showSweetAlert({
              //   title: `${result.data.message}`,
              //   type: "warning",
              // });
              dispatch(showSnackbar({
                message: result.data.message,
                type: SNACKBAR_TYPES.ERROR,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 4000,
                maxWidth: 500,
              }));
            }
          } else {
            setError(true);
            // showSweetAlert({
            //   title: "Something went wrong, please try again later!!",
            //   type: "error",
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
      form.append("UserId", data.userId);
      axios
        .put(`${url}/api/User/UpdateUser/${data.userId}`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              // showSweetAlert({
              //   title: `${result.data.message}`,
              //   type: "success",
              // });
              dispatch(showSnackbar({
                message: result.data.message,
                type: SNACKBAR_TYPES.SUCCESS,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 4000,
                maxWidth: 500,
              }));

            } else {
              setError(true);
              // showSweetAlert({
              //   title: `${result.data.message}`,
              //   type: "waning",
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
          } else {
            setError(true);
            // showSweetAlert({
            //   title: "Something went wrong, please try again later!!",
            //   type: "error",
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

  function updateEntity(customerId, data) {
    // update entity here
  }

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
    props.callBack();
  };

  const onSubmit = (data) => {
    if (isCompanyUserRole === true && currentRoleId === 1) {
      if (!companyValue || !companyValue?.value) {
        setCompanyValidation(true);
        // scroll to company field or focus if desired
        return;
      }
      // ensure company id is present in form data
      data.companyId = companyValue.value;
    }
    return createEntity(data);
  };

  useEffect(() => {
    if (!isAddMode) {
      // set default to state, city, companyname
      const formFields = [
        "prefix",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "address",
        "companyId",
      ];
      formFields.forEach((field) => {
        // stateid
        setValue(field, data[field]);
      });
      setValue("phonenumber", data["phonenumber"].replace(/[\(\)-]/g, ""));
      setValue("roleid", data["userroleid"]);
      setRoleId(data["userroleid"]);
      showCompanyDropdown(data["userroleid"]);
      var option = {
        value: data.companyid,
        label: data.companyname,
      }
      setCompanyValue(option);
    }
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin add/edit user",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
    if (isCompanyAdmin === true || currentRoleId === 4) { // super admin should see all companies in dropdown
      const filteredCompany = props?.companiesList?.filter((company) => company.id === companyId);
      if (filteredCompany && filteredCompany.length > 0) {
        setCompanyDomain(filteredCompany[0].emaildomain);
      }
    }

  }, []);

  const selectRole = (data) => {
    setValue("roleid", data);
    setRoleId(data);
    console.log(getValues("roleid"));
  };

  const showCompanyDropdown = (roleid) => {
    if (rolesList) {
      const selectedRole = rolesList.find(x => x.userroleid == roleid);
      if (selectedRole && selectedRole.roletype.toLowerCase() === "company") {
        setIsCompanyUserRole(true);
        return true;
      }
    }
    setIsCompanyUserRole(false);
    return false;
  }

  const getCompany = async (inputValue) => {
    try {
      const companyId =
        Number(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0;
      const response = await dispatch(
        getCompaniesList({
          companyId: companyId,
          companyName: inputValue || "",
        })
      );

      // handle possible response shapes
      const companies = response?.payload?.data || response?.payload?.data?.data || response?.payload || [];

      const companyList = (companies || []).map((company) => ({
        value: company.companyid,
        label: company.companyname + (company.isstaffingfirm ? " (Staffing Firm)" : ""),
        companyDomain: company.emaildomain,
      }));

      setCompanyOptions(companyList);
      return companyList;

    } catch (err) {
      // keep silent or console.log(err) for debugging
      // console.error(err);
    }
  };

  const loadOptionCompany = useCallback(
    async (inputValue) => {
      // return all options when input empty so AsyncSelect shows choices
      const source = await getCompany(inputValue) || [];
      if (!inputValue) return source;
      const filtered = source?.filter((option) =>
        option.label.toLowerCase().includes(inputValue?.toLowerCase())
      );
      return filtered;
    },
    [companyOptions]
  );

  const loadOptionsDebCompany = useCallback(
    debounce((inputValue, callback) => {
      loadOptionCompany(inputValue).then(callback);
    }, 300),
    [loadOptionCompany]
  );

  const getEmailDomain = (email) => {
    if (!email.includes("@")) return "";
    return email.split("@")[1].toLowerCase();
  };


  const validateEmailDomain = (email) => {
    if (companyId === 0) return true; // if no company selected, skip domain validation
    const emailDomain = getEmailDomain(email);

    if (!companyDomain) return false;

    return emailDomain === companyDomain.replace("@", "").toLowerCase();
  };

  const handleCompanyChange = async (companyId) => {
    const company = companyOptions.find(c => c.value == companyId);
    setCompanyDomain(company.companyDomain);
  };

  const getSelectedCompanyDomain = () => {
    const selectedCompany = props?.companiesList?.find(
      (company) => company.companyid === Number(companyId)
    );

    return selectedCompany?.emaildomain?.replace("@", "").toLowerCase() || "";
  };

  return (
    <>
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="role" className="fw-semi-bold">
                  User role <span style={{ color: "red" }}>* </span>
                </Label>
                <Input
                  type="select"
                  name="role"
                  placeholder="role"
                  disabled={isView}
                  className={`field-input placeholder-text form-control ${errors?.roleid && roleId === 0
                    ? "is-invalid error-text"
                    : "input-text"
                    }`}
                  {...register("roleid")}
                  onChange={(evt) => {
                    selectRole(evt.target.value)
                    showCompanyDropdown(evt.target.value)
                  }
                  }
                >
                  <option key={0} value="">
                    {" "}
                    Select role{" "}
                  </option>
                  {currentRoleId === 1 &&  // super admin
                    rolesList?.length > 0 &&
                    rolesList?.map((options) => (
                      <option
                        selected={options.userroleid === roleId}
                        key={options.userroleid}
                        value={options.userroleid}
                        style={{
                          display:
                            options.userroleid === 3
                              ? "none"
                              : "",
                        }}
                      >
                        <div>{options.displayname}</div>
                      </option>
                    ))}
                  {(isCompanyAdmin || currentRoleId === 4) && // company admin
                    rolesList?.length > 0 &&
                    rolesList?.map((options) => (
                      <option
                        selected={options.userroleid === roleId}
                        key={options.userroleid}
                        value={options.userroleid}
                        style={{
                          display: options.userroleid === 2 ? "" : "none",
                        }}
                      >
                        <div>{options.displayname}</div>
                      </option>
                    ))}
                </Input>
                <div className="invalid-feedback">
                  {errors?.roleid && roleId === 0 ? "Role is required" : ""}
                </div>
              </FormGroup>
            </Col>
            {isCompanyUserRole === true && currentRoleId === 1 && <Col md={6}>
              <FormGroup>
                <Label for="role" className="fw-semi-bold">
                  Company <span style={{ color: "red" }}>* </span>
                </Label>
                <AsyncSelect
                  name={"companyId"}
                  placeholder="Search Company"
                  cacheOptions
                  loadOptions={loadOptionsDebCompany}
                  defaultOptions={companyOptions}
                  value={companyValue}
                  className={`field-input placeholder-text ${errors?.companyId && companyId === 0
                    ? "is-invalid error-text"
                    : "input-text"
                    }`}
                  {...register("companyId")}
                  onChange={(val) => {
                    setCompanyId(val?.value);
                    setCompanyValue(val);
                    setCompanyValidation(false);
                    setValue("companyId", val?.value);
                    setCompanyDomain(val?.companyDomain || "");
                  }}
                  isMulti={false}
                  styles={customStyles}
                  invalid={companyValidation === true ? true : false}
                  isDisabled={isView}
                />
                {companyValidation === true && (
                  <FormText color="danger">
                    Please select company
                  </FormText>
                )}

              </FormGroup>
            </Col>}
            <Col md={6}>
              <FormGroup>
                <Label for="firstname">
                  First name <span style={{ color: "red" }}>* </span>
                </Label>
                <input
                  type="text"
                  name="firstname"
                  {...register("firstname")}
                  placeholder="Enter first name"
                  className={`field-input placeholder-text form-control ${errors?.firstname ? "is-invalid error-text" : "input-text"
                    }`}
                  maxLength={50}
                  disabled={isView}
                />
                <div className="invalid-feedback">
                  {errors?.firstname?.message}
                </div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="middlename">Middle name</Label>
                <input
                  type="text"
                  name="middlename"
                  {...register("middlename")}
                  placeholder="Enter middle name"
                  className={`field-input placeholder-text form-control`}
                  maxLength={50}
                  disabled={isView}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="lastname">
                  Last name <span style={{ color: "red" }}>* </span>
                </Label>
                <input
                  type="text"
                  name="lastname"
                  {...register("lastname")}
                  placeholder="Enter last name"
                  className={`field-input placeholder-text form-control ${errors?.lastname ? "is-invalid error-text" : "input-text"
                    }`}
                  maxLength={50}
                  disabled={isView}
                />
                <div className="invalid-feedback">
                  {errors?.lastname?.message}
                </div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="email">
                  Email <span style={{ color: "red" }}>* </span>
                </Label>
                <input
                  type="email"
                  name="email"
                  {...register("email")}
                  placeholder="Enter email"
                  className={`field-input placeholder-text form-control ${errors?.email ? "is-invalid error-text" : "input-text"
                    }`}
                  maxLength={70}
                  disabled={isView}
                />
                <div className="invalid-feedback">{errors?.email?.message}</div>              
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phonenumber">Phone number </Label>{" "}
                <span style={{ color: "red" }}>* </span>
                <InputMask
                  mask="(999)-999-9999"
                  type="text"
                  name="phonenumber"
                  {...register("phonenumber")}
                  placeholder="Enter phone number"
                  className={`field-input placeholder-text form-control ${errors?.phonenumber ? "is-invalid error-text" : "input-text"
                    }`}
                  disabled={isView}
                />
                <div className="invalid-feedback">
                  {errors?.phonenumber?.message}
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
                  className={`field-input placeholder-text form-control`}
                  maxLength={50}
                  disabled={isView}
                />
              </FormGroup>
            </Col>

            <Col></Col>
          </Row>
          {!isView && (
            <Button type="submit" color="primary" className="mt-3 float-end">
              {/* disabled={formState.isSubmitting} */}
              {isAddMode ? "Submit" : "Update"}
            </Button>
          )}
        </Form>
      </Row>
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
    </>
  );
};
