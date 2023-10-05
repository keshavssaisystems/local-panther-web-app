import React from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormText,
} from "reactstrap";

export const NewCustomer = (props) => {
  const onChangeVal = (evt) => {
    props.onUpdateCustomer(evt);
  };
  return (
    <Row>
      <Form>
        <FormGroup>
          <Label for="custFName">
            First Name<span style={{ color: "red" }}>* </span>
          </Label>
          <Input
            value={props?.data?.custFName?.value}
            invalid={props?.data?.custFName?.error}
            type="input"
            onChange={(e) => onChangeVal(e)}
            name="custFName"
            id="custFName"
          />
          {props?.data?.custFName?.error ? (
            <FormText color="danger">Please enter customer first name</FormText>
          ) : (
            <></>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="custLName">
            Last Name<span style={{ color: "red" }}>* </span>
          </Label>
          <Input
            value={props?.data?.custLName?.value}
            invalid={props?.data?.custLName?.error}
            type="input"
            name="custLName"
            id="custLName"
            onChange={(e) => onChangeVal(e)}
          />
          {props?.data?.custLName?.error ? (
            <FormText color="danger">Please enter customer last name</FormText>
          ) : (
            <></>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="custTitle">
            Title<span style={{ color: "red" }}>* </span>
          </Label>
          <Input
            value={props?.data?.custTitle?.value}
            invalid={props?.data?.custTitle?.error}
            type="input"
            name="custTitle"
            id="custTitle"
            onChange={(e) => onChangeVal(e)}
          />
          {props?.data?.custTitle?.error ? (
            <FormText color="danger">Please enter customer title</FormText>
          ) : (
            <></>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="custEmail">
            Email<span style={{ color: "red" }}>* </span>
          </Label>
          <Input
            value={props?.data?.custEmail?.value}
            invalid={props?.data?.custEmail?.error}
            type="email"
            name="custEmail"
            id="custEmail"
            onChange={(e) => onChangeVal(e)}
          />
          {props?.data?.custEmail?.error ? (
            <FormText color="danger">Please enter customer email</FormText>
          ) : (
            <></>
          )}
        </FormGroup>
        <FormGroup>
          <Label for="custPhone">
            Phone<span style={{ color: "red" }}>* </span>
          </Label>
          <Input
            value={props?.data?.custPhone?.value}
            invalid={props?.data?.custPhone?.error}
            type="input"
            name="custPhone"
            id="custPhone"
            onChange={(e) => onChangeVal(e)}
          />
          {props?.data?.custPhone?.error ? (
            <FormText color="danger">
              Please enter customer phone number
            </FormText>
          ) : (
            <></>
          )}
        </FormGroup>
      </Form>
      <Col>
        <Button color="primary">+ Add another</Button>
      </Col>
    </Row>
  );
};
