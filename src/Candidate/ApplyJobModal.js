import { CheckboxFormGroup } from "_components/Job/FormComponents/CheckboxFormGroup";
import { InputFormGroup } from "_components/Job/FormComponents/InputFormGroup";
import { SelectFormGroup } from "_components/Job/FormComponents/SelectFormGroup";
import React, { useState } from "react";

import { Modal ,Button, ModalHeader, ModalBody, Form } from "reactstrap";

export function ApplyJobModal() {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [formElement, setFormElement] = useState({
        experience : "",
        expectation : "",
        noticePeriod : "",
        relocate : "",
        available_for_video_conf : ""
    })
    const onApplyClick = (event) => {
        let data = {}
        event.preventDefault();
        console.log(event.target.elements);
        data.experience = event.target.elements.experience.value;
        data.expectation = event.target.elements.expectation.value;
        data.noticePeriod = event.target.elements.noticePeriod.value;
        data.relocate = event.target.elements.relocate.value;
        data.available_for_video_conf = event.target.elements.available_for_video_conf.value;
        console.log(data);
      }
    return (
        <>
            {/* <Button color={"primary"} onClick={toggle}> Apply </Button> */}
            <Modal isOpen={modal} toggle={toggle} fullscreen={"md"} size="lg" backdrop={"static"}>
                <ModalHeader toggle={toggle}>Apply For Job</ModalHeader>
                <ModalBody>
                    <Form onSubmit={onApplyClick}>
                        <InputFormGroup label={"Years of Experience"} name={"experience"} id={"experience"} type={"number"} placeholder={"Enter years of experience"} />
                        <InputFormGroup label={"Expectation"} name={"expectation"} id={"expectation"} type={"text"} placeholder={"Enter your expectation"} />
                        <SelectFormGroup label="Notice Period" id="noticePeriod" name="noticePeriod" optionData={['1 Week',"2 Weeks", "1 Month"]}/>
                        <CheckboxFormGroup id="relocate" name="relocate" label="Are you willing to relocate?" />
                        <CheckboxFormGroup id="available_for_video_conf" name="available_for_video_conf" label="Will you be available for video conference" />
                        <Button color="primary" className="float-end"> Apply </Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );
}