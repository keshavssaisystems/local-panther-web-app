import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  Underline,
  Strikethrough,
  Link,
  BlockQuote,
  Undo,
  Alignment,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { fetchWrapper } from "_helpers/fetch-wrapper";
import { useDispatch } from "react-redux";
import { showSnackbar } from "_store/snackbar.slice";
import { SNACKBAR_TYPES, SNACKBAR_POSITION } from "_constants/snackbarMessages";
import { BsPaperclip, BsPlugFill, BsLink45Deg } from "react-icons/bs";

const API_BASE = process.env.REACT_APP_NEW_API_URL;

/**
 * Builds a default email subject.
 */
const buildDefaultSubject = (candidateData) => {
  const candidateName =
    candidateData?.firstname && candidateData?.lastname
      ? `${candidateData.firstname} ${candidateData.lastname}`
      : "Candidate";
  const jobTitle = candidateData?.jobtitle || "";
  return jobTitle
    ? `Candidate Presentation: ${candidateName} – ${jobTitle}`
    : `Candidate Presentation: ${candidateName}`;
};

/**
 * Builds the default email body HTML template.
 */
const buildDefaultBody = (candidateData, senderName) => {
  const candidateName =
    candidateData?.firstname && candidateData?.lastname
      ? `${candidateData.firstname} ${candidateData.lastname}`
      : "the candidate";
  const jobTitle = candidateData?.jobtitle || "the position";

  return `<p>Dear Hiring Manager,</p>
<p>I hope this message finds you well.</p>
<p>I am pleased to present <strong>${candidateName}</strong> for the role of <strong>${jobTitle}</strong>. Please find the candidate's resume attached for your review.</p>
<p>This candidate brings a strong background and relevant experience that aligns well with your requirements. I would be happy to schedule a call to discuss their profile in more detail at your convenience.</p>
<p>Please feel free to reach out if you have any questions or need additional information.</p>
<p>Best regards,<br/>${senderName || "Recruiting Team"}</p>`;
};

/**
 * Derives the candidate ID from the card data.
 */
const getCandidateId = (candidateData) =>
  candidateData?.recommendedationCandidateShortList?.[0]?.candidateid ?? null;

/**
 * Determines the resume to attach.
 * Prefers the uploaded candidate resume URL; falls back to null (no binary file – informational only).
 */
const getResumeInfo = (candidateData) => {
  const resumePath = candidateData?.candidateResumeDto?.resumepath;
  if (resumePath) {
    const fileName = resumePath.split("/").pop().split("?")[0] || "resume.pdf";
    return { url: resumePath, fileName, isCandidate: true };
  }
  return { url: null, fileName: "OpenWorX_CV.pdf", isCandidate: false };
};

/**
 * Fetches a resume file from a URL and returns it as a File object.
 * Returns null if the fetch fails.
 */
const fetchResumeFile = async (url, fileName) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || "application/pdf" });
  } catch {
    return null;
  }
};

/**
 * Opens OAuth popup.
 * After 5s checks status from parent and closes popup if connected.
 * Also watches for manual popup close as fallback.
 */
const openOAuthPopup = (authUrl) =>
  new Promise((resolve, reject) => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      authUrl,
      "oauth-popup",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      reject(new Error("Popup blocked. Please allow popups for this site."));
      return;
    }

    let resolved = false;

    const finish = async () => {
      if (resolved) return;
      resolved = true;
      clearInterval(watchClose);
      clearInterval(checkStatus);
      try {
        const res = await fetchWrapper.get(`${API_BASE}/OAuth/status`);
        if (res?.statusCode === 200 && res.data?.connected) {
          if (!popup.closed) popup.close();
          resolve(res.data);
        } else {
          if (!popup.closed) popup.close();
          reject(new Error("Authentication window was closed before completing."));
        }
      } catch (_) {
        reject(new Error("Authentication window was closed before completing."));
      }
    };

    // Watch for user manually closing popup
    const watchClose = setInterval(() => {
      if (popup.closed) finish();
    }, 500);

    // Every 5s check status from parent side and close popup if connected
    const checkStatus = setInterval(async () => {
      if (resolved) return;
      try {
        const res = await fetchWrapper.get(`${API_BASE}/OAuth/status`);
        if (res?.statusCode === 200 && res.data?.connected) {
          finish();
        }
      } catch (_) {}
    }, 5000);
  });

