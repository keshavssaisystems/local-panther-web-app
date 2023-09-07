import React from "react";

const DropdownempmodeInput = ({ selectedEmpMode, onChange, options, name }) => {
  if (!options) {
    // Data is not available yet, you might want to display a loading indicator here
    return <div>Loading...</div>;
  } else {
  }
  console.log("selectedEmpMode", selectedEmpMode);
  return (
    <div>
      <select onChange={onChange} value={selectedEmpMode} name={name}>
        {" "}
        <option value="" disabled>
          Enter employee mode
        </option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownempmodeInput;
