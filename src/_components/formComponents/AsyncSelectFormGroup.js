import React from "react";
import { Label, FormGroup, FormText } from "reactstrap";
import AsyncSelect from "react-select/async";

export function AsyncSelectFormGroup({
  label,
  id,
  name,
  placeholder,
  options = [],
  defaultOption,
  validationMessage,
  showValidation,
  loadOptions,
  mandatory,
  defaultValue,
}) {
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
  return (
    <>
      <FormGroup>
        <Label for={id} className="fw-semi-bold">
          {" "}
          {label}
          {mandatory === true && <span style={{ color: "red" }}>* </span>}
        </Label>
        <AsyncSelect
          name={name}
          placeholder={placeholder}
          defaultOptions={defaultOption}
          loadOptions={loadOptions}
          isMulti={true}
          styles={customStyles}
          defaultValue={defaultValue}
        />
        {showValidation === true && (
          <FormText color="danger">{validationMessage}</FormText>
        )}
      </FormGroup>
    </>
  );
}
