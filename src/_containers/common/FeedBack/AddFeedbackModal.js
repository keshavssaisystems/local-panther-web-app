import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { feedbackActions, addFeedbackThunk, getFeedbackTypeList } from "./feedback.slice";
import { showSnackbar } from "_store/snackbar.slice";
import { SNACKBAR_TYPES, SNACKBAR_POSITION } from "_constants/snackbarMessages";


const initialForm = {
  feedbackTypeId: "",
  subject: "",
  description: "",
  file: null,
};

const AddFeedbackModal = ({ isOpen, toggle, page, pageSize }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { feedbackTypeList } = useSelector((state) => state.feedback);
  useEffect(() => {
    if (isOpen) {
      dispatch(getFeedbackTypeList());
      setForm(initialForm);
      setErrors({});
    }
  }, [isOpen, dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!form.feedbackTypeId) newErrors.feedbackTypeId = "Feedback type is required.";
    if (!form.subject.trim()) newErrors.subject = "Subject is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrors({});
    toggle();
  };

  const handleSubmit = async () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    feedbackTypeId: Number(form.feedbackTypeId),
    feedbackStatusId: 1,
    subject: form.subject,
    feedback: form.description,
    createdBy: Number(localStorage.getItem("userId")),
    file: form.file,
  };

  setLoading(true);
  try {
    await dispatch(addFeedbackThunk(payload)).unwrap();

    dispatch(
      showSnackbar({
        message: "Feedback submitted successfully.",
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
      })
    );

      dispatch(
        feedbackActions.getFeedbackListThunk({
          pageNumber: page,
          pageSize: pageSize,
          userroleid: localStorage.getItem("userroleid"),
        })
      );

    setForm(initialForm);
    setErrors({});
    toggle();

  } catch (err) {
    dispatch(
      showSnackbar({
        message: "Failed to submit feedback. Please try again.",
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
      })
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal isOpen={isOpen} toggle={handleCancel} backdrop="static" keyboard={true}>
      <ModalHeader toggle={handleCancel}>Add Feedback</ModalHeader>

      <ModalBody>
        {/* Feedback Type */}
        <FormGroup>
          <Label for="feedbackTypeId">
            Feedback Type <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="select"
            id="feedbackTypeId"
            name="feedbackTypeId"
            value={form.feedbackTypeId}
            onChange={handleChange}
            invalid={!!errors.feedbackTypeId}
          >
            <option value="">Select feedback type</option>
            {feedbackTypeList.map((ft) => (
              <option key={ft.id} value={ft.id}>
                {ft.name}
              </option>
            ))}
          </Input>
          {errors.feedbackTypeId && (
            <p className="text-danger small mt-1">{errors.feedbackTypeId}</p>
          )}
        </FormGroup>

        {/* Subject */}
        <FormGroup>
          <Label for="subject">
            Subject <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="text"
            id="subject"
            name="subject"
            placeholder="Enter subject"
            value={form.subject}
            onChange={handleChange}
            invalid={!!errors.subject}
          />
          {errors.subject && (
            <p className="text-danger small mt-1">{errors.subject}</p>
          )}
        </FormGroup>

        {/* Description */}
        <FormGroup>
          <Label for="description">
            Description <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="textarea"
            id="description"
            name="description"
            placeholder="Enter description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-danger small mt-1">{errors.description}</p>
          )}
        </FormGroup>

        {/* File Upload */}
        <FormGroup>
          <Label for="file">Attachment (Optional)</Label>
          <Input
            type="file"
            id="file"
            name="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          style={{ background: "#2f479b", borderColor: "#2f479b" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddFeedbackModal;
