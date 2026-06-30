import React, { useState } from "react";
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
  Table,
  Badge,
} from "reactstrap";
import moment from "moment";

/**
 * HMCounterOfferModal
 * Used by Hiring Managers / Recruiters to:
 *  - Review all counter offers submitted by the candidate
 *  - Record new counter offer details on behalf of the candidate
 *  - Edit existing active counter offers
 */
export const HMCounterOfferModal = ({
  isOpen,
  onClose,
  onSubmit,              // (payload, mode: "post" | "put") => void
  submitLoading,
  counterOffers,         // array of existing counter offer records fetched from GET API
  counterOffersFetching, // bool – GET in progress
  candidateName,
  jobTitle,
}) => {
  const [counterofferamount, setCounterofferamount] = useState("");
  const [proposedstartdate, setProposedstartdate] = useState("");
  const [requestedbenefits, setRequestedbenefits] = useState("");
  const [otherrequests, setOtherrequests] = useState("");
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  // null = adding new; <id> = editing that record
  const [editingId, setEditingId] = useState(null);

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
      counterofferamount: counterofferamount,
      proposedstartdate,
      requestedbenefits: requestedbenefits.trim(),
      otherrequests: otherrequests.trim(),
      isactive: 1,
    };
    if (editingId !== null) {
      onSubmit({ id: editingId, ...payload }, "put");
    } else {
      onSubmit(payload, "post");
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setCounterofferamount("");
    setProposedstartdate("");
    setRequestedbenefits("");
    setOtherrequests("");
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (offer) => {
    setEditingId(offer.jobcounterofferid);
    setCounterofferamount(offer.counterofferamount ?? "");
    setProposedstartdate(
      offer.proposedstartdate
        ? moment.utc(offer.proposedstartdate).format("YYYY-MM-DD")
        : ""
    );
    setRequestedbenefits(offer.requestedbenefits ?? "");
    setOtherrequests(offer.otherrequests ?? "");
    setErrors({});
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setCounterofferamount("");
    setProposedstartdate("");
    setRequestedbenefits("");
    setOtherrequests("");
    setErrors({});
  };

  const handleClose = () => {
    handleCancelForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg" backdrop="static">
      <ModalHeader toggle={handleClose}>
        Counter Offer Details
        {candidateName ? (
          <small className="text-muted ms-2" style={{ fontSize: "14px" }}>
            — {candidateName}
            {jobTitle ? ` · ${jobTitle}` : ""}
          </small>
        ) : null}
      </ModalHeader>

      <ModalBody style={{ maxHeight: "75vh", overflowY: "auto" }}>
        {/* ── Counter Offer History ───────────────────────────────── */}
        <div className="mb-3">
          <div
            className="d-flex justify-content-between align-items-center mb-2"
          >
            <h6 className="mb-0" style={{ fontWeight: 600 }}>
              Counter Offer History
            </h6>
            {!showForm && (
              <Button
                size="sm"
                color="primary"
                outline
                onClick={openAddForm}
              >
                + Record Counter Offer
              </Button>
            )}
          </div>

          {counterOffersFetching ? (
            <div className="text-center py-3">
              <Spinner size="sm" /> &nbsp;Loading…
            </div>
          ) : counterOffers && counterOffers.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <Table bordered hover size="sm" className="mb-0">
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th style={{ minWidth: 40 }}>#</th>
                    <th style={{ minWidth: 130 }}>Amount</th>
                    <th style={{ minWidth: 130 }}>Proposed Start</th>
                    <th style={{ minWidth: 160 }}>Requested Benefits</th>
                    <th style={{ minWidth: 160 }}>Other Requests</th>
                    <th style={{ minWidth: 90 }}>Status</th>
                    <th style={{ minWidth: 110 }}>Recorded On</th>
                    <th style={{ minWidth: 70 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {counterOffers.map((offer, index) => (
                    <tr key={offer.jobcounterofferid ?? index}>
                      <td>{index + 1}</td>
                      <td>
                        {offer.counterofferamount
                          ? `$${new Intl.NumberFormat("en-US").format(offer.counterofferamount)}`
                          : "-"}
                      </td>
                      <td>
                        {offer.proposedstartdate
                          ? moment.utc(offer.proposedstartdate).format("MM/DD/YYYY")
                          : "-"}
                      </td>
                      <td style={{ whiteSpace: "pre-wrap", maxWidth: 160 }}>
                        {offer.requestedbenefits || "-"}
                      </td>
                      <td style={{ whiteSpace: "pre-wrap", maxWidth: 160 }}>
                        {offer.otherrequests || "-"}
                      </td>
                      <td>
                        <Badge color={offer.isactive ? "warning" : "secondary"}>
                          {offer.isactive ? "Active" : "Closed"}
                        </Badge>
                      </td>
                      <td>
                        {offer.createddate
                          ? moment.utc(offer.createddate).format("MM/DD/YYYY")
                          : "-"}
                      </td>
                      <td>
                        {offer.isactive ? (
                          <Button
                            size="sm"
                            color="link"
                            className="p-0"
                            onClick={() => openEditForm(offer)}
                            disabled={showForm && editingId !== offer.jobcounterofferid}
                          >
                            Edit
                          </Button>
                        ) : (
                          <span className="text-muted" style={{ fontSize: "12px" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              No counter offers recorded yet.
            </p>
          )}
        </div>

        {/* ── Record New / Edit Counter Offer Form ────────────────── */}
        {showForm && (
          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#fafbfc",
              marginTop: "8px",
            }}
          >
            <h6 className="mb-3" style={{ fontWeight: 600 }}>
              {editingId !== null ? "Edit Counter Offer" : "Record New Counter Offer"}
            </h6>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="hm-counterofferamount">
                    Counter Offer Amount{" "}
                    <span style={{ color: "#ff0000" }}>*</span>
                  </Label>
                  <InputGroup>
                    <InputGroupText>$</InputGroupText>
                    <Input
                      id="hm-counterofferamount"
                      name="counterofferamount"
                      type="number"
                      step="any"
                      min={0}
                      placeholder="Enter counter offer amount"
                      value={counterofferamount}
                      onChange={(e) => setCounterofferamount(e.target.value)}
                      invalid={!!errors.counterofferamount}
                    />
                  </InputGroup>
                  {errors.counterofferamount && (
                    <FormText color="danger">
                      {errors.counterofferamount}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="hm-proposedstartdate">
                    Proposed Start Date{" "}
                    <span style={{ color: "#ff0000" }}>*</span>
                  </Label>
                  <Input
                    id="hm-proposedstartdate"
                    name="proposedstartdate"
                    type="date"
                    value={proposedstartdate}
                    onChange={(e) => setProposedstartdate(e.target.value)}
                    invalid={!!errors.proposedstartdate}
                  />
                  {errors.proposedstartdate && (
                    <div className="text-danger" style={{ fontSize: "12px" }}>
                      {errors.proposedstartdate}
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="hm-requestedbenefits">Requested Benefits</Label>
              <Input
                id="hm-requestedbenefits"
                name="requestedbenefits"
                type="textarea"
                rows={3}
                placeholder="Describe the candidate's requested benefits (e.g. health insurance, cab service)"
                value={requestedbenefits}
                onChange={(e) => setRequestedbenefits(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-0">
              <Label for="hm-otherrequests">Other Requests / Comments</Label>
              <Input
                id="hm-otherrequests"
                name="otherrequests"
                type="textarea"
                rows={3}
                placeholder="Any other requests or comments from the candidate"
                value={otherrequests}
                onChange={(e) => setOtherrequests(e.target.value)}
              />
            </FormGroup>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {showForm ? (
          <>
            <Button color="secondary" onClick={handleCancelForm} disabled={submitLoading}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? <Spinner size="sm" className="me-1" /> : null}
              {editingId !== null ? "Update Counter Offer" : "Save Counter Offer"}
            </Button>
          </>
        ) : (
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
