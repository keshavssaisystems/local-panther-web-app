import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { DashboardCounts } from "./dashboardCounts";
import { TodoList } from "./todoList";
import { UpcomingInterviews } from "./upcomingInterviews";
import { Alerts } from "./alerts";
import { JobsList } from "./jobsList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  candidateDashboardActions,
  candidateListActions,
  dropdownActions,
  scheduleInterviewActions,
  customerDashboardActions,
  getProfileActions,
  workScheduleActions,
  jobTypeActions,
  shiftActions,
  getpayPeriodActions,
} from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import infoIcon from "assets/utils/images/yellow-info-big.svg";
import { analytics } from "../../../firebase/index";
import { JobPreferences } from "../jobPreferences";
import { history } from "_helpers";
export function CandidateDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showJobPreferModal, setShowJobPreferModal] = useState(false);
  const [prefUpdated, setPrefUpdated] = useState(false);
  let candidateId = JSON.parse(
    localStorage.getItem("userDetails")
  ).InternalUserId;
  let userId = JSON.parse(localStorage.getItem("userDetails")).UserId;
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
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
    if (
      localStorage.getItem("companyreferrallogid") &&
      localStorage.getItem("companyreferrallogname")
    ) {
      localStorage.removeItem("companyreferrallogname");
      localStorage.removeItem("companyreferrallogid");
      history.navigate("/job-list");
    }
    loadPage();
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "dashboard",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
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

  const loadProfileData = async () => {
    setShowJobPreferModal(true);
    await getPersonalDetails();
    await getDropdownLists();
  };

  const getPersonalDetails = async function () {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    let candidateid = localStorage.getItem("admcandid")
      ? localStorage.getItem("admcandid")
      : userDetails.InternalUserId;
    let response = await dispatch(getProfileActions.getCandidate(candidateid));

    return response;
  };

  const getDropdownLists = async function () {
    await dispatch(workScheduleActions.getWorkScheduleThunk());
    await dispatch(jobTypeActions.getJobTypeThunk());
    await dispatch(shiftActions.getShiftThunk());

    await dispatch(getpayPeriodActions.getpayPeriod());
    await dispatch(dropdownActions.getJobLocationTypeThunk());
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
  const counts = useSelector(
    (state) => state.candidateDashboard.dashboardCounts
  );
  useEffect(() => {
    if (
      counts.skills === false ||
      counts.qualifications === false ||
      counts.education === false ||
      counts.jobPreference === false ||
      // counts.certifications === false ||
      counts.employmentEligiblity === 0
    ) {
      if (
        counts.jobPreference === false &&
        // counts.certifications === false ||
        counts.employmentEligiblity === 0 &&
        !prefUpdated
      ) {
        loadProfileData();
      } else {
        setShowProfilePrompt(true);
      }
    }
  }, [counts]);

  const closeJobPreferModal = function () {
    setShowJobPreferModal(false);
  };

  return (
    <>
      <Row>
        <Col>
          <DashboardCounts />
        </Col>
      </Row>
      <Row>
        {/* <Col>
          <TodoList onCallBack={() => loadPage()} />
        </Col> */}
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
      <>
        {
          // counts.certifications === false ||
          (counts.skills === false ||
            counts.qualifications === false ||
            counts.education === false ||
            counts.employmentEligiblity === 0 ||
            counts.jobPreference === false) && (
            <div className="profile-prompt">
              <SweetAlert
                custom
                show={showProfilePrompt}
                onConfirm={() => {
                  setShowProfilePrompt(false);
                  // loadProfileData();
                  navigate("/profile");
                }}
                onCancel={() => {
                  setShowProfilePrompt(false);
                }}
                cancelBtnText={"Remind me later"}
                confirmBtnText="Update"
                showCancel
                customIcon={infoIcon}
              >
                <p className="candidate-profile-prompt">
                  “Enhance your experience and find the best job matches by
                  updating your{" "}
                  {counts.skills === false && (
                    <span className="candidate-profile-prompt-bold">
                      Skills,
                    </span>
                  )}
                  {counts.qualifications === false && (
                    <span className="candidate-profile-prompt-bold">
                      {" "}
                      Qualification details,
                    </span>
                  )}
                  {counts.education === false && (
                    <span className="candidate-profile-prompt-bold">
                      {" "}
                      Education details,
                    </span>
                  )}
                  {/* {counts.certifications === false && (
                <span className="candidate-profile-prompt-bold">
                  {" "}
                  Certifications,
                </span>
              )} */}
                  {counts.employmentEligiblity === false ||
                    (counts.employmentEligiblity === 0 && (
                      <span className="candidate-profile-prompt-bold">
                        {" "}
                        Employment eligibility,
                      </span>
                    ))}
                  {counts.jobPreference === false && (
                    <span className="candidate-profile-prompt-bold">
                      {" "}
                      Job preferences,
                    </span>
                  )}{" "}
                  to your profile.”
                </p>
              </SweetAlert>
            </div>
          )
        }
      </>
      <>
        {" "}
        {showJobPreferModal && (
          <Row>
            <JobPreferences
              onCallBack={() => closeJobPreferModal()}
              isRequired={true}
              isCompleteProfile={true}
              getPersonalDetails={() => {
                setPrefUpdated(true);
                getPersonalDetails();
              }}
              updateCount={() => {
                dispatch(
                  candidateDashboardActions.getDashboardCount({ candidateId })
                );
              }}
            />
          </Row>
        )}
      </>
    </>
  );
}
