import React from "react";
import { getSkillsFilter } from "_store";
import { AsyncSelectFormGroup } from "_components/formComponents/AsyncSelectFormGroup";

export function SkillsFilter({
  name,
  id,
  label,
  defaultOption,
  validationMessage,
  showValidation,
  mandatory,
}) {
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const { data = [] } = await getSkillsFilter(inputValue);
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value,
          label: `${rest.skillname}`,
        };
      });
    }
  };

  return (
    <>
      <AsyncSelectFormGroup
        label={label}
        id={id}
        name={name}
        placeholder={defaultOption}
        loadOptions={loadOptions}
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
      />
    </>
  );
}
