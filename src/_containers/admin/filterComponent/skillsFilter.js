import React from "react";
import { getSkillsFilter } from "_store";
import AsyncSelect from "react-select/async";

export function SkillsFilter({
  name,
  placeholder,
  onChange,
  isMulti = false,
  value,
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
      {value ? (
        <AsyncSelect
          name={name}
          placeholder={placeholder}
          loadOptions={loadOptions}
          onChange={(e) => onChange(name, e.value, e)}
          isMulti={isMulti}
          value={value}
        />
      ) : (
        <AsyncSelect
          name={name}
          placeholder={placeholder}
          loadOptions={loadOptions}
          onChange={(e) => onChange(name, e.value)}
          isMulti={isMulti}
        />
      )}
    </>
  );
}
