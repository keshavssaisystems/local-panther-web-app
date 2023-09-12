import React from "react";
import {Label, Input, FormGroup, FormText} from "reactstrap";
import "./Form.css";

export function InputFormGroup({name, type, id, label, placeholder, mandatory, showValidation, validationMessage}) {
    return (
        <>
            <FormGroup>
                <Label for={id} className="fw-semi-bold"> {label} 
                {
                    mandatory === true && <span style={{color : "red"}}>* </span>
                }
                </Label>
                <Input id={id} name={name} type={type} placeholder={placeholder} />
                {
                    showValidation === true && <FormText color="danger">{validationMessage}</FormText>
                }
            </FormGroup>              
        </>
    );
}