import React, { useEffect } from "react";
import { SelectFormGroup } from "../Job/FormComponents/SelectFormGroup";
import { useDispatch, useSelector } from "react-redux";
import { departmentActions } from "_store";

export function Department({ showValidation, validationMessage, mandatory }) {
  const dispatch = useDispatch();
  useEffect(() => {
    getDropDown();
  }, []);
  const getDropDown = async function () {
    await dispatch(departmentActions.getDepartment());
  };
  let departmentOptions = [];
  departmentOptions = useSelector((state) => state.department.department);
  return (
    <>
      <SelectFormGroup
        label="Department"
        id="department"
        name="department"
        defaultOption="Select Department"
        optionData={departmentOptions.length > 0 ? departmentOptions : []}
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
      />
    </>
  );
}
