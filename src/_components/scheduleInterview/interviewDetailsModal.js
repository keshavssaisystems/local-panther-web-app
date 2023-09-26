import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./scheduledInterview.scss";
import { VideoInterviewDetails } from "./videoInterviewDetails";
import { TelephonicInterviewDetails } from "./telephonicInterviewDetails";

export function InterviewDetailsModal({ isOpen = false, type }) {
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
        backdrop={"static"}
        toggle={toggle}
        className="interview-details-modal"
      >
        <ModalHeader>Interview details</ModalHeader>
        <ModalBody className="pt-4">
          {type === "video" && <VideoInterviewDetails />}
          {type === "phone" && <TelephonicInterviewDetails />}
        </ModalBody>
      </Modal>
    </>
  );
}
