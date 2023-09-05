import React from "react";
import {Label, Input, FormGroup, FormText } from "reactstrap";

export function SelectFormGroup({name, optionData, id, label, defaultOption, validationMessage, showValidation}) {
    return (
        <>
            <FormGroup>
                <Label for={id}> {label} </Label>
                <Input id={id} name={name} type="select" >
                <option key={0} value={""}> {defaultOption} </option>
                { optionData.length > 0 && optionData.map((options) => (
                    <option key={options.id} value={options.id}> {options.name} </option>
                ))}
                </Input> 
                {
                    showValidation === true && <FormText color="danger">{validationMessage}</FormText>
                } 
            </FormGroup>              
        </>
    );
}