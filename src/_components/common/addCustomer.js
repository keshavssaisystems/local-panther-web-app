import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Form,
  FormGroup,
  Label,
  Input,

  Row,
  Col,
  FormText,
} from "reactstrap";

export const NewCustomer = (props) => {
  console.log("NG props", props)
  const onChangeVal = (evt) => {
  };
  const stateList = useSelector((state) => state.state.user.data);

  const [company, setCompan] = useState(false);
  const [firstName, setFirstName] = useState(false);
  const [lastName, setLastName] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [cityValidation, setCityValidation] = useState(false);
  const [stateOnchange, setStateOnChange] = useState(false);


  function handleSubmit(e) {
    e.preventDefault();
    console.log('NG You clicked submit.',e.target.value);
  }
  return (
    <Row>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label for="company">
                Company  <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                value={props?.data?.company?.value}
                invalid={props?.data?.company?.error}
                type="input"
                name="company"
                id="company"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.company?.error ? (
                <FormText color="danger">Please enter company name</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="firstName">
                First name <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                value={props?.data?.firstName?.value}
                invalid={props?.data?.firstName?.error}
                type="input"
                name="firstName"
                id="firstName"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.firstName?.error ? (
                <FormText color="danger">Please enter company name</FormText>
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
                value={props?.data?.lastName?.value}
                invalid={props?.data?.lastName?.error}
                type="input"
                name="lastName"
                id="lastName"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.lastName?.error ? (
                <FormText color="danger">Please enter company name</FormText>
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
                value={props?.data?.address?.value}
                invalid={props?.data?.address?.error}
                type="input"
                name="address"
                id="address"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.address?.error ? (
                <FormText color="danger">Please enter customer title</FormText>
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
                value={props?.data?.city?.value}
                invalid={props?.data?.city?.error}
                type="input"
                name="city"
                id="city"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.city?.error ? (
                <FormText color="danger">
                  Please enter company city
                </FormText>
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
                value={props?.data?.state?.value}
                invalid={props?.data?.state?.error}
                type="select"
                name="state"
                id="state"
                onChange={(e) => onChangeVal(e)}

              > <option key={0}>
                  Select state
                </option>
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
                value={props?.data?.zipCode?.value}
                invalid={props?.data?.zipCode?.error}
                type="input"
                name="zipCode"
                id="zipCode"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.zipCode?.error ? (
                <FormText color="danger">Please enter zip code</FormText>
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
                value={props?.data?.phone?.value}
                invalid={props?.data?.phone?.error}
                type="input"
                name="phone"
                id="phone"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.phone?.error ? (
                <FormText color="danger">Please enter a valid phone number.</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="email">
                Email
                <span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                value={props?.data?.email?.value}
                invalid={props?.data?.email?.error}
                type="input"
                name="email"
                id="email"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.email?.error ? (
                <FormText color="danger">Please enter contact Email-ID in proper format</FormText>
              ) : (
                <></>
              )}
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <Col>
      </Col>
    </Row>
  );
};
