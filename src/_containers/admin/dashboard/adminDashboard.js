import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import {
  customerDashboardActions,
  createjobActions,
  scheduleInterviewActions,
  adminDashboardSliceActions,
} from "_store";
import { WidgetCounter } from "_components/dashboard/widgetCounter";
import { Statistics } from "_components/dashboard/statistics";
import { MissingInterview } from "_components/dashboard/missingInterview";
import { OpenJobsGraph } from "_components/dashboard/openJobsGraph";
import { AdminSlider } from "_components/dashboard/adminSlider";
import moment from "moment";
import { getTimezoneDateTime } from "_helpers/helper";

export function AdminDashboard() {
  const dispatch = useDispatch();
  const getDashboardCounts = async function () {
    await dispatch(adminDashboardSliceActions.getDashboardCountThunk());
  };
  const getMissedInterviewList = async function () {
    await dispatch(adminDashboardSliceActions.getMissedInterviewThunk());
  };
  const getStatistics = async function () {
    await dispatch(
      adminDashboardSliceActions.getAdminChartStatisticsDataThunk()
    );
  };
  const getCompanyDetails = async function () {
    await dispatch(
      createjobActions.getCustomerDetailsThunk(
        JSON.parse(localStorage.getItem("userDetails")).InternalUserId
      )
    );
  };
  useEffect(() => {
    getCompanyDetails();
    getMissedInterviewList();
    getDashboardCounts();
    getStatistics();
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
  }, []);
  const dashboardCounts = useSelector(
    (state) => state.adminDashboard.dashboardCountDetails
  );
  const missedInterviewList = useSelector(
    (state) => state.adminDashboard.missedInterviewList
  );
  const statisticsData = useSelector(
    (state) => state.adminDashboard.statisticsData
  );
  const dashboardGraphData = useSelector(
    (state) => state.customerDashboard.dashboardGraphData
  );
  const scheduledInterview = useSelector(
    (state) => state.scheduleInterview.allInterview.scheduledInterviewList
  );
  let today = moment().format("YYYY-MM-DD HH:mm:ss");
  let upcomingInterview = scheduledInterview?.filter(
    (value) =>
      getTimezoneDateTime(
        moment(value.scheduledate).format("YYYY-MM-DD") + "T" + value.starttime,
        "YYYY-MM-DD HH:mm:ss"
      ) >= today
  );
  let cardOptions = [
    {
      title: "Active clients",
      count: dashboardCounts.activecompanycount,
      className: "primary",
      icon: "lnr-briefcase",
    },
    {
      title: "Active hiring manager",
      count: dashboardCounts.activecustomercount,
      className: "info",
      icon: "lnr-briefcase",
    },
    {
      title: "Active candidates",
      count: dashboardCounts.activecandidatecount,
      className: "danger",
      icon: "lnr-briefcase",
    },
    {
      title: "Open jobs",
      count: dashboardCounts.openjobcount,
      className: "success",
      icon: "lnr-briefcase",
    },
  ];
  let dashCardUI = [
    {
      id: 0,
      subTitle: ".",
      color: "border-success",
      count: dashboardCounts.todaysinterviewscheduledcount,
      arrowDirection: "faAngleUp",
      arrowColor: "text-success",
      title: "Today's interviews",
      apiVariable: "activecompanycount",
    },
    {
      id: 1,
      subTitle: "Next 7 days",
      color: "border-success",
      count: dashboardCounts.upcominginterviewscheduledcount,
      arrowDirection: "faAngleUp",
      arrowColor: "text-success",
      title: "Upcoming interviews",
      apiVariable: "activecustomercount",
    },
    {
      id: 2,
      subTitle: "Last 30 days",
      color: "border-danger",
      count: dashboardCounts.pastinterviewscheduledcount,
      arrowDirection: "faAngleDown",
      arrowColor: "text-danger",
      title: "Interviews history",
      apiVariable: "activecandidatecount",
    },
    {
      id: 3,
      subTitle: "Last 30 days",
      color: "border-success",
      count: dashboardCounts.newcandidateregistrationcount,
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
            <Statistics graphData={statisticsData} />
          </Col>
          <Col sm="12" md="6" lg="6">
            <WidgetCard cardOptions={cardOptions} />
          </Col>
        </Row>
        <Row>
          <WidgetCounter cardOptions={dashCardUI} />
        </Row>
        <Row>
          <Col sm="12" md="6" lg="6">
            <AdminSlider data={upcomingInterview} />
          </Col>
          <Col sm="6" md="3" lg="3">
            <MissingInterview cardOptions={missedInterviewList} />
          </Col>
          <Col sm="6" md="3" lg="3">
            <OpenJobsGraph
              openJobsCount={dashboardCounts.openjobcount}
              graphData={dashboardGraphData.scheduledInterveiwDtos}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
