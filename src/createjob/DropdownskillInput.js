// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { skillActions } from "_store";

// const DropdownskillInput = () => {
//   const dispatch = useDispatch();
//   const skillData = useSelector((state) => state.skill.user.data);

//   useEffect(() => {
//     dispatch(skillActions.getSkill());
//   }, [dispatch]);

//   if (!skillData) {
//     // Data is not available yet, you might want to display a loading indicator here
//     return <div>Loading...</div>;
//   } else {
//   }
// console.log('skillData',skillData)
//   return (
//     <div className="mb-3">
//       <select>
//         <option value="" disabled selected>
//           Enter skill
//         </option>
//         {skillData.map((item) => (
//           <option key={item.id} value={item.id}>
//             {item.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default DropdownskillInput;






import React from "react";
import { Input } from "reactstrap";

const MultiSelectDropdown = ({ options, selectedOptions, onChange }) => {
  const handleSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selectedValues);
  };

  return (
    <Input type="select" multiple value={selectedOptions} onChange={handleSelectChange}>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </Input>
  );
};

export default MultiSelectDropdown;

