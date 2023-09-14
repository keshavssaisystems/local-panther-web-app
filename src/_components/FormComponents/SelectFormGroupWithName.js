import React from "react";
import { Label, Input, FormGroup, FormText } from "reactstrap";
import "./Form.scss";

export function SelectFormGroupWithName({
  name,
  optionData,
  id,
  label,
  defaultOption,
  validationMessage,
  showValidation,
  mandatory,
  onChange
}) {
  return (
    <>
      <FormGroup>
        <Label for={id} className="fw-semi-bold">
          {" "}
          {label}
          {mandatory === true && <span style={{ color: "red" }}>* </span>}{" "}
        </Label>
        <Input id={id} name={name} type="select" onChange={onChange}>
          <option key={0} value={""}>
            {" "}
            {defaultOption}{" "}
          </option>
          {optionData.length > 0 &&
            optionData.map((options) => (
              <option key={options.id} value={options.id}>
                {" "}
                {options.name}{" "}
              </option>
            ))}
        </Input>
        {showValidation === true && (
          <FormText color="danger">{validationMessage}</FormText>
        )}
      </FormGroup>
    </>
  );
}
