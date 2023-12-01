import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./scheduledInterview.scss";
import { VideoInterviewDetails } from "./videoInterviewDetails";

export function InterviewDetailsModal({
  isOpen = false,
  type,
  onClose,
  interviewDetail,
  postNotesData,
  postInviteData,
  cancelScheduleData,
  editScheduledInterview,
  postMessageData,
  acceptInterview,
  rejectInterview,
  fromCustList, // for customer list
  postFeedbackData,
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
          <VideoInterviewDetails
            interviewId={interviewDetail.scheduleinterviewid}
            postNotesData={(e) => postNotesData(e)}
            postInviteData={(e) => postInviteData(e)}
            cancelScheduleData={(e) => cancelScheduleData(e)}
            editScheduledInterview={(e) => editScheduledInterview(e)}
            postMessageData={(e) => postMessageData(e)}
            acceptInterview={(e) => acceptInterview(e)}
            rejectInterview={(e) => rejectInterview(e)}
            interviewDetails={interviewDetail}
            fromCustList={fromCustList}
            toggle={toggle}
            postFeedbackData={(e) => postFeedbackData(e)}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
