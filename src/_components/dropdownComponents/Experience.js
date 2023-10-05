import React from "react";
import { SelectFormGroup } from "../formComponents/SelectFormGroup";

export function Experience({
  name,
  id,
  label,
  defaultOption,
  validationMessage,
  showValidation,
  mandatory,
  max,
}) {
  let experienceOption = [];
  for (let index = 0; index <= max; index++) {
    let options = {
      id: index,
      name: index,
    };
    experienceOption.push(options);
  }
  return (
    <>
      <SelectFormGroup
        label={label}
        id={id}
        name={name}
        defaultOption={defaultOption}
        optionData={experienceOption.length > 0 ? experienceOption : []}
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
      />
    </>
  );
}
