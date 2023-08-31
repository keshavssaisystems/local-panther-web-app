import React from "react";
import { FormGroup, Input } from "reactstrap";

const NumberInput = ({ label, name, value, onChange, placeholder }) => {
  return (
    <FormGroup>
      <Input
        onChange={onChange}
        value={value}
        type="number"
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </FormGroup>
  );
};

export default NumberInput;
