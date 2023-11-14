import React from "react";
import { getLocation } from "_store";
import AsyncSelect from "react-select/async";

export function LocationFilter({
  name,
  placeholder,
  onChange,
  isMulti = false,
  value,
}) {
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value,
          label: `${rest.location}, ${rest.statename}`,
        };
      });
    }
  };

  return (
    <AsyncSelect
      name={name}
      placeholder={placeholder}
      loadOptions={loadOptions}
      onChange={(e) => onChange(name, e.value, e)}
      isMulti={isMulti}
      value={value}
    />
  );
}
