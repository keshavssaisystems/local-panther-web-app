import React from "react";
import { FormGroup, Input } from "reactstrap";

const TextInput = ({ label, name, value, onChange, placeholder }) => {
  return (
    <FormGroup>
      <Input
        onChange={onChange}
        value={value}
        type="text"
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </FormGroup>
  );
};

export default TextInput;
