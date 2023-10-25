import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getStatesList, getCitiesList, getCompaniesList, getCountriesList, addCustomer } from '_containers/admin/_redux/addCustomer.slice'
// import { getState } from '_store/dropdownstate.slice'

import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  FormText,
  Button,
} from "reactstrap";
import { async } from "q";
import { addCompany } from "../_redux/addCustomer.slice";

export const AddEditCompany = (props) => {
  const dispatch = useDispatch()
  const {
    companyDropdownData
  } = useSelector((state) => state?.addCustomer ?? {});

  const { entity, isAddMode, selectedRowData, setIsAddMode } = props;

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // form validation rules 
  const validationSchema = Yup.object().shape({
    company: Yup.string()
      .required('Company is required')
      .max(50),
    industry: Yup.string()
      .required('Industry is required')
      .max(30),
    city: Yup.string()
      .required("City is required").max(30),
    state: Yup.string()
      .required("State is required").max(30),
    country: Yup.string()
      .max(30),
    aboutCompany: Yup.string().max(50),
    numOfEmployees: Yup.string().max(50),
    phone: Yup.string()
      .required("phone is required")
      .matches(phoneRegExp, "phone number is not valid")
      .max(20),
    email: Yup.string()
      .required("Email is required")
      .matches(emailRegex, "Email is not valid")
      .max(30),
    zipcode: Yup.string().max(15),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const { statesList, citiesList, companiesList, countriesList } = useSelector((state) => state.addCustomer);
  // console.log("NG stateList in Add edit component", statesList)
  // console.log("NG citiesList in Add edit component", citiesList)
  console.log("NG countriesList in Add edit component", countriesList)
  
  const createEntity = async(data) => {
    // citiesList.find((cty)=> {return })
    const payload = { companyid: "0", companyname: data.company, contactemail: data.email, contactphonenumber: data.phone, cityid: "0", stateid: data.state, countryid: data.country, currentUserId: "0" }
    console.log("NG Create country payload", payload)
    await dispatch(addCompany(payload))
    // setIsAddMode(false)
  }

  function updateEntity(selectedRowData, data) {
    console.log("NG Update Entity")
  }

  const onSubmit = (data) => {
    return (isAddMode
      ? createEntity(data)
      : updateEntity(selectedRowData, data))
  }

  useEffect(() => {
    if (isAddMode) {
      dispatch(getStatesList())
      dispatch(getCitiesList())
      dispatch(getCountriesList())
    }else {
      console.log("NG This is EDIT mode !!!")
    }
  }, []);

  return (
    <Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="company">
                Company <span style={{ color: "red" }}>* </span>
              </Label>
              <input
                type="text"
                name="company"
                {...register("company")} 
                placeholder="company..."
                className={`field-input placeholder-text form-control ${errors?.company
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.company?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="industry">
                Industry <span style={{ color: "red" }}>* </span>
              </Label>
              <input
                type="text"
                name="industry"
                {...register("industry")}
                placeholder="Last name..."
                className={`field-input placeholder-text form-control ${errors?.industry
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.industry?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="aboutCompany">
                About company
              </Label>
              <input
                type="text"
                name="aboutCompany"
                {...register("aboutCompany")}
                placeholder="aboutCompany..."
                className={`field-input placeholder-text form-control ${errors?.aboutCompany
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.aboutCompany?.message}
              </div>
            </FormGroup>
            </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="numOfEmployees">
                #ofEmployees
              </Label>
              <input
                type="text"
                name="numOfEmployees"
                {...register("numOfEmployees")}
                placeholder="numOfEmployees..."
                className={`field-input placeholder-text form-control ${errors?.numOfEmployees
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.numOfEmployees?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="phone">
                Phone
              </Label>
              <input
                type="text"
                name="phone"
                {...register("phone")}
                placeholder="phone..."
                className={`field-input placeholder-text form-control ${errors?.phone
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.phone?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="email">
                Email <span style={{ color: "red" }}>* </span>
              </Label>
              <input
                type="email"
                name="email"
                {...register("email")}
                placeholder="Email..."
                className={`field-input placeholder-text form-control ${errors?.email
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.email?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="city">
                City
                <span style={{ color: "red" }}>* </span>
              </Label>
              <input
                type="text"
                name="city"
                
                {...register("city")}
                placeholder="city..."
                className={`field-input placeholder-text form-control ${errors?.city
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.city?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="state">
                State
              </Label>
              <select
                name="state"                
                placeholder="state..."
                className={`field-input placeholder-text form-control ${errors?.state
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
                  {...register("state")}
              >
                <option key={0} value=""> Select state </option>
                {statesList?.length > 0 &&
                  statesList?.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </select>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="country">
                Country
              </Label>
              <select
                name="country"
                placeholder="country..."
                className={`field-input placeholder-text form-control ${errors?.country
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
                {...register("country")}
              >
                <option key={0} value=""> Select country </option>
                {countriesList?.length > 0 &&
                  countriesList?.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </select>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="zipcode">
                Zip code
              </Label>
              <input
                type="text"
                name="zipcode"
                
                {...register("zipcode")}
                placeholder="zipcode..."
                className={`field-input placeholder-text form-control ${errors?.zipcode
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              <div className="invalid-feedback">
                {errors?.zipcode?.message}
              </div>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="logo">
                Logo
              </Label>
              <input
                type="file"
                name="logo"
                id="logo"
                // onChange={(e) => onChangeVal(e)}
              />
              {props.logoFile && (
                <img
                  src={URL.createObjectURL(props.logoFile)}
                  alt="Logo Preview"
                  style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "10px" }}
                />
              )}
            </FormGroup>
          </Col>
        </Row>
      <Col>
      </Col>
        <Button type="submit" color="primary" disabled={formState.isSubmitting}>
        {isAddMode ? 'Submit' : 'Update'}
      </Button>
      </Form>
    </Row>
  );
};
