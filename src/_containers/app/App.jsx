import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import { PrivateRoute } from "_components";
import { AdminDashboard } from "_containers/admin/dashboard/adminDashboard";

import { ScheduleInterview } from "_containers/customer/scheduleInterview/scheduleInterview";
import { CreateJobWizard } from "_containers/customer/createJob/createJobWizard";
import { Login } from "_containers/login/Login";
import { Registration } from "_containers/registration/Registration";
import { CustomerRegistration } from "_containers/registration/customerRegistration";
import { RegistrationSuccess } from "_containers/registration/RegistrationSuccess";
import { RecommendedJobList } from "_containers/candidate/RecommendedJobList";
import { AppHeader } from "_components/_layout/AppHeader";
import { AppSidebar } from "_components/_layout/AppSidebar";
import { AppFooter } from "_components/_layout/AppFooter";
import "./app.scss";
import { ForgotPassword } from "_containers/forgotpassword/forgotPassword";
import { ForgotPasswordSuccess } from "_containers/forgotpassword/forgotPasswordSuccess";
import { CustomerCandidateLists } from "_containers/customer/candidatelists/customercandidatelists";
import { CandidateList } from "_containers/candidate/list/candidatelist";
import { CandidateProfile } from "_containers/candidate/candidateProfile";
import { CandidateDashboard } from "_containers/candidate/dashboard/dashboard";
import { CustJobList } from "_containers/customer/newjobs/custjobs";
import { CandidateUnderConstruction } from "_containers/candidate/common/candidateUnderConstruction";
// Admin
import { OnboardCustomer } from "_containers/admin/customer";
import {
  OpenJobs,
  NewCandidate,
  HiringManager,
  CandidateReport,
  IncompleteCandidateProfile,
  AdminCalendar,
  JobsWithoutMatchedCandidates,
  CandidateWithoutMatchedJobs,
  NonPublishedJobs,
} from "_containers/admin";
import { CandidateSchedules } from "_containers/candidate/calendar/candidateSchedules";
import { Calendar } from "_containers/customer/common/calendar";
import { CustomerReportJobList } from "_containers/customer/reports/customerjobs";
import { CustomerReportScheduledInterviews } from "_containers/customer/reports/customerscheduleinterviews";
import { CustomerReportInterviewedCandidates } from "_containers/customer/reports/customerinterviewdcandidates";
import { CustomerReportJobAging } from "_containers/customer/reports/customerjobaging";
import { CustomerReportMatchedCandidate } from "_containers/customer/reports/customermatchedjoblist";
import { CustomerReportCandidateStatus } from "_containers/customer/reports/customercandidatestatuslist";
import { CustomerVideoScreen } from "../../firebase/customerVideo";
import { CandVideoScreen } from "../../firebase/candvideo";
import { AdminListing } from "_containers/admin/common/adminListing";
import { RoleMenuListing } from "_containers/admin/acl/roleMenuListing";

import { messaging } from "../../firebase/index";
import CustomerDashboard from "_containers/customer/dashboard/customerDashboard";
import { ChatInterface } from "_containers/common/chats/chatInterface";
import { CustomerList } from "_containers/admin/customer/customerList";
import { Skills } from "_containers/admin/masters/skills";

import { CompanyList } from "_containers/admin/company/companyList";
import { ZoomVideoScreen } from "zoom/zoom-video";
import { ToastContainer, toast } from "react-toastify";
import { Row } from "reactstrap";
import { candidateDashboardActions } from "_store";
import { useDispatch } from "react-redux";
import { Notifications } from "_containers/notifications/notifications";
import { ShareJobDetails } from "_containers/sharejob/sharejob";

