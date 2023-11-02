import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { DashboardCounts } from "./dashboardCounts";
import { TodoList } from "./todoList";
import { UpcomingInterviews } from "./upcomingInterviews";
import { Alerts } from "./alerts";
import { JobsList } from "./jobsList";
import { useDispatch } from "react-redux";
import { candidateDashboardActions, candidateListActions } from "_store";

export function CandidateDashboard() {
  const dispatch = useDispatch();
  let candidateId = JSON.parse(
    localStorage.getItem("userDetails")
  ).InternalUserId;
  let userId = JSON.parse(localStorage.getItem("userDetails")).UserId;

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async function () {
    let candObj = {
      candidateId,
      pageNumber: 1,
      pageSize: 5,
    };
    dispatch(candidateDashboardActions.getDashboardCount({ candidateId }));
    dispatch(candidateDashboardActions.getAlerts({ candidateId }));
    dispatch(candidateDashboardActions.getSchedules({ candidateId }));
    dispatch(candidateDashboardActions.getToDo({ userId }));
    dispatch(candidateListActions.getRecommendedJobList(candObj));
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
          <Alerts />
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
    </>
  );
}
