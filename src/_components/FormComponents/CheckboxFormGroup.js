import React from "react";
import { Label, Input, FormGroup } from "reactstrap";

export function CheckboxFormGroup({ name, id, label }) {
  return (
    <>
      <FormGroup>
        <Input type="checkbox" name={name} id={id} />
        {"  "}
        <Label check for={id}>
          {" "}
          {label}{" "}
        </Label>
      </FormGroup>
    </>
  );
}
