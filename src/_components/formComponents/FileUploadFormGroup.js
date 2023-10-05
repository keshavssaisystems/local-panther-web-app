import React from "react";
import { Label, Input, FormGroup, FormText } from "reactstrap";
import "./Form.scss";

export function FileUploadFormGroup({
  name,
  id,
  label,
  mandatory,
  showValidation,
  validationMessage,
  additionalClassName,
}) {
  return (
    <>
      <FormGroup>
        <Label for={id} className="fw-semi-bold">
          {" "}
          {label}
          {mandatory === true && <span style={{ color: "red" }}>* </span>}
        </Label>
        <Input id={id} name={name} type={"file"} />
        <FormText className={"float-end text-mute" + additionalClassName}>
          Supported Formats: doc, docx, pdf, upto 5 MB
        </FormText>
        {showValidation === true && (
          <FormText color="danger">{validationMessage}</FormText>
        )}
        <div className={additionalClassName}></div>
      </FormGroup>
    </>
  );
}
