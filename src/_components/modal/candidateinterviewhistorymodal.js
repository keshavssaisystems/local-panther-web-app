import React from "react";
import {
    Modal,
    ModalBody,
    Button,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { CandidateInterviewHistTable } from "_components/common/candidateinterviewhistory";
export const CandidateInterviewHistoryModal = (props) => {
    return (
        <Modal
            size="xl"
            toggle={() => props.onClose()}
            isOpen={props.isOpen}
            backdrop={true}
            fade={true}
        >
            <ModalHeader toggle={() => props.onClose()}><b>Candidate Interview History </b>- {props.candidateName}</ModalHeader>
            <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
                <CandidateInterviewHistTable candidateInterviewList={props.candidateInterviewList} />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => props.onClose()}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};
