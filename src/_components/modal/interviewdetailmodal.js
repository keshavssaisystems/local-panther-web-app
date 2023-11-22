import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import { ScheduleDetails } from "_containers/candidate/calendar/scheduleDetails";

export const InterViewDetailModal = (props) => {
  return (
    <Modal className="modal-reject-align profile-view" isOpen={props.isOpen}>
      <ModalHeader toggle={() => props.onClose()} charCode="Y">
        <strong className="card-title-text">Interview Details</strong>
      </ModalHeader>
      <ScheduleDetails
        onClose={() => props.onClose()}
        interviewDetail={props.data}
        isAdmin={props?.isAdmin}
      />
    </Modal>
  );
};