/**
 * ComposeEmailModal
 *
 * A Gmail-style email compose popup that sends a candidate resume to a client.
 *
 * Props:
 *  isOpen                  {boolean}   Whether the modal is visible
 *  onClose                 {function}  Called when the user cancels / closes
 *  candidateData           {object}    The candidate card data from the list
 *  connectedEmail          {string}    Currently connected email (from parent state)
 *  onEmailConnectionChange {function}  Called with new email when connect/disconnect happens
 *  onSendSuccess           {function}  Called after a successful send (no arguments)
 */
const ComposeEmailModal = ({ isOpen, onClose, candidateData, connectedEmail, onEmailConnectionChange, onSendSuccess }) => {
  const dispatch = useDispatch();

  const senderName =
    localStorage.getItem("userFirstName") && localStorage.getItem("userLastName")
      ? `${localStorage.getItem("userFirstName")} ${localStorage.getItem("userLastName")}`
      : localStorage.getItem("userName") || "";

  const resumeInfo = getResumeInfo(candidateData);
  const candidateId = getCandidateId(candidateData);

  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState(buildDefaultSubject(candidateData));
  const [body, setBody] = useState(buildDefaultBody(candidateData, senderName));
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [fromEmail, setFromEmail] = useState(connectedEmail || localStorage.getItem("userEmail") || "");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Sync fromEmail when connectedEmail prop changes
  useEffect(() => {
    if (connectedEmail) setFromEmail(connectedEmail);
  }, [connectedEmail]);

  // Re-fetch OAuth status on every open to get the latest connected email
  useEffect(() => {
    if (isOpen) {
      fetchWrapper.get(`${API_BASE}/OAuth/status`).then((res) => {
        if (res?.statusCode === 200) {
          const email = res.data?.connected ? res.data.connectedEmail : "";
          setFromEmail(email || localStorage.getItem("userEmail") || "");
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  // Reset fields when modal opens with new candidate data
  useEffect(() => {
    if (isOpen) {
      setToEmail("");
      setSubject(buildDefaultSubject(candidateData));
      setBody(buildDefaultBody(candidateData, senderName));
      setErrors({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, candidateData]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const res = await fetchWrapper.get(`${API_BASE}/OAuth/connect?provider=outlook`);
      if (res?.statusCode === 200 && res.data?.authUrl) {
        await openOAuthPopup(res.data.authUrl);
        const statusRes = await fetchWrapper.get(`${API_BASE}/OAuth/status`);
        if (statusRes?.statusCode === 200 && statusRes.data?.connected) {
          const newEmail = statusRes.data.connectedEmail || "";
          setFromEmail(newEmail);
          onEmailConnectionChange && onEmailConnectionChange(newEmail);
        }
      }
    } catch (err) {
      dispatch(showSnackbar({
        message: err.message || "Email connection failed. Please try again.",
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 4000,
        maxWidth: 500,
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await fetchWrapper.delete(`${API_BASE}/OAuth/disconnect`);
      setFromEmail(localStorage.getItem("userEmail") || "");
      onEmailConnectionChange && onEmailConnectionChange("");
    } catch (err) {
      dispatch(showSnackbar({
        message: "Failed to disconnect email. Please try again.",
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 4000,
        maxWidth: 500,
      }));
    } finally {
      setIsDisconnecting(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!toEmail.trim()) {
      newErrors.toEmail = "Recipient email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail.trim())) {
      newErrors.toEmail = "Please enter a valid email address.";
    }
    if (!subject.trim()) {
      newErrors.subject = "Subject is required.";
    }
    if (!body.trim() || body === "<p>&nbsp;</p>") {
      newErrors.body = "Email body is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append("ToEmail", toEmail.trim());
      formData.append("Subject", subject.trim());
      formData.append("Body", body);
      if (candidateId !== null) {
        formData.append("CandidateId", String(candidateId));
      }

      // Attach resume file
      if (resumeInfo.url) {
        const file = await fetchResumeFile(resumeInfo.url, resumeInfo.fileName);
        if (file) {
          formData.append("resumeFile", file, resumeInfo.fileName);
        }
        // If fetch failed, we still proceed (API may handle missing file gracefully)
      }

      const res = await fetchWrapper.postForm(
        `${API_BASE}/CandidateRecommendedJob/sendPresentedMail`,
        formData
      );

      if (res?.statusCode === 200 || res?.statusCode === 201 || res?.statusCode === 204) {
        dispatch(
          showSnackbar({
            message: "Resume sent successfully!",
            type: SNACKBAR_TYPES.SUCCESS,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 3000,
            maxWidth: 500,
          })
        );
        onSendSuccess && onSendSuccess();
        onClose();
      } else {
        dispatch(
          showSnackbar({
            message: res?.message || "Failed to send email. Please try again.",
            type: SNACKBAR_TYPES.ERROR,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 4000,
            maxWidth: 500,
          })
        );
      }
    } catch (err) {
      dispatch(
        showSnackbar({
          message: "An error occurred while sending the email. Please try again.",
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 4000,
          maxWidth: 500,
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={isSending ? undefined : onClose}
      size="lg"
      backdrop="static"
    >
      <ModalHeader toggle={isSending ? undefined : onClose}>
        Compose Email – Share Candidate Resume
      </ModalHeader>

      <ModalBody>
        {/* From (read-only with connect/disconnect) */}
        <FormGroup>
          <Label className="fw-semibold mb-1">From</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Input
              type="text"
              value={fromEmail || "Not connected"}
              disabled
              style={{ backgroundColor: "#f8f9fa", color: "#6c757d", flex: 1 }}
            />
            {fromEmail ? (
              <Button
                color="danger"
                outline
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting || isSending}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                {isDisconnecting ? (
                  <><Spinner size="sm" className="me-1" />Disconnecting…</>
                ) : (
                  <><BsPlugFill className="me-1" />Disconnect</>
                )}
              </Button>
            ) : (
              <Button
                color="primary"
                outline
                size="sm"
                onClick={handleConnect}
                disabled={isConnecting || isSending}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                {isConnecting ? (
                  <><Spinner size="sm" className="me-1" />Connecting…</>
                ) : (
                  <><BsLink45Deg className="me-1" />Connect Email</>
                )}
              </Button>
            )}
          </div>
        </FormGroup>

        {/* To */}
        <FormGroup>
          <Label className="fw-semibold mb-1">
            To <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="email"
            placeholder="Enter client email address"
            value={toEmail}
            onChange={(e) => {
              setToEmail(e.target.value);
              if (errors.toEmail) setErrors((prev) => ({ ...prev, toEmail: undefined }));
            }}
            invalid={!!errors.toEmail}
          />
          {errors.toEmail && (
            <div className="invalid-feedback">{errors.toEmail}</div>
          )}
        </FormGroup>

        {/* Subject */}
        <FormGroup>
          <Label className="fw-semibold mb-1">
            Subject <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="text"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
            }}
            invalid={!!errors.subject}
          />
          {errors.subject && (
            <div className="invalid-feedback">{errors.subject}</div>
          )}
        </FormGroup>

        {/* Body – rich text editor */}
        <FormGroup>
          <Label className="fw-semibold mb-1">
            Body <span style={{ color: "red" }}>*</span>
          </Label>
          <div
            style={{
              border: errors.body ? "1px solid #dc3545" : "1px solid #ced4da",
              borderRadius: 4,
            }}
          >
            <CKEditor
              editor={ClassicEditor}
              config={{
                licenseKey: "GPL",
                plugins: [
                  Essentials,
                  Paragraph,
                  Bold,
                  Italic,
                  Heading,
                  Underline,
                  Strikethrough,
                  Link,
                  BlockQuote,
                  Undo,
                  Alignment,
                ],
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "|",
                  "link",
                  "blockQuote",
                  "|",
                  "undo",
                  "redo",
                  "|",
                  "alignment",
                ],
              }}
              data={body}
              onChange={(_, editor) => {
                setBody(editor.getData());
                if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
              }}
            />
          </div>
          {errors.body && (
            <div style={{ color: "#dc3545", fontSize: "0.875em", marginTop: 4 }}>
              {errors.body}
            </div>
          )}
        </FormGroup>

        {/* Attachment info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            backgroundColor: "#f1f3f5",
            borderRadius: 6,
            border: "1px dashed #ced4da",
          }}
        >
          <BsPaperclip size={16} style={{ color: "#495057", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#212529" }}>
              {resumeInfo.fileName}
            </span>
            <span style={{ fontSize: 12, color: "#6c757d", marginLeft: 8 }}>
              {resumeInfo.isCandidate
                ? "(Candidate's uploaded resume – auto-attached)"
                : "(OpenWorX-generated CV will be attached by the server)"}
            </span>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={isSending}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#2f479b", borderColor: "#2f479b", minWidth: 120 }}
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Spinner size="sm" className="me-2" />
              Sending…
            </>
          ) : (
            "Send Email"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ComposeEmailModal;
