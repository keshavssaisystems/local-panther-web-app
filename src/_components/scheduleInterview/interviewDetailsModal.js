import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./scheduledInterview.scss";
import { VideoInterviewDetails } from "./videoInterviewDetails";
import { TelephonicInterviewDetails } from "./telephonicInterviewDetails";

export function InterviewDetailsModal({
  isOpen = false,
  type,
  onClose,
  interviewDetail,
}) {
  console.log(interviewDetail);
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
          {type === "video" && (
            <VideoInterviewDetails interviewDetail={interviewDetail} />
          )}
          {type === "phone" && <TelephonicInterviewDetails />}
        </ModalBody>
      </Modal>
    </>
  );
}
