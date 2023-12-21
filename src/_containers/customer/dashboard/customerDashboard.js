import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import {
  customerDashboardActions,
  createjobActions,
  scheduleInterviewActions,
  dropdownActions,
  customerCandidateListsActions,
} from "_store";
import { HorizonatalBarGraph } from "_components/dashboard/horizontalBarGraph";
import { CustomerSlider } from "_components/dashboard/customerSlider";
import moment from "moment/moment";

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
  const getDashboardJobsDataCount = async function () {
    await dispatch(
      customerDashboardActions.getCustomerDashboardJobsDataCountThunk()
    );
  };
  const getDashboardGraphData = async function () {
    await dispatch(
      customerDashboardActions.getCustomerDashboardGraphDataThunk(
        moment.utc().format("YYYY-MM-DDTHH:mm:ss")
      )
    );
  };
  useEffect(() => {
    getCompanyDetails();
    getDashboardGraphData();
    getDashboardCounts();
    getDashboardJobsDataCount();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    dispatch(customerDashboardActions.getSendTimezoneBeckendThunk());
    dispatch(
      dropdownActions.getSubsidiaryListThunk(localStorage.getItem("companyid"))
    );
    dispatch(customerCandidateListsActions.getDurationOptions());
  }, []);
  const dashboardCounts = useSelector(
    (state) => state.customerDashboard.dashboardCounts
  );
  console.log(dashboardCounts);
  const dashboardGraphData = useSelector(
    (state) => state.customerDashboard.dashboardGraphData
  );
  console.log(dashboardGraphData);
  const dashboardJobsDataCount = useSelector(
    (state) => state.customerDashboard.dashboardJobsDataCount
  );
  let cardOptions = [
    {
      title: "Open jobs",
      count: dashboardCounts.openjobcount,
      className: "primary",
      icon: "lnr-graduation-hat",
      path: "/job-list",
    },
    {
      title: "Pending interview",
      count: dashboardCounts.pendinginterviewschedulescount,
      className: "info",
      icon: "lnr-calendar-full",
      path: "/scheduled-interview",
    },
    {
      title: "Liked candidates",
      count: dashboardCounts.newcandidatelikedcount,
      className: "success",
      icon: "lnr-thumbs-up",
      path: "/candidate-list/liked",
    },
    {
      title: "Matched candidate pending to review",
      count: dashboardCounts.matchedcandidatereviewpendingcount,
      className: "danger",
      icon: "lnr-user",
      path: "/candidate-list",
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
          graphData={dashboardJobsDataCount.customerDashboardJobDataCountList}
        />
      </div>
    </>
  );
}
