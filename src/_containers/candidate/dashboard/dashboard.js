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
        <Col sm={12} md={12} lg={5}>
          <TodoList onCallBack={() => loadPage()} />
        </Col>
        <Col sm={12} md={12} lg={7}>
          <UpcomingInterviews />
        </Col>
      </Row>

      <Row>
        <Col sm={12} md={12} lg={5}>
          <Alerts />
        </Col>
        <Col sm={12} md={12} lg={7}>
          <JobsList />
        </Col>
      </Row>

      {/* <div class="card-container">
        <div class="card">
          
        </div>

        <Row>
          <Col sm={12} md={12} lg={5}>
            <div class="card">
              <div class="card-body">
                <TodoList onCallBack={() => loadPage()} />
              </div>
            </div>
          </Col>
          <Col>
            <div class="card">
              <div class="card-body">
                <UpcomingInterviews />
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={12} lg={5}>
            <div class="card">
              <div class="card-body">
                <Alerts />
              </div>
            </div>
          </Col>
          <Col>
            <div class="card">
              <div class="card-body">
                <JobsList />
              </div>
            </div>
          </Col>
        </Row>
      </div> */}
    </>
  );
}
