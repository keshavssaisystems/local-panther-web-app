import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Form,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
} from "reactstrap";
import "./scheduledInterview.scss";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export function InterviewFeedback({
  interviewId,
  postFeedbackData,
  zoomScreen = false,
  onCancel,
  interviewDetails
  , externalName, externalEmail
}) {
  const interviewStatus = useSelector(
    (state) => state.scheduleInterview.interviewStatus
  );
  const interviewRounds = useSelector((state) => state.dropdown.interviewRounds);
  const isLastInterviewRound = useMemo(() => {
    if (!interviewDetails || !Array.isArray(interviewRounds) || interviewRounds.length === 0) {
      return false;
    }

    const normalizedRounds = interviewRounds
      .map((round) => ({
        id: Number(round?.id),
        name: String(round?.name || "").trim().toLowerCase(),
      }))
      .filter((round) => Number.isFinite(round.id));

    if (normalizedRounds.length === 0) {
      return false;
    }

    const lastRound = normalizedRounds.reduce(
      (maxRound, currentRound) =>
        currentRound.id > maxRound.id ? currentRound : maxRound,
      normalizedRounds[0]
    );

    const currentRoundId = Number(
      interviewDetails?.interviewroundid ??
      interviewDetails?.roundid ??
      interviewDetails?.round
    );

    if (Number.isFinite(currentRoundId)) {
      return currentRoundId === lastRound.id;
    }

    const currentRoundName = String(
      interviewDetails?.roundname ?? interviewDetails?.round ?? ""
    )
      .trim()
      .toLowerCase();

    return currentRoundName !== "" && currentRoundName === lastRound.name;
  }, [interviewDetails, interviewRounds]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const getFormData = (event) => {
    event.preventDefault();
    const name = externalName || localStorage.getItem("externalMemberName") || localStorage.getItem("externalName") || "";
    const email = externalEmail || localStorage.getItem("externalMemberEmail") || localStorage.getItem("externalEmail") || "";
    let data = {
      scheduleinterviewid: interviewId ? Number(interviewId) : 0,
      interviewfeedback: event.target.elements.interviewFeedback.value,
      interviewstatusid: Number(event.target.elements.interviewStatus.value),
      interviewroundid: interviewDetails?.interviewroundid ? Number(interviewDetails.interviewroundid) : null,
      Name: name,
      Email: email,
      isExternal: !!(name || email),
    };
    postFeedbackData(data);
    setShowSuccessMessage(true);
  };
  return (
    <>
      <Card>
        <CardBody>
          <Form onSubmit={(e) => getFormData(e)}>
            <Col md="12">
              {showSuccessMessage === true && (
                <p className="float-end">
                  <FormText color="success">
                    Interview feedback submitted successfully!
                  </FormText>
                </p>
              )}
              <FormGroup>
                <Label for="interviewFeedback" className="fw-semi-bold">
                  Select Interview feedback
                </Label>
                <Input type="select" name="interviewStatus">
                  {interviewStatus?.length > 0 &&
                    interviewStatus.map((data) => {
                      return (
                        <option
                          value={data.id}
                          key={data.id}
                          disabled={Number(data.id) === 5 && isLastInterviewRound}
                        >
                          {data.name}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
              <FormGroup>
                <Input
                  type="textarea"
                  name="interviewFeedbacktext"
                  id="interviewFeedback"
                  placeholder="Enter interview feedback"
                />
              </FormGroup>
            </Col>
            <div className="float-end">
              <Button size="sm" color="primary" type="submit">
                Submit interview feedback
              </Button>
              {zoomScreen && (
                <Button
                  onClick={() => {
                    onCancel();
                  }}
                  size="sm"
                  className="ms-2"
                >
                  Cancel{" "}
                </Button>
              )}
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}

InterviewFeedback.propTypes = {
  interviewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  postFeedbackData: PropTypes.func,
  zoomScreen: PropTypes.bool,
  onCancel: PropTypes.func,
  interviewDetails: PropTypes.shape({
    interviewroundid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    roundid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    round: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    roundname: PropTypes.string,
  }),
  externalName: PropTypes.string,
  externalEmail: PropTypes.string,
  
};
