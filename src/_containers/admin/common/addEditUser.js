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
  addCustomer,
} from "_containers/admin/_redux/addCustomer.slice";
// import { getState } from '_store/dropdownstate.slice'

import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  FormText,
  Button,
  Input,
} from "reactstrap";
import { async } from "q";
import InputMask from "react-input-mask";

export const AddEditUser = (props) => {
  const { isAddMode, data, isView } = props;
  const [roleId, setRoleId] = useState(0);
  const dispatch = useDispatch();
  const rolesList = useSelector((state) =>
    state.adminListing.rolesList?.filter(
      (x) => x?.userroleid !== 2 && x?.userroleid !== 3
    )
  );

  let url = `${process.env.REACT_APP_PANTHER_URL}`;
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
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
    prefix: Yup.string().required("Prefix is required"),
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

  const createEntity = async (payload) => {
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

    form.append("Prefix", payload.prefix);
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
    if (isAddMode) {
      form.append("UserId", 0);
      axios
        .post(`${url}/api/User/AddUser`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              showSweetAlert({
                title: `${result.data.message}`,
                type: "success",
              });
            } else {
              setError(true);
              showSweetAlert({
                title: `${result.data.message}`,
                type: "warning",
              });
            }
          } else {
            setError(true);
            showSweetAlert({
              title: "Something went wrong, please try again later!!",
              type: "error",
            });
          }
        })
        .catch((error) => {});
    } else {
      form.append("UserId", data.userId);
      axios
        .put(`${url}/api/User/UpdateUser/${data.userId}`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              showSweetAlert({
                title: `${result.data.message}`,
                type: "success",
              });
            } else {
              setError(true);
              showSweetAlert({
                title: `${result.data.message}`,
                type: "waning",
              });
            }
          } else {
            setError(true);
            showSweetAlert({
              title: "Something went wrong, please try again later!!",
              type: "error",
            });
          }
        })
        .catch((error) => {});
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
    return createEntity(data);
  };

  useEffect(() => {
    if (!isAddMode) {
      console.log("NG This is EDIT mode !!!");
      // set default to state, city, companyname
      const formFields = [
        "prefix",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "address",
      ];
      formFields.forEach((field) => {
        // stateid
        setValue(field, data[field]);
      });
      setValue("phonenumber", data["phonenumber"].replace(/[\(\)-]/g, ""));
      setValue("roleid", data["userroleid"]);
      setRoleId(data["userroleid"]);
    }
  }, []);

  const selectRole = (data) => {
    setValue("roleid", data);
    setRoleId(data);
    console.log(getValues("roleid"));
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
                  className={`field-input placeholder-text form-control ${
                    errors?.roleid && roleId === 0
                      ? "is-invalid error-text"
                      : "input-text"
                  }`}
                  {...register("roleid")}
                  onChange={(evt) => selectRole(evt.target.value)}
                >
                  <option key={0} value="">
                    {" "}
                    Select role{" "}
                  </option>
                  {rolesList?.length > 0 &&
                    rolesList?.map((options) => (
                      <option
                        selected={options.userroleid === roleId}
                        key={options.userroleid}
                        value={options.userroleid}
                      >
                        {options.rolename}
                      </option>
                    ))}
                </Input>
                <div className="invalid-feedback">
                  {errors?.roleid && roleId === 0 ? "Role is required" : ""}
                </div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="prefix" className="fw-semi-bold">
                  Prefix <span style={{ color: "red" }}>* </span>
                </Label>
                <input
                  type="text"
                  name="prefix"
                  {...register("prefix")}
                  placeholder="Enter prefix"
                  className={`field-input placeholder-text form-control ${
                    errors?.prefix ? "is-invalid error-text" : "input-text"
                  }`}
                  maxLength={10}
                  disabled={isView}
                />
                <div className="invalid-feedback">
                  {errors?.prefix?.message}
                </div>
              </FormGroup>
            </Col>
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
                  className={`field-input placeholder-text form-control ${
                    errors?.firstname ? "is-invalid error-text" : "input-text"
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
                  className={`field-input placeholder-text form-control ${
                    errors?.lastname ? "is-invalid error-text" : "input-text"
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
                  className={`field-input placeholder-text form-control ${
                    errors?.email ? "is-invalid error-text" : "input-text"
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
                  className={`field-input placeholder-text form-control ${
                    errors?.phonenumber ? "is-invalid error-text" : "input-text"
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
