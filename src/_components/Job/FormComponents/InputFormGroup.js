import React from "react";
import {Label, Input, FormGroup} from "reactstrap";

export function InputFormGroup({name, type, id, label, placeholder}) {
    return (
        <>
            <FormGroup>
                <Label for={id}> {label} </Label>
                <Input id={id} name={name} type={type} placeholder={placeholder} />
            </FormGroup>              
        </>
    );
}