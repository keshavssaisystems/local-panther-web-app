import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  Spinner,
} from "reactstrap";

export const CounterOfferModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  jobOffer,
  existingCounterOffer = null,
}) => {
  const [counterofferamount, setCounterofferamount] = useState("");
  const [proposedstartdate, setProposedstartdate] = useState("");
  const [requestedbenefits, setRequestedbenefits] = useState("");
  const [otherrequests, setOtherrequests] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && existingCounterOffer) {
      setCounterofferamount(existingCounterOffer.counterofferamount ?? "");
      setProposedstartdate(existingCounterOffer.proposedstartdate ? moment.utc(existingCounterOffer.proposedstartdate).format("YYYY-MM-DD") : "");
      setRequestedbenefits(existingCounterOffer.requestedbenefits ?? "");
      setOtherrequests(existingCounterOffer.otherrequests ?? "");
      setErrors({});
    } else if (!isOpen) {
      setCounterofferamount("");
      setProposedstartdate("");
      setRequestedbenefits("");
      setOtherrequests("");
      setErrors({});
    }
  }, [isOpen, existingCounterOffer]);

  const validate = () => {
    const newErrors = {};
    if (!counterofferamount || parseInt(counterofferamount) === 0) {
      newErrors.counterofferamount = "Please enter a valid counter offer amount.";
    }
    if (!proposedstartdate) {
      newErrors.proposedstartdate = "Proposed start date is required.";
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const payload = {
      jobofferid: jobOffer?.jobofferid,
      counterofferamount: counterofferamount,
      proposedstartdate,
      requestedbenefits: requestedbenefits.trim(),
      otherrequests: otherrequests.trim(),
      isactive: 1,
    };
    onSubmit(payload, "post");
  };

  const handleClose = () => {
    setCounterofferamount("");
    setProposedstartdate("");
    setRequestedbenefits("");
    setOtherrequests("");
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" backdrop="static">
      <ModalHeader toggle={handleClose}>
        Counter Offer Details
        {existingCounterOffer && (
          <span
            className="ms-2 badge bg-success"
            style={{ fontSize: "11px", verticalAlign: "middle" }}
          >
            Submitted
          </span>
        )}
      </ModalHeader>
      <ModalBody>
        {existingCounterOffer && (
          <div
            className="mb-3 px-3 py-2"
            style={{
              backgroundColor: "#f0fff4",
              borderLeft: "4px solid #28a745",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            You have already submitted a counter offer for this job offer.
          </div>
        )}
        {jobOffer?.salary && (
          <div
            className="mb-3 px-3 py-2"
            style={{
              backgroundColor: "#f0f4ff",
              borderLeft: "4px solid #4a6cf7",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <span className="text-muted me-1">Offered Salary:</span>
            <strong>
              ${new Intl.NumberFormat("en-US").format(jobOffer.salary)}
            </strong>
            {jobOffer.payperiodtype && (
              <span className="text-muted ms-1">/ {jobOffer.payperiodtype}</span>
            )}
          </div>
        )}
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="counterofferamount">
                Counter Offer Amount{" "}
                <span style={{ color: "#ff0000" }}>*</span>
              </Label>
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id="counterofferamount"
                  name="counterofferamount"
                  type="number"
                  step="any"
                  min={0}
                  placeholder="Enter counter offer amount"
                  value={counterofferamount}
                  onChange={(e) => setCounterofferamount(e.target.value)}
                  invalid={!!errors.counterofferamount}
                  disabled={!!existingCounterOffer}
                />
              </InputGroup>
              {errors.counterofferamount && (
                <FormText color="danger">{errors.counterofferamount}</FormText>
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="proposedstartdate">
                Proposed Start Date{" "}
                <span style={{ color: "#ff0000" }}>*</span>
              </Label>
              <Input
                id="proposedstartdate"
                name="proposedstartdate"
                type="date"
                value={proposedstartdate}
                onChange={(e) => setProposedstartdate(e.target.value)}
                invalid={!!errors.proposedstartdate}
                disabled={!!existingCounterOffer}
              />
              {errors.proposedstartdate && (
                <FormText color="danger">{errors.proposedstartdate}</FormText>
              )}
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="requestedbenefits">Requested Benefits</Label>
          {existingCounterOffer ? (
            <div className="form-control-plaintext">{requestedbenefits || <span className="text-muted">—</span>}</div>
          ) : (
            <Input
              id="requestedbenefits"
              name="requestedbenefits"
              type="textarea"
              rows={3}
              placeholder="Describe the requested benefits (e.g. health insurance, cab service)"
              value={requestedbenefits}
              onChange={(e) => setRequestedbenefits(e.target.value)}
            />
          )}
        </FormGroup>
        <FormGroup className="mb-0">
          <Label for="otherrequests">Other Requests / Comments</Label>
          {existingCounterOffer ? (
            <div className="form-control-plaintext">{otherrequests || <span className="text-muted">—</span>}</div>
          ) : (
            <Input
              id="otherrequests"
              name="otherrequests"
              type="textarea"
              rows={3}
              placeholder="Any other requests or comments (e.g. signing bonus, remote work)"
              value={otherrequests}
              onChange={(e) => setOtherrequests(e.target.value)}
            />
          )}
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        {existingCounterOffer ? (
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        ) : (
          <>
            <Button color="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <Spinner size="sm" className="me-1" /> : null}
              Submit Counter Offer
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};
