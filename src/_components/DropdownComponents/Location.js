import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { locationActions } from "_store";
import { MultiSelectFormGroup } from "_components/formComponents/MultiSelectFormGroup";

export function Location({
  name,
  id,
  label,
  defaultOption,
  validationMessage,
  showValidation,
  mandatory,
}) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  useEffect(() => {
    getDropDown();
  }, []);
  const onSearch = () => {
    getDropDown(search);
  };
  const getDropDown = async function (searchText) {
    await dispatch(locationActions.getLocation(searchText));
  };

  const data = useSelector((state) => state.location.location ?? []);

  return (
    <>
        <MultiSelectFormGroup 
          label={label}
          id={id}
          name={name}
          placeholder={defaultOption}
          options={data.map(({cityid: value, ...rest}) => {return {value, label: `${rest.location}, ${rest.statename}`}})}
          showValidation={showValidation}
          validationMessage={validationMessage}
          mandatory={mandatory}
        />        
    </>
  );
}
