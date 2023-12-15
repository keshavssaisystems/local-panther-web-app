import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import {
  createjobActions,
  scheduleInterviewActions,
  adminDashboardSliceActions,
  customerDashboardActions,
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
  const getAnalyiticalCounts = async function () {
    await dispatch(
      adminDashboardSliceActions.getDashboardAnalyticsCountThunk()
    );
  };
  useEffect(() => {
    getCompanyDetails();
    getMissedInterviewList();
    getDashboardCounts();
    getStatistics();
    getAnalyiticalCounts();
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    dispatch(customerDashboardActions.getSendTimezoneBeckendThunk());
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
  const scheduledInterview = useSelector(
    (state) => state.scheduleInterview.allInterview.scheduledInterviewList
  );
  const analyiticalCounts = useSelector(
    (state) => state.adminDashboard.dashboardCountMidDetails[0]
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
      title: "Active companies",
      count: dashboardCounts.activecompanycount,
      className: "primary",
      icon: "lnr-apartment",
    },
    {
      title: "Active customers",
      count: dashboardCounts.activecustomercount,
      className: "info",
      icon: "lnr-user",
    },
    {
      title: "Active candidates",
      count: dashboardCounts.activecandidatecount,
      className: "danger",
      icon: "lnr-users",
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
      color:
        analyiticalCounts?.TodaysInterviewScheduled ===
        analyiticalCounts?.LastDayInterviewScheduled
          ? "border-warning"
          : analyiticalCounts?.TodaysInterviewScheduled >
            analyiticalCounts?.LastDayInterviewScheduled
          ? "border-success"
          : "border-danger",
      count: analyiticalCounts?.TodaysInterviewScheduled,
      arrowDirection:
        analyiticalCounts?.TodaysInterviewScheduled ===
        analyiticalCounts?.LastDayInterviewScheduled
          ? ""
          : analyiticalCounts?.TodaysInterviewScheduled >
            analyiticalCounts?.LastDayInterviewScheduled
          ? "faAngleUp"
          : "faAngleDown",
      arrowColor:
        analyiticalCounts?.TodaysInterviewScheduled ===
        analyiticalCounts?.LastDayInterviewScheduled
          ? ""
          : analyiticalCounts?.TodaysInterviewScheduled >
            analyiticalCounts?.LastDayInterviewScheduled
          ? "text-success"
          : "text-danger",
      title: "Today's interviews",
      apiVariable:
        analyiticalCounts?.TodaysInterviewScheduled +
        ", " +
        analyiticalCounts?.LastDayInterviewScheduled,
    },
    {
      id: 1,
      subTitle: "Next 7 days",
      color:
        analyiticalCounts?.Upcoming7DaysInterview ===
        analyiticalCounts?.Past7DaysInterview
          ? "border-warning"
          : analyiticalCounts?.Upcoming7DaysInterview >
            analyiticalCounts?.Past7DaysInterview
          ? "border-success"
          : "border-danger",
      count: analyiticalCounts?.Upcoming7DaysInterview,
      arrowDirection:
        analyiticalCounts?.Upcoming7DaysInterview ===
        analyiticalCounts?.Past7DaysInterview
          ? ""
          : analyiticalCounts?.Upcoming7DaysInterview >
            analyiticalCounts?.Past7DaysInterview
          ? "faAngleUp"
          : "faAngleDown",
      arrowColor:
        analyiticalCounts?.Upcoming7DaysInterview ===
        analyiticalCounts?.Past7DaysInterview
          ? ""
          : analyiticalCounts?.Upcoming7DaysInterview >
            analyiticalCounts?.Past7DaysInterview
          ? "text-success"
          : "text-danger",
      title: "Upcoming interviews",
      apiVariable:
        analyiticalCounts?.Upcoming7DaysInterview +
        ", " +
        analyiticalCounts?.Past7DaysInterview,
    },
    {
      id: 2,
      subTitle: "Last 30 days",
      color:
        analyiticalCounts?.Upcoming30DaysInterview ===
        analyiticalCounts?.Past30DaysInterview
          ? "border-warning"
          : analyiticalCounts?.Upcoming30DaysInterview >
            analyiticalCounts?.Past30DaysInterview
          ? "border-success"
          : "border-danger",
      count: analyiticalCounts?.Past30DaysInterview,
      arrowDirection:
        analyiticalCounts?.Upcoming30DaysInterview ===
        analyiticalCounts?.Past30DaysInterview
          ? ""
          : analyiticalCounts?.Upcoming30DaysInterview >
            analyiticalCounts?.Past30DaysInterview
          ? "faAngleUp"
          : "faAngleDown",
      arrowColor:
        analyiticalCounts?.Upcoming30DaysInterview ===
        analyiticalCounts?.Past30DaysInterview
          ? ""
          : analyiticalCounts?.Upcoming30DaysInterview >
            analyiticalCounts?.Past30DaysInterview
          ? "text-success"
          : "text-danger",
      title: "Interviews history",
      apiVariable:
        analyiticalCounts?.Upcoming30DaysInterview +
        ", " +
        analyiticalCounts?.Past30DaysInterview,
    },
    {
      id: 3,
      subTitle: "Last 30 days",
      color:
        analyiticalCounts?.Past30DaysCandidateRegistration ===
        analyiticalCounts?.Past30to60DaysCandidateRegistration
          ? "border-warning"
          : analyiticalCounts?.Past30DaysCandidateRegistration >
            analyiticalCounts?.Past30to60DaysCandidateRegistration
          ? "border-success"
          : "border-danger",
      count: analyiticalCounts?.Past30to60DaysCandidateRegistration,
      arrowDirection:
        analyiticalCounts?.Past30DaysCandidateRegistration ===
        analyiticalCounts?.Past30to60DaysCandidateRegistration
          ? ""
          : analyiticalCounts?.Past30DaysCandidateRegistration >
            analyiticalCounts?.Past30to60DaysCandidateRegistration
          ? "faAngleUp"
          : "faAngleDown",
      arrowColor:
        analyiticalCounts?.Past30DaysCandidateRegistration ===
        analyiticalCounts?.Past30to60DaysCandidateRegistration
          ? ""
          : analyiticalCounts?.Past30DaysCandidateRegistration >
            analyiticalCounts?.Past30to60DaysCandidateRegistration
          ? "text-success"
          : "text-danger",
      title: "New candidates registrations",
      apiVariable:
        analyiticalCounts?.Past30DaysCandidateRegistration +
        ", " +
        analyiticalCounts?.Past30to60DaysCandidateRegistration,
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
          <Col sm="12" md="12" lg="6">
            <AdminSlider data={upcomingInterview} />
          </Col>
          <Col sm="6" md="6" lg="3">
            <MissingInterview cardOptions={missedInterviewList} />
          </Col>
          <Col sm="6" md="6" lg="3">
            <OpenJobsGraph
              openJobsCount={dashboardCounts.openjobcount}
              graphData={analyiticalCounts}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
