import React, {useEffect} from "react";
import { SelectFormGroup } from '../Job/FormComponents/SelectFormGroup'
import { useDispatch, useSelector } from 'react-redux';
import { remoteStatusActions } from '_store';

export function RemoteStatus({ showValidation, validationMessage, mandatory }) {
    const dispatch = useDispatch();
    useEffect(() => {
        getDropDown()
      },[]);
      const getDropDown = async function (){
        await dispatch(remoteStatusActions.getRemoteStatus());
      }
      let remoteStatusOptions = [];
      // remoteStatusOptions = useSelector(state => state.remoteStatus.remoteStatus);
    return (
        <>
           <SelectFormGroup label="Remote Status" id="remoteStatus" name="remoteStatus" defaultOption="Select Remote Status" optionData={remoteStatusOptions.length > 0 ? remoteStatusOptions : []} showValidation={showValidation} validationMessage={validationMessage} mandatory={mandatory} />              
        </>
    );
}