export function App() {
  const authUser = useSelector((state) => state.auth.token);
  const userroleid = useSelector((state) => state.auth.userroleid);
  const [hideSidebar, setHideSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (authUser) {
      updatePushNotifications();
      messaging.onMessage((payload) => {
        toast(
          <Row>
            <p>
              <b>{payload.notification.title}</b>
            </p>
            <p>{payload.notification.body}</p>
          </Row>,
          {
            position: "bottom-right",
            autoClose: 10000,
          }
        );
        updatePushNotifications();
      });
    }
  }, [authUser]);

  const updatePushNotifications = () => {
    dispatch(candidateDashboardActions.getAlerts());
  };
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  const location = useLocation();
  history.location = useLocation();
  useEffect(() => {
    if (
      location.pathname !== "" &&
      (location.pathname.indexOf("job-detail") !== -1 ||
        location.pathname.indexOf("video-screen") !== -1)
    ) {
      setHideSidebar(true);
    } else {
      setHideSidebar(false);
    }
  }, [location]);
  const renderRoutes = (userroleid) => {
    if (userroleid === 1) {
      return (
        <>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            }
          />
          <Route
            path="masters/skills"
            element={
              <PrivateRoute>
                <Skills />
              </PrivateRoute>
            }
          />
          <Route
            path="masters/company"
            element={
              <PrivateRoute>
                <CompanyList />
              </PrivateRoute>
            }
          />

          <Route
            path="masters"
            element={
              <PrivateRoute>
                <CompanyList />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <AdminCalendar title={"Calendar"} />
              </PrivateRoute>
            }
          />
          <Route
            path="acl/users"
            element={
              <PrivateRoute>
                <AdminListing entity="users" />
              </PrivateRoute>
            }
          />

          <Route
            path="acl"
            element={
              <PrivateRoute>
                <AdminListing entity="users" />
              </PrivateRoute>
            }
          />
          <Route
            path="acl/roles-function/3"
            element={
              <PrivateRoute>
                <RoleMenuListing entity="menuMapping" key={1} />
              </PrivateRoute>
            }
          />
          <Route
            path="acl/roles/2"
            element={
              <PrivateRoute>
                <RoleMenuListing entity="roles" key={2} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-customer"
            element={<OnboardCustomer></OnboardCustomer>}
          />
          <Route path="/report" element={<OpenJobs title={"Open Jobs"} />} />
          <Route
            path="/report/open-jobs"
            element={<OpenJobs title={"Open Jobs"} />}
          />
          <Route
            path="/report/new-candidates"
            element={<NewCandidate title={"New Candidate"} />}
          />
          <Route
            path="/report/hiring-manager-report/:id"
            element={<HiringManager title={"Hiring Manager Report"} />}
          />
          <Route
            path="/report/incomplete-candidate-profile/:id"
            element={
              <IncompleteCandidateProfile
                title={"Incomplete Candidate Profile"}
              />
            }
          />
          <Route
            path="/report/candidate-report/:id"
            element={<CandidateReport title={"Candidate Report"} />}
          />
          <Route
            path="/report/jobs-without-matched-candidates/:id"
            element={
              <JobsWithoutMatchedCandidates
                title={"Jobs Without Matched Candidate"}
              />
            }
          />
          <Route
            path="/report/canddates-without-matched-jobs/:id"
            element={
              <CandidateWithoutMatchedJobs
                title={"Candidate Without Matched Jobs"}
              />
            }
          />
          <Route
            path="/report/non-published-jobs/:id"
            element={<NonPublishedJobs title={"Non Published Jobs"} />}
          />
        </>
      );
    } else if (userroleid === 2) {
      return (
        <>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-list"
            element={
              <PrivateRoute>
                <CustJobList />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-job"
            element={
              <PrivateRoute>
                <CreateJobWizard type={"add"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/scheduled-interview"
            element={
              <PrivateRoute>
                <ScheduleInterview />
              </PrivateRoute>
            }
          />

          <Route
            path="/customer-candidate-matched/:id"
            element={<CustomerCandidateLists type={"matched"} />}
          />

          <Route
            path="/customer-candidate-liked/:id"
            element={<CustomerCandidateLists type={"liked"} />}
          />
          <Route
            path="/customer-candidate-maybe/:id"
            element={<CustomerCandidateLists type={"maybe"} />}
          />
          <Route
            path="/customer-candidate-applied/:id"
            element={<CustomerCandidateLists type={"applied"} />}
          />
          <Route
            path="/customer-candidate-scheduled/:id"
            element={<CustomerCandidateLists type={"scheduled"} />}
          />
          <Route
            path="/customer-candidate-accepted/:id"
            element={<CustomerCandidateLists type={"accepted"} />}
          />
          <Route
            path="/customer-candidate-rejected/:id"
            element={<CustomerCandidateLists type={"rejected"} />}
          />

          <Route
            path="/customer-candidate-offers/:id"
            element={<CustomerCandidateLists type={"offers"} />}
          />

          <Route path="/candidate-list" element={<CustomerCandidateLists />} />
          <Route
            path="/calendar-poc"
            element={<Calendar title={"Microsoft Calendar"} />}
          />

          <Route
            path="/report"
            element={
              <PrivateRoute>
                <CustomerReportJobList />
              </PrivateRoute>
            }
            key={5}
          />
          <Route
            path="/report/customer-jobs/:id"
            element={
              <PrivateRoute>
                <CustomerReportJobList />
              </PrivateRoute>
            }
            key={6}
          />
          <Route
            path="/report/customer-scheduled-interviews/:id"
            element={
              <PrivateRoute>
                <CustomerReportScheduledInterviews />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-interviewed-candidates/:id"
            element={
              <PrivateRoute>
                <CustomerReportInterviewedCandidates />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-job-aging/:id"
            element={
              <PrivateRoute>
                <CustomerReportJobAging />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-matched-candidate-list-by-job/:id"
            element={
              <PrivateRoute>
                <CustomerReportMatchedCandidate />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-candidate-list-by-status/:id"
            element={
              <PrivateRoute>
                <CustomerReportCandidateStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer-edit-job/:id"
            element={<CreateJobWizard type={"edit"} />}
          />
          <Route
            path="/cust-video"
            element={
              <PrivateRoute>
                <CustomerVideoScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatInterface />
              </PrivateRoute>
            }
          />
        </>
      );
    } else {
      return (
        <>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <CandidateDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-list"
            element={
              <PrivateRoute>
                <CandidateList />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-list-matched"
            element={
              <PrivateRoute>
                <CandidateList type={"matched"} />
              </PrivateRoute>
            }
          />

          <Route
            path="/job-list-interview"
            element={
              <PrivateRoute>
                <CandidateList type={"interview"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-list-accepted"
            element={
              <PrivateRoute>
                <CandidateList type={"accepted"} />
              </PrivateRoute>
            }
          />

          <Route
            path="/job-list-offers"
            element={
              <PrivateRoute>
                <CandidateList type={"offers"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-list-rejected"
            element={
              <PrivateRoute>
                <CandidateList type={"rejected"} />
              </PrivateRoute>
            }
          />

          <Route
            path="/recommended-job"
            element={
              <PrivateRoute>
                <RecommendedJobList />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <CandidateProfile />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/candidate-dashboard"
            element={
              <PrivateRoute>
                <CandidateDashboard />
              </PrivateRoute>
            }
          /> */}

          <Route
            path="/candidate-profile/:id"
            element={
              <PrivateRoute>
                <CandidateProfile></CandidateProfile>
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CandidateSchedules title={"Calendar"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/cand-video"
            element={
              <PrivateRoute>
                <CandVideoScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatInterface />
              </PrivateRoute>
            }
          />
        </>
      );
    }
  };

  const onOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const onCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {authUser && (
        <AppHeader
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => onOpenSidebar()}
          onCloseSidebar={() => onCloseSidebar()}
        />
      )}
      {!authUser && hideSidebar && (
        <AppHeader
          unAuth={true}
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => onOpenSidebar()}
          onCloseSidebar={() => onCloseSidebar()}
        />
      )}
      <div className={authUser ? `app-main` : ""}>
        {authUser && !hideSidebar && (
          <AppSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <div className={authUser ? `app-main__outer` : ""}>
          <div className={"app-main__inner "}>
            <ToastContainer />
            <Routes forceRefresh={true}>
              {renderRoutes(userroleid)}
              <Route
                path="/policy"
                element={
                  <PrivateRoute>
                    <CandidateUnderConstruction title={"Policy"} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/terms"
                element={
                  <PrivateRoute>
                    <CandidateUnderConstruction title={"Terms"} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/security"
                element={
                  <PrivateRoute>
                    <CandidateUnderConstruction title={"Security"} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <PrivateRoute>
                    <CandidateUnderConstruction title={"Contact"} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notification"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route
                path="/customer-registration"
                element={<CustomerRegistration />}
              />
              <Route
                path="/registration-success"
                element={<RegistrationSuccess />}
              />
              <Route
                path="/forgot-password-success"
                element={<ForgotPasswordSuccess />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* for firebase */}
              {/* <Route path="/video-screen/:id" element={<VideoScreen />} /> */}
              {/* for zoom */}
              <Route
                path="/video-screen/*"
                element={<ZoomVideoScreen authUser={authUser} />}
              />
              <Route
                path="/job-detail/:id"
                element={<ShareJobDetails authUser={authUser} />}
              />
            </Routes>
          </div>
          {authUser && <AppFooter />}
          {!authUser && hideSidebar && <AppFooter />}
        </div>
      </div>
    </>
  );
}
