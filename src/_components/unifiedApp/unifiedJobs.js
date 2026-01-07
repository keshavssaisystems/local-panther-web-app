
import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import axios from "axios";
import unifiedKeys from './unifiedKeys.json';
import UnifiedCandidateModal from "./unifiedCandidateModal";
import { useParams } from "react-router-dom";
export default function UnifiedJobs() {
    const [jobs, setJobs] = useState([]);
    const { connectionId } = useParams();
    const UNIFIED_API_KEY = unifiedKeys.UNIFIED_API_KEY;
    const fetchATSJobs = async () => {
        const options = {
            method: 'GET',
            url: `https://api.unified.to/ats/${connectionId}/job`,
            headers: {
                authorization: `Bearer ${UNIFIED_API_KEY}`,
            },
            params: {
                limit: 20,
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
        const fetchJobs = async () => {
            if (connectionId) {
                const data = await fetchATSJobs();
                if (data) {
                    setJobs(data);
                }
            }
        };
        fetchJobs();
    }, [connectionId]);

    const viewProfile = (job) => {
        // Implement view profile logic here
        console.log(`View profile for job ID`, job);
        setSelectedJob(job);
        setIsModalOpen(true);
    }
    const onClose = () => {
        setSelectedJob(null);
        setIsModalOpen(false);
    };

    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <Row>
                {jobs.map((job) => (
                    <Col key={job.id} sm="6" md="4" lg="3">
                        <div className="job-card">
                            <h5>{job.name}</h5>
                            <p>{job?.addresses?.[0]?.region}</p>
                            <p>{moment(job.created_at).fromNow()}</p>
                            {/* <Button color="primary" onClick={() => viewProfile(job)}>View Profile</Button> */}
                        </div>
                    </Col>
                ))}
            </Row>

            <>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <button className="close-button" onClick={onClose}>×</button>
                            <UnifiedCandidateModal candidate={selectedJob} onClose={onClose} />
                        </div>
                    </div>
                )}
            </>
        </>
    );
}