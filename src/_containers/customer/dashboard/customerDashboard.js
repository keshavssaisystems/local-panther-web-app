import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { DonutChart } from "_components/dashboard/donutChart";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { UpcomingInterviewTable } from "_components/dashboard/upcomingInterviewTable";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import { customerDashboardActions } from "_store";

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const getDashboardCounts = async function () {
    await dispatch(customerDashboardActions.getCustomerDashboardThunk());
  };
  const getDashboardGraphData = async function () {
    await dispatch(
      customerDashboardActions.getCustomerDashboardGraphDataThunk()
    );
  };
  useEffect(() => {
    getDashboardGraphData();
    getDashboardCounts();
  }, []);
  const dashboardCounts = useSelector(
    (state) => state.customerDashboard.dashboardCounts
  );
  const dashboardGraphData = useSelector(
    (state) => state.customerDashboard.dashboardGraphData
  );
  let cardOptions = [
    {
      title: "Open jobs",
      count: dashboardCounts.openjobcount,
      className: "success",
      icon: "lnr-graduation-hat",
    },
    {
      title: "Upcoming interviews",
      count: dashboardCounts.upcominginterviewcount,
      className: "alternate",
      icon: "lnr-calendar-full",
    },
    {
      title: "Pending interviews",
      count: dashboardCounts.pendinginterviewschedulescount,
      className: "warning",
      icon: "lnr-calendar-full",
    },
    {
      title: "New candidate liked",
      count: dashboardCounts.newcandidatelikedcount,
      className: "primary",
      icon: "lnr-thumbs-up",
    },
    {
      title: "Matched candidates",
      count: dashboardCounts.matchedcandidatereviewpendingcount,
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
            <UpcomingInterviewTable
              tableData={dashboardGraphData.upcomingInterveiwDtos}
            />
          </Col>
          <Col sm="12" md="5" lg="5">
            <DonutChart graphData={dashboardGraphData.scheduledInterveiwDtos} />
          </Col>
        </Row>
        <StackBarChart
          graphData={dashboardGraphData.candidateStatusByJobDtos}
        />
      </div>
    </>
  );
}
