import React from "react";
import { Row, Col } from "reactstrap";
import { DonutChart } from "_components/dashboard/donutChart";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { UpcomingInterviewTable } from "_components/dashboard/upcomingInterviewTable";
import { WidgetCard } from "_components/dashboard/widgetCard";

export default function CustomerDashboard() {
  let cardOptions = [
    {
      title: "Matched jobs",
      count: 20,
      className: "success",
      icon: "lnr-graduation-hat",
    },
    {
      title: "Upcoming interviews",
      count: 20,
      className: "alternate",
      icon: "lnr-calendar-full",
    },
    {
      title: "Pending interviews",
      count: 20,
      className: "warning",
      icon: "lnr-calendar-full",
    },
    {
      title: "New candidate liked",
      count: 20,
      className: "primary",
      icon: "lnr-thumbs-up",
    },
    {
      title: "Matched candidates",
      count: 20,
      className: "danger",
      icon: "lnr-user",
    },
  ];
  return (
    <>
      <div>
        <Row>
          {cardOptions.map((options) => (
            <Col>
              <WidgetCard
                classType={options.className}
                title={options.title}
                count={options.count}
                icon={options.icon}
              />
            </Col>
          ))}
        </Row>
        <Row>
          <Col sm="12" md="7" lg="7">
            <UpcomingInterviewTable />
          </Col>
          <Col sm="12" md="5" lg="5">
            <DonutChart />
          </Col>
        </Row>
        <StackBarChart />
      </div>
    </>
  );
}
