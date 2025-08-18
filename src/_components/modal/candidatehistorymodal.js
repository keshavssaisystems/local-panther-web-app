import React from "react";
import {
    Modal,
    ModalBody,
    Row,
    Col,
    Button,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { CandidateHistTable } from "_components/common/candidatehistory";
export const CandidateHistoryModal = (props) => {
    return (
        <Modal
            size="lg"
            toggle={() => props.onClose()}
            isOpen={props.isOpen}
            backdrop={true}
            fade={true}
        >
            <ModalHeader toggle={() => props.onClose()}><b>Candidate History </b>- {props.candidateName}</ModalHeader>
            <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
                <CandidateHistTable candidateHistoryList={props.candidateHistoryList} />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => props.onClose()}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};
