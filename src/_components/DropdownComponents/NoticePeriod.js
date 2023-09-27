import React, { useEffect } from "react";
import { SelectFormGroup } from "../formComponents/SelectFormGroup";
import { useDispatch, useSelector } from "react-redux";
import { noticePeriodActions } from "_store";

export function NoticePeriod({ showValidation, validationMessage }) {
  const dispatch = useDispatch();
  useEffect(() => {
    getDropDown();
  }, []);
  const getDropDown = async function () {
    await dispatch(noticePeriodActions.getNoticePeriod());
  };
  let noticePeriodOptions = useSelector(
    (state) => state.noticePeriod.noticePeriod
  );
  return (
    <>
      <SelectFormGroup
        label="Notice Period"
        id="noticePeriod"
        name="noticePeriod"
        defaultOption="Select notice period"
        optionData={noticePeriodOptions.length > 0 ? noticePeriodOptions : []}
        showValidation={showValidation}
        validationMessage={validationMessage}
      />
    </>
  );
}
