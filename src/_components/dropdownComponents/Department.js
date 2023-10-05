import React, { useEffect } from "react";
import { SelectFormGroupWithName } from "../formComponents/SelectFormGroupWithName";
import { useDispatch, useSelector } from "react-redux";
import { departmentActions, skillActions } from "_store";

export function Department({ 
    showValidation, 
    validationMessage, 
    mandatory, 
    onChange 
  }) {

  const dispatch = useDispatch();
  useEffect(() => {
    getDropDown();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDropDown = async function () {
    await dispatch(departmentActions.getDepartment());
  };

  let departmentOptions = [];
  departmentOptions = useSelector((state) => state.department.department);

  const handleChange = (e) => {
    const { target: { value } } = e;
    dispatch(skillActions.getSkill(value));
    onChange(e);
  }

  return (
    <>
      <SelectFormGroupWithName
        label="Department"
        id="department"
        name="department"
        defaultOption="Select Department"
        optionData={departmentOptions.length > 0 ? departmentOptions : []}
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
        onChange={handleChange}
      />
    </>
  );
}
