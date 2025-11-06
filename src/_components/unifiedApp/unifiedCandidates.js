
import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import axios from "axios";
import unifiedKeys from './unifiedKeys.json';
import UnifiedCandidateModal from "./unifiedCandidateModal";
import { useParams } from "react-router-dom";

export default function UnifiedCandidates() {
    const [candidates, setCandidates] = useState([]);
    const { connectionId } = useParams();
    const UNIFIED_API_KEY = unifiedKeys.UNIFIED_API_KEY;

    const fetchATSCandidates = async () => {
        const options = {
            method: 'GET',
            url: `https://api.unified.to/ats/${connectionId}/candidate`,
            headers: {
                authorization: `Bearer ${UNIFIED_API_KEY}`,
            },
            params: {
                limit: 1000,
                offset: 0,
            },
        };

        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('Error fetching ATS candidates:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchCandidates = async () => {
            if (connectionId) {
                const data = await fetchATSCandidates();
                if (data) {
                    setCandidates(data);
                }
            }
        };
        fetchCandidates();
    }, [connectionId]);

    const viewProfile = (candidate) => {
        // Implement view profile logic here
        console.log(`View profile for candidate ID`, candidate);
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    }
    const onClose = () => {
        setSelectedCandidate(null);
        setIsModalOpen(false);
    };

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <Row>
                {candidates.map((candidate) => (
                    <Col key={candidate.id} sm="6" md="4" lg="3">
                        <div className="candidate-card">
                            <h5>{candidate.name}</h5>
                            <p>{moment(candidate.created_at).fromNow()}</p>
                            <Button color="primary" onClick={() => viewProfile(candidate)}>View Profile</Button>
                        </div>
                    </Col>
                ))}
            </Row>

            <>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <button className="close-button" onClick={onClose}>×</button>
                            <UnifiedCandidateModal candidate={selectedCandidate} onClose={onClose} />
                        </div>
                    </div>
                )}
            </>
        </>
    );
}