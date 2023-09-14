import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { MultiSelectFormGroup } from "_components/formComponents/MultiSelectFormGroup";

export function Skills({ 
    showValidation, 
    validationMessage, 
    mandatory, 
    onChange 
  }) {


  const {data = []} = useSelector((state) => state?.skill ?? []);
  
  return (
    <>
      <MultiSelectFormGroup
        label="Skills"
        id="skills"
        name="skills"
        defaultOption="Select Skills"
        options={data.map(({skillid: value, skillname: label}) => ({value, label}))}
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
      />
    </>
  );
}
