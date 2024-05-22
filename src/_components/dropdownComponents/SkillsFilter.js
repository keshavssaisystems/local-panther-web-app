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
  defaultValue,
}) {
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 0) {
      let payload = {
        searchText: inputValue,
      };
      const { data = [] } = await getSkillsFilter(payload);
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.skillname}`,
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
        defaultValue={defaultValue}
      />
    </>
  );
}
