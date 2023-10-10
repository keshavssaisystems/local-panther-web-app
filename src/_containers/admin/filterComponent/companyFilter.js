import React from "react";
import { getCompanyDropDown } from "_store";
import AsyncSelect from "react-select/async";


export function CompanyFilter({
  name,
  placeholder,
  onChange,
  isMulti = false
}) {
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
    const { data: {companyDetailsList = []} = {} } = await getCompanyDropDown(inputValue);
    return companyDetailsList.map(({ companyid: value, companyname: label }) => {
        return { value, label };
    });
    }
  };

  return (
    <AsyncSelect
      name={name}
      placeholder={placeholder}
      loadOptions={loadOptions}
      onChange={(e) => onChange(name, e.value)}
      isMulti={isMulti}
    />
  );
}
