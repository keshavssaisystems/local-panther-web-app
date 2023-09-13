import React, { useEffect } from "react";
import { SelectFormGroup } from "../formComponents/SelectFormGroup";
import { useDispatch, useSelector } from "react-redux";
import { employmentModeActions } from "_store";

export function EmploymentMode({
  showValidation,
  validationMessage,
  mandatory,
  defaultOption,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    getDropDown();
  }, []);
  const getDropDown = async function () {
    await dispatch(employmentModeActions.getEmploymentMode());
  };
  let employmentModeOptions = [];
  employmentModeOptions = useSelector((state) => state.employmentMode);
  return (
    <>
      <SelectFormGroup
        label="Employment Type"
        id="employmentType"
        name="employmentType"
        defaultOption={defaultOption}
        optionData={
          employmentModeOptions.employmentMode.length > 0
            ? employmentModeOptions.employmentMode
            : []
        }
        showValidation={showValidation}
        validationMessage={validationMessage}
        mandatory={mandatory}
      />
    </>
  );
}
