import React from "react";
import { Form, FormGroup, Label, Input, FormText } from "reactstrap";

export const NewCompany = (props) => {
  const onChangeVal = (evt) => {
    props.updateVal(evt);
  };
  return (
    <Form>
      <FormGroup>
        <Label for="newCompName">
          Name <span style={{ color: "red" }}>* </span>
        </Label>
        <Input
          value={props?.data?.newCompName?.value}
          invalid={props?.data?.newCompName?.error}
          type="input"
          name="newCompName"
          id="newCompName"
          onChange={(e) => onChangeVal(e)}
        />
        {props?.data?.newCompName?.error ? (
          <FormText color="danger">Please enter company name</FormText>
        ) : (
          <></>
        )}
      </FormGroup>
      <FormGroup>
        <Label for="newCompDesc">Description</Label>
        <Input
          value={props?.data?.newCompDesc?.value}
          type="textarea"
          name="newCompDesc"
          id="newCompDesc"
          onChange={(e) => onChangeVal(e)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="newCompEmp">No. of Employees</Label>
        <Input
          value={props?.data?.newCompEmp?.value}
          type="input"
          name="newCompEmp"
          id="newCompEmp"
          onChange={(e) => onChangeVal(e)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="newCompAdd">
          Address<span style={{ color: "red" }}>* </span>
        </Label>
        <Input
          value={props?.data?.newCompAdd?.value}
          invalid={props?.data?.newCompAdd?.error}
          type="input"
          name="newCompAdd"
          id="newCompAdd"
          onChange={(e) => onChangeVal(e)}
        />
        {props?.data?.newCompAdd?.error ? (
          <FormText color="danger">Please enter company address</FormText>
        ) : (
          <></>
        )}
      </FormGroup>
      <FormGroup>
        <Label for="newCompState">
          City, State<span style={{ color: "red" }}>* </span>
        </Label>
        <Input
          value={props?.data?.newCompState?.value}
          invalid={props?.data?.newCompState?.error}
          type="input"
          name="newCompState"
          id="newCompState"
          onChange={(e) => onChangeVal(e)}
        />
        {props?.data?.newCompState?.error ? (
          <FormText color="danger">
            Please enter company city and state
          </FormText>
        ) : (
          <></>
        )}
      </FormGroup>
      <FormGroup>
        <Label for="newCompZip">
          Zip Code<span style={{ color: "red" }}>* </span>
        </Label>
        <Input
          value={props?.data?.newCompZip?.value}
          invalid={props?.data?.newCompZip?.error}
          type="input"
          name="newCompZip"
          id="newCompZip"
          onChange={(e) => onChangeVal(e)}
        />
        {props?.data?.newCompZip?.error ? (
          <FormText color="danger">Please enter zip code</FormText>
        ) : (
          <></>
        )}
      </FormGroup>
    </Form>
  );
};
