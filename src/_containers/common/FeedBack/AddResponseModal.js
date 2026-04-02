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
import { feedbackActions, getFeedbackStatusList, updateFeedbackThunk } from "./feedback.slice";
import { showSnackbar } from "_store/snackbar.slice";
import { SNACKBAR_TYPES, SNACKBAR_POSITION } from "_constants/snackbarMessages";

const initialForm = {
  feedbackStatusId: "",
  response: "",
  responseFile: null,
};

const AddResponseModal = ({ isOpen, toggle, page, pageSize, selectedRow }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingFile, setExistingFile] = useState(null);

  const { feedbackStatusList } = useSelector((state) => state.feedback);

  useEffect(() => {
    if (isOpen) {
      dispatch(getFeedbackStatusList());
      setForm({
        feedbackStatusId: selectedRow?.feedbackstatusid || "",
        response: selectedRow?.response || "",
        responseFile: null,
      });
      // Bind existing file if available
      setExistingFile(selectedRow?.responseFile || selectedRow?.existingFile || null);
      setErrors({});
    }
  }, [isOpen, dispatch, selectedRow]);

  const validate = () => {
    const newErrors = {};
    if (!form.feedbackStatusId) newErrors.feedbackStatusId = "Feedback status is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm((prev) => ({ ...prev, responseFile: file }));
  };

  const handleCancel = () => {
    setForm(initialForm);
    setExistingFile(null);
    setErrors({});
    // Clear the file input element
    const fileInput = document.getElementById("responseFile");
    if (fileInput) fileInput.value = "";
    toggle();
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      feedbackStatusId: Number(form.feedbackStatusId),
      response: form.response,
      responseFile: form.responseFile || null,
      existingFile: !form.responseFile && existingFile ? existingFile : null, // Keep existing file if no new file selected
      modifiedBy: Number(localStorage.getItem("userId")),
    };

    setLoading(true);
    try {
      await dispatch(
        updateFeedbackThunk({ id: selectedRow?.ratingsandfeedbackid, feedback_data: payload })
      ).unwrap();

      dispatch(
        showSnackbar({
          message: "Response submitted successfully.",
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
      setExistingFile(null);
      setErrors({});
      // Clear the file input element
      const fileInput = document.getElementById("responseFile");
      if (fileInput) fileInput.value = "";
      toggle();
    } catch (err) {
      dispatch(
        showSnackbar({
          message: "Failed to submit response. Please try again.",
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
      <ModalHeader toggle={handleCancel}>Add Response</ModalHeader>

      <ModalBody>
        {/* Feedback Status */}
        <FormGroup>
          <Label for="feedbackStatusId">
            Feedback Status <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="select"
            id="feedbackStatusId"
            name="feedbackStatusId"
            value={form.feedbackStatusId}
            onChange={handleChange}
            invalid={!!errors.feedbackStatusId}
          >
            <option value="">Select status</option>
            {feedbackStatusList?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Input>
          {errors.feedbackStatusId && (
            <p className="text-danger small mt-1">{errors.feedbackStatusId}</p>
          )}
        </FormGroup>

        {/* Response */}
        <FormGroup>
          <Label for="response">
            Response <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="textarea"
            id="response"
            name="response"
            placeholder="Enter response"
            rows={4}
            value={form.response}
            onChange={handleChange}
          />
        </FormGroup>

        {/* Attachment */}
        <FormGroup>
          <Label for="responseFile">Attachment (Optional)</Label>
          {existingFile && (
            <div className="mb-2">
              <small>Current file: {typeof existingFile === 'string' ? existingFile : existingFile?.name}</small>
            </div>
          )}
          <Input
            type="file"
            id="responseFile"
            name="responseFile"
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

export default AddResponseModal;
