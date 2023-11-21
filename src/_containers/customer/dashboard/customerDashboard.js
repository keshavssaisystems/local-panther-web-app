import React, { useEffect } from "react";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { DonutChart } from "_components/dashboard/donutChart";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { UpcomingInterviewTable } from "_components/dashboard/upcomingInterviewTable";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import {
  customerDashboardActions,
  createjobActions,
  scheduleInterviewActions,
} from "_store";
import { HorizonatalBarGraph } from "_components/dashboard/horizontalBarGraph";
import { CustomerSlider } from "_components/dashboard/customerSlider";

export default function CustomerDashboard() {
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
      title: "Open jobs",
      count: dashboardCounts.openjobcount,
      className: "success",
      icon: "lnr-graduation-hat",
    },
    {
      title: "Pending interview schedules",
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
      title: "Matched candidate pending to review",
      count: dashboardCounts.matchedcandidatereviewpendingcount,
      className: "danger",
      icon: "lnr-user",
    },
  ];

  return (
    <>
      <div>
        <Row>
          <Col sm="12" md="6" lg="6">
            <WidgetCard cardOptions={cardOptions} />
          </Col>
          <Col sm="12" md="6" lg="6">
            <HorizonatalBarGraph
              graphData={dashboardGraphData.scheduledInterveiwDtos}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <CustomerSlider data={dashboardGraphData.upcomingInterveiwDtos} />
          </Col>
        </Row>
        <StackBarChart
          graphData={dashboardGraphData.candidateStatusByJobDtos}
        />
      </div>
    </>
  );
}
