import React from "react";
import {
    Modal,
    ModalBody,
    Button,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { ExternalMemberFeedbackHistTable } from "_components/common/externalmemberfeedbackhistory";

export const ExternalMemberFeedbackModal = (props) => {
    return (
        <Modal
            size="xl"
            toggle={() => props.onClose()}
            isOpen={props.isOpen}
            backdrop={true}
            fade={true}
        >
            <ModalHeader toggle={() => props.onClose()}><b>External Member Feedback </b>- {props.interviewTitle}</ModalHeader>
            <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
                <ExternalMemberFeedbackHistTable externalFeedbackList={props.feedbacks} />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => props.onClose()}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};
