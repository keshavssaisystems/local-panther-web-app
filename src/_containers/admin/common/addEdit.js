import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useSelector } from "react-redux";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  FormText,
  Button,
} from "reactstrap";

export const AddEdit = (props) => {

  const { entity, isAddMode, selectedRowData } = props;

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // form validation rules 
  const validationSchema = Yup.object().shape({
    company: Yup.string()
      .required('Company is required'),
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    city: Yup.string()
      .required("City is required").max(50),
    state: Yup.string()
      .required("State is required").max(50),
    address: Yup.string().max(50),
    phone: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid")
      .max(20),
    email: Yup.string()
      .required("Email is required")
      .matches(emailRegex, "Email is not valid")
      .max(50),
    zipCode: Yup.string().max(50),

  });

  // functions to build form returned by useForm() hook
  // const { register, handleSubmit, reset, setValue, getValues, formState } = useForm({
  //   resolver: yupResolver(validationSchema)
  // });

  const { register, handleSubmit, reset, setValue, getValues, formState } = useForm({company: ''});



  function createEntity(data) {
    console.log("NG create Entity")
  }

  function updateEntity(selectedRowData, data) {
    console.log("NG Update Entity")
  }
  const stateList = useSelector((state) => state.state.user.data);

  const onSubmit = (data) => {
    console.log("NG data collected", data)
    return (isAddMode
      ? createEntity(data)
      : updateEntity(selectedRowData, data))
  }

  useEffect(() => {
    if (!isAddMode) {
      console.log("NG This is NOT AddMode")
    }
  }, []);

  console.log("NG formState", formState)
  console.log("NG register", register)
  const { errors, isSubmitting } = formState;
  const values = getValues("company");
  console.log("NG values", values)


  return (
    <Row>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="company">
                Company  <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                type="text"
                name="company"
                id="company"
                {...register("company")}
                placeholder="company name..."
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
              <Label for="firstName">
                First name <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                {...register("firstName")} 
                placeholder="First name..."
                className={`field-input placeholder-text form-control ${errors?.firstName
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {props?.data?.firstName?.error ? (
                <FormText color="danger">Please enter first name</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="lastName">
                Last name <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                {...register("lastName")}
                placeholder="Last name..."
                className={`field-input placeholder-text form-control ${errors?.lastName
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {errors?.lastName?.error ? (
                <FormText color="danger">Please enter last name</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="email">
                Email <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                type="text"
                name="email"
                id="email"
                {...register("email")}
                placeholder="Email..."
                className={`field-input placeholder-text form-control ${errors?.email
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {errors?.email?.error ? (
                <FormText color="danger">Please enter email</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="address">
                Address
              </Label>
              <Input
                type="text"
                name="address"
                id="address"
                {...register("address")}
                placeholder="address..."
                className={`field-input placeholder-text form-control ${errors?.address
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {errors?.address?.error ? (
                <FormText color="danger">Please enter address</FormText>
              ) : (
                <></>
              )}
            </FormGroup></Col>
          <Col md={12}>
            <FormGroup>
              <Label for="city">
                City
                <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                type="text"
                name="city"
                id="city"
                {...register("city")}
                placeholder="city..."
                className={`field-input placeholder-text form-control ${errors?.city
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {errors?.city?.error ? (
                <FormText color="danger">Please enter city</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="state">
                State
              </Label>
              <Input
                type="select"
                name="state"
                id="state"
                placeholder="state..."
                className={`field-input placeholder-text form-control ${errors?.state
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              >
                <option key={0}> Select state </option>
                <option value="state1">state1</option>
                <option value="state2">state2</option>
                <option value="state3">state3</option>
                <option value="state4">state4</option>
                {stateList?.length > 0 &&
                  stateList?.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="zipCode">
                Zip code
              </Label>
              <Input
                type="input"
                name="zipCode"
                id="zipCode"
                {...register("zipCode")}
                placeholder="zipCode..."
                className={`field-input placeholder-text form-control ${errors?.zipCode
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {errors?.zipCode?.error ? (
                <FormText color="danger">Please enter zipCode</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="phone">
                Phone
              </Label>
              <Input
                type="input"
                name="phone"
                id="phone"
                {...register("phone")}
                placeholder="phone..."
                className={`field-input placeholder-text form-control ${errors?.phone
                  ? "is-invalid error-text"
                  : "input-text"
                  }`}
              />
              {errors?.phone?.error ? (
                <FormText color="danger">Please enter phone</FormText>
              ) : (
                <></>
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
