import React from "react";
import { Row, Col, Card, CardBody, CardText } from "reactstrap";
import "./scheduledInterview.scss";
import {
  BsListStars,
  BsCalendar2Date,
  BsClock,
  BsPersonBoundingBox,
} from "react-icons/bs";
import moment from "moment-timezone";
import { CardPagination } from "../common/cardpagination";
import { getTimezoneDateTime } from "_helpers/helper";

export function UpcomingCard({
  upcomingList,
  selectedInterview,
  getSelectedInterviewId,
  totalRows,
  pageSize,
  page,
  setPage,
  onPageChange,
}) {
  let current = Number(totalRows) / pageSize;
  if (current * pageSize !== totalRows) {
    current++;
  }
  const navigateToInterviewDetail = (scheduleinterviewid) => {
    getSelectedInterviewId(scheduleinterviewid);
  };
  const handlePageChange = (page) => {
    setPage(page);
    onPageChange(page);
  };
  return (
    <>
      {upcomingList?.length > 0 &&
        upcomingList?.map((interview) => (
          <Card
            key={interview.scheduleinterviewid}
            className={
              selectedInterview === interview.scheduleinterviewid
                ? "mb-2 card-border-custom upcomming-card"
                : "mb-2 upcomming-card"
            }
            onClick={() =>
              navigateToInterviewDetail(interview.scheduleinterviewid)
            }
          >
            <CardBody>
              <Row>
                <Col md="12">
                  <Row className="mb-2">
                    <Col md="7">
                      <div className="job-title">{interview.candidatename}</div>
                      <div className="muted-name">
                        {" "}
                        Applied for {interview.jobtitle}
                      </div>
                    </Col>
                    {interview.isaccepted === true &&
                      interview.isrejected === false && (
                        <Col md="5">
                          <div className="mb-2 me-2 badge bg-success float-end badge-custom">
                            Accepted
                          </div>
                        </Col>
                      )}
                    {interview.isaccepted === false &&
                      interview.isrejected === false && (
                        <Col md="5">
                          <div className="mb-2 me-2 badge bg-warning float-end badge-custom">
                            No response
                          </div>
                        </Col>
                      )}
                    {((interview.isrejected === true &&
                      interview.isaccepted === true) ||
                      interview.isrejected === true) && (
                      <Col md="5">
                        <div className="mb-2 me-2 badge bg-danger float-end badge-custom">
                          Rejected
                        </div>
                      </Col>
                    )}
                  </Row>
                  <p className="job-details">
                    <BsCalendar2Date className="icon-settings" /> Scheduled for{" "}
                    {getTimezoneDateTime(
                      moment(interview.scheduledate).format("MMM D, YYYY") +
                        " " +
                        interview.starttime,
                      "MM/DD/YYYY, hh:mm a"
                    )}
                  </p>
                  <p className="job-details">
                    <BsListStars className="icon-settings" /> Mode-{" "}
                    {interview.format}
                  </p>
                  <p className="job-details">
                    <BsClock className="icon-settings" /> Request sent on{" "}
                    {getTimezoneDateTime(interview.createddate, "MM/DD/YYYY")}
                  </p>
                  <p className="job-details">
                    <BsPersonBoundingBox className="icon-settings" />{" "}
                    Interviewer -{" "}
                    {interview.intervieweremailids === ""
                      ? "No interviewer"
                      : interview.intervieweremailids}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        ))}
      {upcomingList?.length === 0 && (
        <Card>
          <CardBody>
            <CardText className="mb-0 text-center">
              <b>No upcoming interview scheduled...</b>
            </CardText>
          </CardBody>
        </Card>
      )}
      {upcomingList?.length > 0 && (
        <CardPagination
          totalPages={current}
          pageIndex={page}
          onCallBack={(evt) => handlePageChange(evt)}
        ></CardPagination>
      )}
    </>
  );
}
