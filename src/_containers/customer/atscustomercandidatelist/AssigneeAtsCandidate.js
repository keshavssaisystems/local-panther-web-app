
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAtsCandidateDetails } from "../../../_store/ats.slice";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input

} from "reactstrap";

 function AssigneeAtsCandidate ({atsCandidateId,isOpen,onClose})  {
    console.log("id", atsCandidateId);
    const dispatch = useDispatch();
    const loader=useSelector((state)=>state.ats?.loader);

    const [formData, setFormData] = useState({
        assignmentStartDate: "",
        assignmentEndDate: "",
        isAssigned: false,
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);

        const payload ={
            atscandidateid: atsCandidateId,
            assignmentstartdate: formData.assignmentStartDate
                ? new Date(formData.assignmentStartDate).toISOString()
                : null,
            assignmentenddate: formData.assignmentEndDate
                ? new Date(formData.assignmentEndDate).toISOString()
                : null,
            assignedby: 0, 
            isassigned: formData.isAssigned,
        }
        try {
        const res =  dispatch(updateAtsCandidateDetails(payload)).unwrap();
        console.log("API Response:", res);

            onClose(); // close modal after success
        }catch (error) {
            console.log("Update Failed:", error);
            
        }
    };
    return (
        <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>
        Assign Candidate
      </ModalHeader>

      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Assignment Start Date</Label>
                <Input
                  type="date"
                  name="assignmentStartDate"
                  value={formData.assignmentStartDate}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label>Assignment End Date</Label>
                <Input
                  type="date"
                  name="assignmentEndDate"
                  value={formData.assignmentEndDate}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={4} className="d-flex align-items-center mt-4">
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="isAssigned"
                  checked={formData.isAssigned}
                  onChange={handleChange}
                />
                <Label check className="ms-2">
                  Is Assigned
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
    );
}
export default AssigneeAtsCandidate;