import React, {useEffect} from "react";
import { SelectFormGroup } from '../Job/FormComponents/SelectFormGroup'
import { useDispatch, useSelector } from 'react-redux';
import { employmentModeActions } from '_store';

export function EmploymentMode({ showValidation, validationMessage, mandatory }) {
    const dispatch = useDispatch();
    useEffect(() => {
        getDropDown()
    },[]);
      const getDropDown = async function (){
        await dispatch(employmentModeActions.getEmploymentMode());
      }
      let employmentModeOptions = [];
      // employmentModeOptions = useSelector(state => state.employmentType)
      console.log(employmentModeOptions);
    return (
        <>
           <SelectFormGroup label="Employment Type" id="employmentType" name="employmentType" defaultOption="Eg. Full-time, Part-time etc." optionData={employmentModeOptions.length > 0 ? employmentModeOptions : []} showValidation={showValidation} validationMessage={validationMessage} mandatory={mandatory} />              
        </>
    );
}