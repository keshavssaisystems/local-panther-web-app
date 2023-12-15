import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { DashboardCounts } from "./dashboardCounts";
import { TodoList } from "./todoList";
import { UpcomingInterviews } from "./upcomingInterviews";
import { Alerts } from "./alerts";
import { JobsList } from "./jobsList";
import { useDispatch } from "react-redux";
import {
  candidateDashboardActions,
  candidateListActions,
  dropdownActions,
  scheduleInterviewActions,
  customerDashboardActions,
} from "_store";
import SweetAlert from "react-bootstrap-sweetalert";

export function CandidateDashboard() {
  const dispatch = useDispatch();
  let candidateId = JSON.parse(
    localStorage.getItem("userDetails")
  ).InternalUserId;
  let userId = JSON.parse(localStorage.getItem("userDetails")).UserId;

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const [confAlert, SetConfAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
    id: "",
  });

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async function () {
    let candObj = {
      isCandidate: true,
      candidateId,
      pageNumber: 1,
      pageSize: 5,
    };
    dispatch(candidateDashboardActions.getDashboardCount({ candidateId }));
    dispatch(candidateDashboardActions.getSchedules({ candidateId }));
    dispatch(candidateDashboardActions.getToDo({ userId }));
    dispatch(candidateDashboardActions.getLatestJobs({ candidateId }));
    dispatch(candidateListActions.getRecommendedJobList(candObj));
    dispatch(dropdownActions.getJobTypeThunk2());
    dispatch(dropdownActions.getWorkScheduleThunk2());
    dispatch(dropdownActions.getShiftThunk2());
    dispatch(scheduleInterviewActions.getInterviewGuideListThunk());
    dispatch(customerDashboardActions.getSendTimezoneBeckendThunk());
  };

  const onDeleteNotification = async (id) => {
    let res = await dispatch(
      candidateDashboardActions.deleteNotifications({ id })
    );
    if (res?.payload?.statusCode === 200) {
      showSweetAlert({
        title: "Deleted notification successfully.",
        type: "success",
      });
    } else {
      showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };
  const onReadNotification = (id, status) => {
    if (status !== 3) {
      dispatch(candidateDashboardActions.readNotification({ id }));
    }
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const onConfAlert = (id) => {
    let data = { ...confAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    data.id = "";
    data.description = "";
    SetConfAlert(data);
    onDeleteNotification(id);
  };

  const onCloseConfAlert = () => {
    let data = { ...confAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    data.id = "";
    data.description = "";
    SetConfAlert(data);
  };

  const showConfAlert = (id) => {
    let data = { ...confAlert };
    data.title = "Delete Notification";
    data.type = "warning";
    data.show = true;
    data.id = id;
    data.description = "Are you sure want to delete this notification?";
    SetConfAlert(data);
  };

  return (
    <>
      <Row>
        <Col>
          <DashboardCounts />
        </Col>
      </Row>
      <Row>
        <Col>
          <TodoList onCallBack={() => loadPage()} />
        </Col>
        <Col>
          <Alerts
            onDeleteNotification={(id) => showConfAlert(id)}
            onReadNotification={(id, status) => onReadNotification(id, status)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <UpcomingInterviews />
        </Col>
      </Row>

      <Row>
        <Col>
          <JobsList onCallBack={() => loadPage()} />
        </Col>
      </Row>
      <>
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        >
          {showAlert.description}
        </SweetAlert>
      </>

      <>
        <SweetAlert
          title={confAlert.title}
          show={confAlert.show}
          type={confAlert.type}
          onConfirm={() => onConfAlert(confAlert.id)}
          onCancel={() => onCloseConfAlert()}
          showCancel
        >
          {confAlert.description}
        </SweetAlert>
      </>
    </>
  );
}
