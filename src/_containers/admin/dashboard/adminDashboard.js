import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import {
  customerDashboardActions,
  createjobActions,
  scheduleInterviewActions,
} from "_store";
import { HorizonatalBarGraph } from "_components/dashboard/horizontalBarGraph";
import { CustomerSlider } from "_components/dashboard/customerSlider";
import { WidgetCounter } from "_components/dashboard/widgetCounter";
import { Statistics } from "_components/dashboard/statistics";
import { MissingInterview } from "_components/dashboard/missingInterview";
import { OpenJobsGraph } from "_components/dashboard/openJobsGraph";

export function AdminDashboard() {
  const dispatch = useDispatch();
  const getDashboardCounts = async function () {
    await dispatch(customerDashboardActions.getCustomerDashboardThunk());
  };
  const getCompanyDetails = async function () {
    await dispatch(
      createjobActions.getCustomerDetailsThunk(
        JSON.parse(localStorage.getItem("userDetails")).InternalUserId
      )
    );
  };
  const getDashboardGraphData = async function () {
    await dispatch(
      customerDashboardActions.getCustomerDashboardGraphDataThunk()
    );
  };
  useEffect(() => {
    getCompanyDetails();
    getDashboardGraphData();
    getDashboardCounts();
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
  }, []);
  const dashboardCounts = useSelector(
    (state) => state.customerDashboard.dashboardCounts
  );
  const dashboardGraphData = useSelector(
    (state) => state.customerDashboard.dashboardGraphData
  );
  let cardOptions = [
    {
      title: "Active clients",
      count: dashboardCounts.openjobcount,
      className: "primary",
      icon: "lnr-briefcase",
    },
    {
      title: "Active hiring manager",
      count: dashboardCounts.pendinginterviewschedulescount,
      className: "info",
      icon: "lnr-briefcase",
    },
    {
      title: "Active candidates",
      count: dashboardCounts.newcandidatelikedcount,
      className: "danger",
      icon: "lnr-briefcase",
    },
    {
      title: "Open jobs",
      count: dashboardCounts.matchedcandidatereviewpendingcount,
      className: "success",
      icon: "lnr-briefcase",
    },
  ];
  const dashCardUI = [
    {
      id: 0,
      subTitle: ".",
      color: "border-primary",
      count: 0,
      arrowDirection: "faAngleUp",
      arrowColor: "text-success",
      title: "Today's interviews",
      apiVariable: "activecompanycount",
    },
    {
      id: 1,
      subTitle: "Next 7 days",
      color: "border-danger",
      count: 0,
      arrowDirection: "faAngleUp",
      arrowColor: "text-success",
      title: "Upcoming interviews",
      apiVariable: "activecustomercount",
    },
    {
      id: 2,
      subTitle: "Last 30 days",
      color: "border-warning",
      count: 0,
      arrowDirection: "faAngleDown",
      arrowColor: "text-danger",
      title: "Interviews history",
      apiVariable: "activecandidatecount",
    },
    {
      id: 3,
      subTitle: "Last 30 days",
      color: "border-success",
      count: 0,
      arrowDirection: "faAngleUp",
      arrowColor: "text-success",
      title: "New candidates registrations",
      apiVariable: "newcandidateregistrationcount",
    },
  ];

  return (
    <>
      <div>
        <Row>
          <Col sm="12" md="6" lg="6">
            <Statistics graphData={dashboardGraphData.scheduledInterveiwDtos} />
          </Col>
          <Col sm="12" md="6" lg="6">
            <WidgetCard cardOptions={cardOptions} />
          </Col>
        </Row>
        <Row>
          <WidgetCounter cardOptions={dashCardUI} />
        </Row>
        <Row>
          <Col sm="12" md="6" lg="6"></Col>
          <Col sm="6" md="3" lg="3">
            <MissingInterview cardOptions={cardOptions} />
          </Col>
          <Col sm="6" md="3" lg="3">
            <OpenJobsGraph
              graphData={dashboardGraphData.scheduledInterveiwDtos}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
