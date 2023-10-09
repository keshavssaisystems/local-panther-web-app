import React from "react";
import { Card, CardBody, CardText } from "reactstrap";
import "./scheduledInterview.scss";
import { UpcomingVideoDetails } from "./upcomingVideoDetails";

export function UpcomingDetail({
  interviewDetails,
  cancelScheduleData,
  postNotesData,
  postInviteData,
}) {
  return (
    <>
      {interviewDetails !== undefined && (
        <Card className="upcoming-interview">
          <UpcomingVideoDetails
            interviewId={interviewDetails.scheduleinterviewid}
            cancelScheduleData={(e) => cancelScheduleData(e)}
            postNotesData={(e) => postNotesData(e)}
            postInviteData={(e) => postInviteData(e)}
          />
        </Card>
      )}
      {interviewDetails === undefined && (
        <Card className="upcoming-interview">
          <CardBody>
            <CardText className="mb-0 text-center">
              <b>No upcoming interview scheduled...</b>
            </CardText>
          </CardBody>
        </Card>
      )}
    </>
  );
}
