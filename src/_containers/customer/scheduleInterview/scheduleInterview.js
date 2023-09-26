import React, { useState } from "react";
import Tabs from "react-responsive-tabs";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { Row, Col, Card, Container } from "reactstrap";
import "./scheduleInterview.scss";
import { ScheduleInterviewList } from "_components/scheduleInterview/scheduleInterviewList";
import { UpcomingCard } from "_components/scheduleInterview/upcomingCard";
import { UpcomingDetail } from "_components/scheduleInterview/upcomingDetail";

export function ScheduleInterview() {
  const getSimpleTabs = () =>
    [
      {
        name: "Availablility",
        content:
          "George Washington (February 22, 1732 – December 14, 1799) was the first President of the United States...",
      },
      {
        name: "Upcoming",
        content: (
          <>
            <Row>
              <Col lg="4">
                <UpcomingCard />
              </Col>
              <Col lg="8">
                <UpcomingDetail />
              </Col>
            </Row>
          </>
        ),
      },
      {
        name: "Calendar",
        content:
          "Thomas Jefferson (April 13 1743 – July 4, 1826) was an American lawyer",
      },
      {
        name: "Schedule interview",
        content: (
          <>
            <ScheduleInterviewList />
          </>
        ),
      },
    ].map(({ name, content }, index) => ({
      key: index,
      title: name,
      getContent: () => content,
    }));

  const [toggleVar, setToggleVar] = useState(1);
  const toggle = (tab) => {
    if (toggleVar !== tab) {
      setToggleVar(tab);
    }
  };

  return (
    <>
      <PageTitle heading="Schedule Interview" icon={titlelogo} />
      <Container fluid className="card-schedule-interview">
        <Row>
          <Col md="12">
            <Card className="mb-3 card-tabs card-tabs-animated ">
              <Tabs
                tabsWrapperClass="card-header"
                activeTab={toggleVar}
                showMore
                transform={false}
                showInkBar
                items={getSimpleTabs()}
                selectedTabKey={0}
                transformWidth={400}
                toggle={toggle(toggleVar)}
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
