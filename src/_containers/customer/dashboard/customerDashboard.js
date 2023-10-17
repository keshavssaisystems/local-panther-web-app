import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { DonutChart } from "_components/dashboard/donutChart";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { UpcomingInterviewTable } from "_components/dashboard/upcomingInterviewTable";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import { scheduleInterviewActions } from "_store";
import moment from "moment";

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const getUpcomingData = async function () {
    await dispatch(
      scheduleInterviewActions.getUpcomingInterviewListWOPaginationThunk({
        start: moment().format("YYYY-MM-DDTHH:mm:ss"),
        end: moment().add("2", "days").format("YYYY-MM-DDTHH:mm:ss"),
      })
    );
  };
  useEffect(() => {
    getUpcomingData();
  }, []);
  const upcomingInterviews = useSelector(
    (state) =>
      state.scheduleInterview.upcomingInterviewWOPagination
        .scheduledInterviewList
  );
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
            <UpcomingInterviewTable tableData={upcomingInterviews} />
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
