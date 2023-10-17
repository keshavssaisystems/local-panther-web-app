import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { DonutChart } from "_components/dashboard/donutChart";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { UpcomingInterviewTable } from "_components/dashboard/upcomingInterviewTable";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import { scheduleInterviewActions, customerDashboardActions } from "_store";
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
  const getDashboardCounts = async function () {
    await dispatch(customerDashboardActions.getCustomerDashboardThunk());
  };
  useEffect(() => {
    getUpcomingData();
    getDashboardCounts();
  }, []);
  const upcomingInterviews = useSelector(
    (state) =>
      state.scheduleInterview.upcomingInterviewWOPagination
        .scheduledInterviewList
  );
  const dashboardCounts = useSelector(
    (state) => state.customerDashboard.dashboardCounts
  );
  let cardOptions = [
    {
      title: "Matched jobs",
      count: dashboardCounts.openjobcount,
      className: "success",
      icon: "lnr-graduation-hat",
    },
    {
      title: "Upcoming interviews",
      count: dashboardCounts.upcominginterviewscheduledcount,
      className: "alternate",
      icon: "lnr-calendar-full",
    },
    {
      title: "Pending interviews",
      count: dashboardCounts.upcominginterviewscheduledcount,
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
