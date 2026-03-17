import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAtsCandidateDetails } from "../../../_store/ats.slice";
import { dropdownActions } from "../createJob/dropdown.slice"; 
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
import AsyncSelect from "react-select/async";
import { showSnackbar } from "_store/snackbar.slice";
import { SNACKBAR_TYPES, SNACKBAR_POSITION } from "_constants/snackbarMessages";


function AssigneeAtsCandidate ({ atsCandidateId, isAssigned, assignedCompanyId,assignedCompanyName, assignmentStartDate, assignmentEndDate, isOpen, onClose, onRefresh }) {
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        clientCompany: null,
        assignmentStartDate: "",
        assignmentEndDate: "",
        isAssigned: false,
    });

    const [clientCompanyOptions, setClientCompanyOptions] = useState([]);

    
     useEffect(() => {
        if (isOpen) {
            if (isAssigned) {
                const selectedCompany = assignedCompanyId && assignedCompanyName 
                    ? {
                        value: assignedCompanyId,
                        label: assignedCompanyName,
                    }
                    : null;

                setFormData({
                    clientCompany: selectedCompany,
                    assignmentStartDate: assignmentStartDate ? assignmentStartDate.split("T")[0] : "",
                    assignmentEndDate: assignmentEndDate ? assignmentEndDate.split("T")[0] : "",
                    isAssigned: true,
                });
            } else {
                
                setFormData({
                    clientCompany: null,
                    assignmentStartDate: "",
                    assignmentEndDate: "",
                    isAssigned: false,
                });
            }
            getClientCompany("");
        }
    }, [isOpen, assignedCompanyId, assignedCompanyName]);

    const getClientCompany = useCallback(async (inputValue) => {
        try {
            const companyId = Number(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0;
            const response = await dispatch(
                dropdownActions.getDropdownListThunk({
                    searchText: "ClientCompany",
                    commonId: companyId,
                    searchBy: inputValue || "",
                })
            );
            const companies = response?.payload?.data || response?.payload?.data?.data || response?.payload || [];
            const options = (companies || []).map((company) => ({
                value: company.id,
                label: company.name,
            }));
            setClientCompanyOptions(options);
            return options;

        } catch (err) {
            return [];
        }
    }, [dispatch]);

    const loadOptionsClientCompany = useCallback(
        async (inputValue) => {
            const source = await getClientCompany(inputValue) || [];
            if (!inputValue) return source;
            const filtered = source.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            return filtered;
        },
        [getClientCompany]
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleClientCompanyChange = (val) => {
        setFormData((prev) => ({
            ...prev,
            clientCompany: val,
        }));
    };

    const handleSaveAssignment = async (e) => {
        e.preventDefault();
        const payload = {
            atscandidateid: atsCandidateId,
            clientcompanyid: formData.clientCompany?.value || null, 
            assignmentstartdate: formData.assignmentStartDate
                ? new Date(formData.assignmentStartDate).toISOString()
                : null,
            assignmentenddate: formData.assignmentEndDate
                ? new Date(formData.assignmentEndDate).toISOString()
                : null,
            assignedby: 0, 
            isassigned: true,
        };

        try {
            await  dispatch(updateAtsCandidateDetails(payload)).unwrap();
            if (onRefresh && typeof onRefresh === "function") {
                onRefresh();
            }
            onClose();
            dispatch(showSnackbar({
                message: "Assignment Updated",
                type: SNACKBAR_TYPES.SUCCESS,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
            }));
           
        } catch (error) {
             dispatch(showSnackbar({
                message:"Failed to update assignment",
                type: SNACKBAR_TYPES.ERROR,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
            }));
        }
    };

    const handleRemoveAssignment = async(e) => {
        e.preventDefault();
        const payload = {
            atscandidateid: atsCandidateId,
            clientcompanyid: null, 
            assignmentstartdate: null,
            assignmentenddate: null,
            assignedby: 0, 
            isassigned: false,
        };

        try {
            await dispatch(updateAtsCandidateDetails(payload)).unwrap();
            if (onRefresh && typeof onRefresh === "function") {
              onRefresh();
            }
            onClose();
             dispatch(showSnackbar({
                message: "Assignment Removed",
                type: SNACKBAR_TYPES.SUCCESS,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
            }));
            
        } catch (error) {
            dispatch(showSnackbar({
                message: "Failed to remove assignment",
                type: SNACKBAR_TYPES.ERROR,
                position: SNACKBAR_POSITION.TOP_CENTER,
                autoClose: true,
                autoCloseDelay: 3000,
                maxWidth: 500,
            }));
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={onClose} size="lg">
            <ModalHeader toggle={onClose}>
                {isAssigned ? "Update Assignment" : "Assign Candidate"}
            </ModalHeader>

            <ModalBody>
                <Form onSubmit={isAssigned ? handleSaveAssignment : handleSaveAssignment}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>Client Company<span style={{ color: "red" }}>*</span></Label>
                                <AsyncSelect
                                    name="clientCompany"
                                    placeholder="Search Client Company"
                                    cacheOptions
                                    loadOptions={loadOptionsClientCompany}
                                    defaultOptions={clientCompanyOptions}
                                    value={formData.clientCompany}
                                    onChange={handleClientCompanyChange}
                                    isMulti={false}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
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

                        <Col md={6}>
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
                    </Row>
                </Form>
            </ModalBody>

            <ModalFooter>
                {isAssigned ? (
                    <>
                        <Button color="danger" onClick={handleRemoveAssignment}>
                            Remove Assignment
                        </Button>
                        <Button color="primary" onClick={handleSaveAssignment}>
                            Update Assignment
                        </Button>
                    </>
                ) : (
                    <Button color="primary" onClick={handleSaveAssignment}>
                        Save
                    </Button>
                )}
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default AssigneeAtsCandidate;