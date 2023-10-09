import React from "react";
import { Card, CardBody, CardText } from "reactstrap";
import "./scheduledInterview.scss";
import { UpcomingVideoDetails } from "./upcomingVideoDetails";
import { UpcomingPhoneDetails } from "./upcomingPhoneDetails";
import { UpcomingInpersonDetails } from "./upcomingInpersonDetails";

export function UpcomingDetail({
  interviewDetails,
  cancelScheduleData,
  postNotesData,
  postInviteData,
}) {
  console.log(interviewDetails);
  let type =
    interviewDetails !== undefined
      ? interviewDetails.format.toLowerCase()
      : "video";
  return (
    <>
      {interviewDetails !== undefined && (
        <Card className="upcoming-interview">
          {type === "video" && (
            <UpcomingVideoDetails
              interviewId={interviewDetails.scheduleinterviewid}
              cancelScheduleData={(e) => cancelScheduleData(e)}
              postNotesData={(e) => postNotesData(e)}
              postInviteData={(e) => postInviteData(e)}
            />
          )}
          {type === "phone" && (
            <UpcomingPhoneDetails interviewDetails={interviewDetails} />
          )}
          {type === "in-person" && (
            <UpcomingInpersonDetails interviewDetails={interviewDetails} />
          )}
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
