import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./scheduledInterview.scss";
import { VideoInterviewDetails } from "./videoInterviewDetails";
import { TelephonicInterviewDetails } from "./telephonicInterviewDetails";
import { InpersonInterviewDetails } from "./inpersonInterviewDetails";

export function InterviewDetailsModal({
  isOpen = false,
  type,
  onClose,
  interviewDetail,
  postNotesData,
  postInviteData,
  cancelScheduleData,
}) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        fullscreen={"lg"}
        size="lg"
        backdrop={true}
        fade={true}
        toggle={toggle}
        className="interview-details-modal"
        onClosed={() => onClose()}
      >
        <ModalHeader toggle={() => onClose()}>Interview details</ModalHeader>
        <ModalBody className="pt-4">
          {type === "Video" && (
            <VideoInterviewDetails
              interviewId={interviewDetail.scheduleinterviewid}
              postNotesData={(e) => postNotesData(e)}
              postInviteData={(e) => postInviteData(e)}
              cancelScheduleData={(e) => cancelScheduleData(e)}
            />
          )}
          {type === "Phone" && (
            <TelephonicInterviewDetails interviewDetail={interviewDetail} />
          )}
          {type === "In-person" && (
            <InpersonInterviewDetails interviewDetail={interviewDetail} />
          )}
        </ModalBody>
      </Modal>
    </>
  );
}
