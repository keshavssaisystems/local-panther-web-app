import React from "react";
import {Label, FormGroup, FormText } from "reactstrap";
import Select from 'react-select';

export function MultiSelectFormGroup({
    label, 
    id, 
    name, 
    placeholder,
    options = [], 
    defaultOption, 
    validationMessage, 
    showValidation
    }) {
    return (
        <>
            <FormGroup>
                <Label for={id}> {label} </Label>
                <Select
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    options={options}
                    isMulti={true}
                    isSearchable={true}
                /> 
                {
                    showValidation === true && <FormText color="danger">{validationMessage}</FormText>
                } 
            </FormGroup>              
        </>
    );
}