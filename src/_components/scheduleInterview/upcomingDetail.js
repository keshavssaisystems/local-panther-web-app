import React from "react";
import { Card } from "reactstrap";
import "./scheduledInterview.scss";
import { UpcomingVideoDetails } from "./upcomingVideoDetails";
import { UpcomingPhoneDetails } from "./upcomingPhoneDetails";
import { UpcomingInpersonDetails } from "./upcomingInpersonDetails";

export function UpcomingDetail({ interviewDetails }) {
  let type =
    interviewDetails !== undefined
      ? interviewDetails.format.toLowerCase()
      : "video";
  return (
    <>
      <Card className="upcoming-interview">
        {type === "video" && (
          <UpcomingVideoDetails interviewDetails={interviewDetails} />
        )}
        {type === "phone" && (
          <UpcomingPhoneDetails interviewDetails={interviewDetails} />
        )}
        {type === "in-person" && (
          <UpcomingInpersonDetails interviewDetails={interviewDetails} />
        )}
      </Card>
    </>
  );
}
