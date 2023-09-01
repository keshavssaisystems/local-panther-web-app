import React from "react";
import {Label, Input, FormGroup } from "reactstrap";

export function SelectFormGroup({name, optionData, id, label}) {
    return (
        <>
            <FormGroup>
                <Label for={id}> {label} </Label>
                <Input id={id} name={name} type="select" >
                { optionData.map((options, index) => (
                    <option key={index} value={index}> {options} </option>
                ))}
                </Input>  
            </FormGroup>              
        </>
    );
}