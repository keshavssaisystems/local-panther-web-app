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
  loadOptions
}) {
  return (
    <>
      <FormGroup>
        <Label for={id}> {label} </Label>
        <AsyncSelect
          name
          placeholder
          defaultOptions={true}
          loadOptions={loadOptions}
          isMulti={true}
      />
        {showValidation === true && (
          <FormText color="danger">{validationMessage}</FormText>
        )}
      </FormGroup>
    </>
  );
}
