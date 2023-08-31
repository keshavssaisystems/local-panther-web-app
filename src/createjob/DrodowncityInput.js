import React from "react";

const DropdowncityInput = ({ selectedCity, onChange, options, name }) => {
  if (!options) {
    // Data is not available yet, you might want to display a loading indicator here
    return <div>Loading...</div>;
  } else {
  }
  console.log("selectedState", selectedCity);
  return (
    <div>
      <select onChange={onChange} value={selectedCity} name={name}>
        {" "}
        <option value="" disabled>
          Enter city
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

export default DropdowncityInput;
