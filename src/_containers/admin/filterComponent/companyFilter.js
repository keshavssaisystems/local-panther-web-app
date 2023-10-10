import React from "react";
import { getCompanyFilter } from "_store";
import AsyncSelect from "react-select/async";

export function CompanyFilter({
  name,
  placeholder,
  isMulti = false
}) {
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
    const { data = [] } = await getCompanyFilter(inputValue);

    return data.map(({ skillid: value, ...rest }) => {
        return {
        value,
        label: `${rest.skillname}`,
        };
    });
    }
  };

  return (
    <AsyncSelect
      name={name}
      placeholder={placeholder}
      loadOptions={loadOptions}
      isMulti={isMulti}
    />
  );
}
