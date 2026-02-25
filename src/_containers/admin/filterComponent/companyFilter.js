import React, { useEffect, useState } from "react";
import { getCompanyDropDown } from "_store";
import AsyncSelect from "react-select/async";

export function CompanyFilter({
  name,
  placeholder,
  onChange,
  isMulti = false,
  value,
  disabled = false,
}) {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    // Load all companies on mount
    (async () => {
      const { data = [] } = await getCompanyDropDown("");
      setDefaultOptions(
        data.map(({ companyid: value, companyname: label }) => ({ value, label }))
      );
    })();
  }, []);

  const loadOptions = async (inputValue) => {
    const search = (inputValue || "").trim().toLowerCase();
    if (!search || search.length < 3) {
      // Return all companies if no input or input is short
      return defaultOptions.filter(option =>
        option.label && option.label.toLowerCase().includes(search)
      );
    } 
    // If input is long enough, use API call
    if (search.length >= 3) {
      const { data = [] } = await getCompanyDropDown(inputValue);
      // If API returns results, use them, else fallback to filtered local
      if (data.length > 0) {
        return data.map(({ companyid: value, companyname: label }) => ({ value, label }));
      }
    }
    //return filtered;
  };

  return (
    <AsyncSelect
      name={name}
      placeholder={placeholder}
      loadOptions={loadOptions}
      defaultOptions={defaultOptions}
      onChange={(e) => onChange(name, e.value, e)}
      isMulti={isMulti}
      value={value}
      isDisabled={disabled}
    />
  );
}
