import { CheckboxFormGroup } from "_components/Job/FormComponents/CheckboxFormGroup";
import { InputFormGroup } from "_components/Job/FormComponents/InputFormGroup";
import { NoticePeriod } from "_components/DropdownComponents/NoticePeriod";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForJobActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";

import { Modal, Button, ModalHeader, ModalBody, Form } from "reactstrap";

export function ApplyJobModal({ jobId }) {
  const [modal, setModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExperienceValidation, setExperienceValidation] = useState(false);
  const [showNotivePeriodValidation, setNoticePeriodValidation] =
    useState(false);
  const toggle = () => {
    setModal(!modal);
    setExperienceValidation(false);
  };

  let applyForJob = null;
  const checkValidation = (event) => {
    event.preventDefault();
    if (event.target.elements.experience.value === "") {
      setExperienceValidation(true);
    }
    if (event.target.elements.noticePeriod.value === "") {
      setNoticePeriodValidation(true);
    }
    if (
      event.target.elements.experience.value !== "" &&
      event.target.elements.noticePeriod.value !== ""
    ) {
      onApplyClick(event);
    }
  };
  const onApplyClick = (event) => {
    let data = {
      jobapplicationid: 0,
      jobid: jobId,
      candidateid: 35,
      applicationdate: new Date(),
      applicationstatus: "accepted",
      experienceyears: event.target.elements.experience.value,
      noticeperiodid: event.target.elements.noticePeriod.value,
      isrelocate: event.target.elements.relocate.checked,
      isvideoconference: event.target.elements.isvideoconference.checked,
      isactive: true,
      currentUserId: 1,
    };
    postApplyForJob(data);
    toggle();
    setShowSuccess(true);
  };
  const dispatch = useDispatch();
  const postApplyForJob = async function (formElement) {
    await dispatch(applyForJobActions.postApplyForJob(formElement));
  };
  applyForJob = useSelector((state) => state.applyForJob);
  console.log(applyForJob);
  return (
    <>
      <Button color={"primary"} onClick={toggle}>
        {" "}
        Apply{" "}
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        fullscreen={"md"}
        size="lg"
        backdrop={"static"}
      >
        <ModalHeader toggle={toggle}>Apply For Job</ModalHeader>
        <ModalBody>
          <Form onSubmit={checkValidation}>
            <InputFormGroup
              label={"Years of Experience"}
              name={"experience"}
              id={"experience"}
              type={"number"}
              placeholder={"Enter years of experience"}
              showValidation={showExperienceValidation}
              validationMessage={"Please Enter Years of Experience"}
            />
            <NoticePeriod
              showValidation={showNotivePeriodValidation}
              validationMessage={"Please Select Notice Period"}
            />
            <CheckboxFormGroup
              id="relocate"
              name="relocate"
              label="Are you willing to relocate?"
            />
            <CheckboxFormGroup
              id="isvideoconference"
              name="isvideoconference"
              label="Will you be available for video conference"
            />
            <Button color="primary" type="submit" className="float-end">
              {" "}
              Apply{" "}
            </Button>
            <Button color="secondary" onClick={toggle}>
              {" "}
              Cancel{" "}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      <SweetAlert
        title="Applied Successfully"
        show={showSuccess}
        type="success"
        onConfirm={() => setShowSuccess(false)}
      />
    </>
  );
}
