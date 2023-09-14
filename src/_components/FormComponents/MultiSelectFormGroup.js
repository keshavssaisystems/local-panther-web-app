import React from "react";
import {Label, FormGroup, FormText } from "reactstrap";
import Select from 'react-select';

export function MultiSelectFormGroup({
    name, 
    options = [], 
    id, 
    label, 
    defaultOption, 
    validationMessage, 
    showValidation
    }) {
    return (
        <>
            <FormGroup>
                <Label for={id}> {label} </Label>
                <Select
                    name={name}
                    options={options}
                    isMulti={true}
                    isSearchable={true}
                    placeholder="Select Skills..."
                /> 
                {
                    showValidation === true && <FormText color="danger">{validationMessage}</FormText>
                } 
            </FormGroup>              
        </>
    );
}