import React from "react";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Col,
    Button,
} from "reactstrap";

export default function UnifiedCandidateModal({ candidate, onClose }) {
    return (
        <Modal
            toggle={() => onClose()}
            className="modal-reject-align "
            isOpen={!!candidate}
            backdrop="fade"
            size="lg"
        >
            <ModalHeader toggle={() => onClose()}></ModalHeader>
            <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
                {/* <button className="close-button" onClick={onClose}>×</button> */}
                <h2>{candidate.name}</h2>
                <p><strong>Title:</strong> {candidate.title}</p>
                <p><strong>Company:</strong> {candidate.company_name}</p>
                <p><strong>Email:</strong> {candidate.emails?.[0]?.email}</p>
                <p><strong>Phone:</strong> {candidate.telephones?.[0]?.number}</p>
                <p><strong>Skills:</strong> {candidate.skills?.join(', ')}</p>
                <p><strong>Address:</strong> {candidate.address?.address1}, {candidate.address?.city}, {candidate.address?.region_code} {candidate.address?.postal_code}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => onClose()}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>

    );
};