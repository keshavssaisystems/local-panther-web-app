import React from "react";

const DropdownstateInput = ({ selectedState, onChange, options, name }) => {
  if (!options) {
    // Data is not available yet, you might want to display a loading indicator here
    return <div>Loading...</div>;
  } else {
  }
  console.log("selectedState", selectedState);
  return (
    <div>
      <select onChange={onChange} value={selectedState} name={name}>
        {" "}
        <option value="" disabled>
          Enter state
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

export default DropdownstateInput;
