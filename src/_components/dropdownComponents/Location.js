import React from "react";
import { getLocation } from "_store";
import { AsyncSelectFormGroup } from "_components/formComponents/AsyncSelectFormGroup";

export function Location({
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
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.stateid}, ${rest.countryid}, ${rest.location}, ${rest.statename}, ${rest.countryname}`,
          label: `${rest.location}, ${rest.statename}`,
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
