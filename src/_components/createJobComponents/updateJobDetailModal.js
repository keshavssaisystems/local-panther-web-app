import React, { useEffect, useState } from "react";
import { Modal, Button, ModalHeader, ModalBody } from "reactstrap";
import { BasicInformation } from "./basicInformation";
import { ExperienceAndSchedules } from "./experienceAndSchedules";
import { PaymentAndBenefits } from "./paymentAndBenefits";
import { KeyQualification } from "./keyQualification";
import { PreScreenApplicant } from "./preScreenApplicant";
import { BsFillPencilFill } from "react-icons/bs";
import "./createJob.scss";

export function UpdateJobDetailModal({
  data,
  sectionId,
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
  jobLocationOptions,
  payPeriodTypeOption,
}) {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    <BasicInformation data={data} jobLocationOptions={jobLocationOptions} />
  );
  const [modalTitle, setModalTitle] = useState("Basic Information");
  const toggle = () => {
    setModal(!modal);
  };
  useEffect(() => {
    section(sectionId);
  }, [sectionId]);
  const section = (sectionId) => {
    switch (sectionId) {
      case 1:
        setModalContent(
          <BasicInformation
            data={data}
            jobLocationOptions={jobLocationOptions}
          />
        );
        setModalTitle("Basic Information");
        break;
      case 2:
        setModalContent(
          <ExperienceAndSchedules
            data={data}
            shiftsOption={shiftsOption}
            workScheduleOptions={workScheduleOptions}
            jobTypeOption={jobTypeOption}
            experienceLevelOption={experienceLevelOption}
            hiringTimelineOption={hiringTimelineOption}
          />
        );
        setModalTitle("Experience & Schedules");
        break;
      case 3:
        setModalContent(
          <PaymentAndBenefits
            data={data}
            payPeriodTypeOption={payPeriodTypeOption}
          />
        );
        setModalTitle("Payments & Benefits");
        break;
      case 4:
        setModalContent(<KeyQualification data={data} />);
        setModalTitle("Key Qualifications");
        break;
      case 5:
        setModalContent(<PreScreenApplicant data={data} />);
        setModalTitle("Pre-screen Applicants");
        break;
      default:
        setModalContent(
          <BasicInformation
            data={data}
            jobLocationOptions={jobLocationOptions}
          />
        );
        setModalTitle("Basic Information");
        break;
    }
  };
  return (
    <>
      <Button
        color="link"
        className="float-end custom-edit-button mt-3"
        onClick={toggle}
      >
        {" "}
        <BsFillPencilFill title={"Edit " + modalTitle} />{" "}
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        fullscreen={"md"}
        size="xl"
        backdrop={"static"}
      >
        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
        <ModalBody>{modalContent}</ModalBody>
      </Modal>
    </>
  );
}
