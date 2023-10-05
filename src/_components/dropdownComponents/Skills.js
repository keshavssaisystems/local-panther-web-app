import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { MultiSelectFormGroup } from "_components/formComponents/MultiSelectFormGroup";

export function Skills({
  label,
  id,
  name,
  placeholder,
  showValidation,
  validationMessage,
  mandatory,
  onChange,
}) {
  const { data = [] } = useSelector((state) => state?.skill ?? []);

  return (
    <>
      <MultiSelectFormGroup
        label={label}
        id={id}
        name={name}
        placeholder={placeholder}
        options={data.map(({ skillid: value, skillname: label }) => ({
          value,
          label,
        }))}
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
      />
    </>
  );
}
