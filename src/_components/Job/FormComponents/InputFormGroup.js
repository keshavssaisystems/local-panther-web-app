import React from "react";
import {Label, Input, FormGroup, FormText} from "reactstrap";

export function InputFormGroup({name, type, id, label, placeholder, showValidation, validationMessage}) {
    return (
        <>
            <FormGroup>
                <Label for={id}> {label} </Label>
                <Input id={id} name={name} type={type} placeholder={placeholder} />
                {
                    showValidation === true && <FormText color="danger">{validationMessage}</FormText>
                }
            </FormGroup>              
        </>
    );
}