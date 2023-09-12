import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { locationActions } from "_store";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { Label, Input, FormGroup, FormText } from "reactstrap";

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
  // console.log(search);
  useEffect(() => {
    getDropDown();
  }, []);
  const onSearch = () => {
    getDropDown(search);
  };
  const getDropDown = async function (searchText) {
    await dispatch(locationActions.getLocation(searchText));
  };
  let locationDetails = [];
  locationDetails = useSelector((state) => state.location.location);
  return (
    <>
      <FormGroup>
        <Label for={id} className="fw-semi-bold">
          {" "}
          {label}
          {mandatory === true && <span style={{ color: "red" }}>* </span>}{" "}
        </Label>
        <Input id={id} name={name} type="select">
          <option key="0" value="">
            {defaultOption}
          </option>
          {locationDetails.length > 0 &&
            locationDetails.map((options) => (
              <option
                key={options.cityid}
                value={
                  options.cityid +
                  "," +
                  options.stateid +
                  "," +
                  options.countryid +
                  "," +
                  options.location +
                  "," +
                  options.statename +
                  "," +
                  options.countryname
                }
              >
                {" "}
                {options.location +
                  ", " +
                  options.statename +
                  ", " +
                  options.countryname}{" "}
              </option>
            ))}
        </Input>
        {showValidation === true && (
          <FormText color="danger">{validationMessage}</FormText>
        )}
      </FormGroup>
    </>
  );
}
