import React from "react";
import { Label, FormGroup, FormText } from "reactstrap";
import Select from "react-select";

export function MultiSelectFormGroup({
  label,
  id,
  name,
  placeholder,
  options = [],
  defaultOption,
  validationMessage,
  showValidation,
  onChange
}) {
  return (
    <>
      <FormGroup>
        <Label for={id}> {label} </Label>
        <Select
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          options={options}
          isMulti={true}
          isSearchable={true}
        />
        {showValidation === true && (
          <FormText color="danger">{validationMessage}</FormText>
        )}
      </FormGroup>
    </>
  );
}
