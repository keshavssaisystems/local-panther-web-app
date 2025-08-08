import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import { PrivateRoute } from "_components";
// import { AdminDashboard } from "_containers/admin/dashboard/adminDashboard";
import { UploadData } from "_containers/admin/uploadData";
import { ScheduleInterview } from "_containers/customer/scheduleInterview/scheduleInterview";
import { CreateJobWizard } from "_containers/customer/createJob/createJobWizard";
import { Login } from "_containers/login/Login";
import { Registration } from "_containers/registration/Registration";
// import { CustomerRegistration } from "_containers/registration/customerRegistration";
import { RegistrationSuccess } from "_containers/registration/RegistrationSuccess";
import { RecommendedJobList } from "_containers/candidate/RecommendedJobList";
import { AppHeader } from "_components/_layout/AppHeader";
import { AppSidebar } from "_components/_layout/AppSidebar";
import { AppFooter } from "_components/_layout/AppFooter";

import "./app.scss";
// import { ForgotPassword } from "_containers/forgotpassword/forgotPassword";
import { ForgotPasswordSuccess } from "_containers/forgotpassword/forgotPasswordSuccess";
// import { CustomerCandidateLists } from "_containers/customer/candidatelists/customercandidatelists";
// import { CandidateList } from "_containers/candidate/list/candidatelist";
import { CandidateProfile } from "_containers/candidate/candidateProfile";
// import { CandidateDashboard } from "_containers/candidate/dashboard/dashboard";
// import { CustJobList } from "_containers/customer/newjobs/custjobs";
import { CandidateUnderConstruction } from "_containers/candidate/common/candidateUnderConstruction";
import { CandidateInterviewFeedback } from "_containers/customer/reports/candidateinterviewfeedback";
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
// import { Calendar } from "_containers/customer/common/calendar";
// import { CustomerReportJobList } from "_containers/customer/reports/customerjobs";
import { CustomerReportScheduledInterviews } from "_containers/customer/reports/customerscheduleinterviews";
import { CustomerReportInterviewedCandidates } from "_containers/customer/reports/customerinterviewdcandidates";
import { CustomerReportJobAging } from "_containers/customer/reports/customerjobaging";
import { CustomerReportMatchedCandidate } from "_containers/customer/reports/customermatchedjoblist";
import { CustomerReportCandidateStatus } from "_containers/customer/reports/customercandidatestatuslist";
// import { CustomerVideoScreen } from "../../firebase/customerVideo";
// import { CandVideoScreen } from "../../firebase/candvideo";
// import { AdminListing } from "_containers/admin/common/adminListing";
// import { RoleMenuListing } from "_containers/admin/acl/roleMenuListing";

import { messaging, analytics } from "../../firebase/index";
// import CustomerDashboard from "_containers/customer/dashboard/customerDashboard";
import { ChatInterface } from "_containers/common/chats/chatInterface";
import { CustomerList } from "_containers/admin/customer/customerList";
import { Skills } from "_containers/admin/masters/skills";
import { FlaggedWord } from "_containers/admin/masters/flaggedWords";

import { CompanyList } from "_containers/admin/company/companyList";
// import { ZoomVideoScreen } from "zoom/zoom-video";
import { ToastContainer, toast } from "react-toastify";
import { Row, Button } from "reactstrap";
import { candidateDashboardActions, getProfileActions } from "_store";
import { useDispatch } from "react-redux";
import { Notifications } from "_containers/notifications/notifications";
import { ShareJobDetails } from "_containers/sharejob/sharejob";
import { SubsidaryList } from "_containers/admin/masters/subsidary";
import { BullhornCandidate } from "_containers/admin/reports/bullhornCandidate";
import { ATSCandidate } from "_containers/admin/reports/ATSCandidateReport";
import { Payment } from "_containers/payment/payment";
// import { AdmCandidateList } from "_containers/admin/candidates/candidatesList";
import { getPublicIP } from "_helpers/helper";
// import { TermsAndConditions } from "_containers/static/terms";
// import { PrivacyPolicy } from "_containers/static/privacy";
// import { Support } from "_containers/static/support";
// import { Contact } from "_containers/static/contact";
import { UnsubscribeEmail } from "_containers/common/UnsubscribeEmail/UnsubscribeEmail";
import { EnhancedSnackbar } from "_components/common/EnhancedSnackbar";
import { EnhancedSnackbarExamples } from "_components/common/EnhancedSnackbarExamples";
// import AIJobOffCanvas from "_components/createJobComponents/AIJobOffCanvas";
const ZoomVideoScreen = React.lazy(() => import("zoom/zoom-video"));
const AIJobOffCanvas = React.lazy(() =>
  import("_components/createJobComponents/AIJobOffCanvas")
);

const Support = React.lazy(() => import("_containers/static/support"));
const PrivacyPolicy = React.lazy(() => import("_containers/static/privacy"));
const TermsAndConditions = React.lazy(() => import("_containers/static/terms"));
const AdmCandidateList = React.lazy(() =>
  import("_containers/admin/candidates/candidatesList")
);
const ForgotPassword = React.lazy(() =>
  import("_containers/forgotpassword/forgotPassword")
);
const CustomerDashboard = React.lazy(() =>
  import("_containers/customer/dashboard/customerDashboard")
);
const CustomerReportJobList = React.lazy(() =>
  import("_containers/customer/reports/customerjobs")
);
const CustomerCandidateLists = React.lazy(() =>
  import("_containers/customer/candidatelists/customercandidatelists")
);
const CandidateList = React.lazy(() =>
  import("_containers/candidate/list/candidatelist")
);
const CustJobList = React.lazy(() =>
  import("_containers/customer/newjobs/custjobs")
);
const Contact = React.lazy(() => import("_containers/static/contact"));
const AdminListing = React.lazy(() =>
  import("_containers/admin/common/adminListing")
);
const RoleMenuListing = React.lazy(() =>
  import("_containers/admin/acl/roleMenuListing")
);
const AdminDashboard = React.lazy(() =>
  import("_containers/admin/dashboard/adminDashboard")
);
const CustomerRegistration = React.lazy(() =>
  import("_containers/registration/customerRegistration")
);
const Calendar = React.lazy(() =>
  import("_containers/customer/common/calendar")
);
const CandidateDashboard = React.lazy(() =>
  import("_containers/candidate/dashboard/dashboard")
);

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
        let isProfilePage = window.location.pathname.indexOf("/profile") !== -1;
        toast(
          <Row>
            <p>
              <b>{payload.notification.title}</b>
            </p>
            <p>{payload.notification.body}</p>
            {payload?.data?.type === "Resume_Notification" && isProfilePage ? (
              <p>
                Updated resume data available
                <Button
                  color="link"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  REFRESH
                </Button>
              </p>
            ) : (
              <></>
            )}
          </Row>,
          {
            position: "bottom-right",
            autoClose: 10000,
          }
        );
        if (isProfilePage) {
          dispatch(
            getProfileActions.getCandidate(
              JSON.parse(localStorage.getItem("userDetails")).InternalUserId
            )
          );
        }
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
  const excludedPaths = ["/terms", "/privacy", "/contact", "/support"];
  const isExcludedPath = excludedPaths.includes(location.pathname);
  console.log(isExcludedPath);
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

  useEffect(() => {
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "home page",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
    getPublicIpAdd();
    return () => {
      localStorage.removeItem("publicip");
    };
  }, []);

  const getPublicIpAdd = async () => {
    let data = await getPublicIP();
    if (data?.ip) {
      localStorage.setItem("publicip", data.ip);
    }
  };
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
            path="/employers"
            element={
              <PrivateRoute>
                <CustomerList isCompanyAdmin={false} />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidate-list"
            element={
              <PrivateRoute>
                <AdmCandidateList />
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
            path="masters/flagged-words"
            element={
              <PrivateRoute>
                <FlaggedWord />
              </PrivateRoute>
            }
          />

          <Route
            path="masters/subsidiary"
            element={
              <PrivateRoute>
                <SubsidaryList />
              </PrivateRoute>
            }
          />
          <Route
            path="masters/subsidiary/:id"
            element={
              <PrivateRoute>
                <SubsidaryList />
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
          <Route
            path="/upload-data"
            element={
              <PrivateRoute>
                <UploadData />
              </PrivateRoute>
            }
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
          <Route
            path="/report/bullhorn-candidate-report/16"
            element={<BullhornCandidate title={"Bullhorn Candidate Report"} />}
          />

          <Route
            path="/report/ats-candidates/:id"
            element={<ATSCandidate title={"ATS Candidate Report"} />}
          />
          <Route
            path="/candidate-interview-feedback"
            element={
              <PrivateRoute>
                <CandidateInterviewFeedback />
              </PrivateRoute>
            }
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
                <ScheduleInterview fromDashboard="calendar" />
              </PrivateRoute>
            }
          />
          <Route
            path="/scheduled-interview#upcoming"
            element={
              <PrivateRoute>
                <ScheduleInterview fromDashboard="upcoming" />
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
            path="/candidate-interview-feedback"
            element={
              <PrivateRoute>
                <CandidateInterviewFeedback />
              </PrivateRoute>
            }
            key={6}
          />
          <Route
            path="/customer-edit-job/:id"
            element={<CreateJobWizard type={"edit"} />}
          />
          {/* <Route
            path="/cust-video"
            element={
              <PrivateRoute>
                <CustomerVideoScreen />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatInterface />
              </PrivateRoute>
            }
          />

          <Route
            path="/employers"
            element={
              <PrivateRoute>
                <CustomerList isCompanyAdmin={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/masters"
            element={
              <PrivateRoute>
                <CompanyList isCompanyAdmin={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/masters/company"
            element={
              <PrivateRoute>
                <CompanyList isCompanyAdmin={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/acl"
            element={
              <PrivateRoute>
                <AdminListing isCompanyAdmin={true} entity="users" />
              </PrivateRoute>
            }
          />
          <Route
            path="/acl/users"
            element={
              <PrivateRoute>
                <AdminListing isCompanyAdmin={true} entity="users" />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={<OpenJobs title={"Open Jobs"} isCompanyAdmin={true} />}
          />
          <Route
            path="/report/open-jobs"
            element={<OpenJobs title={"Open Jobs"} isCompanyAdmin={true} />}
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
            path="/job-list-applied"
            element={
              <PrivateRoute>
                <CandidateList type={"applied"} />
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
          {/* <Route
            path="/cand-video"
            element={
              <PrivateRoute>
                <CandVideoScreen />
              </PrivateRoute>
            }
          /> */}
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
      <Suspense
        fallback={
          <div
            style={{
              height: "calc(100vh - 160px)",
              width: "100vw",
              top: "50%",
              left: "50%",
              transform: "translate(50%, 50%)",
            }}
          >
            {" "}
            <div className="loader-cust"></div>
          </div>
        }
      >
        {isExcludedPath ? (
          <>
            <Routes forceRefresh={true}>
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </>
        ) : (
          <>
            {authUser && (
              <AppHeader
                isSidebarOpen={isSidebarOpen}
                onOpenSidebar={() => onOpenSidebar()}
                onCloseSidebar={() => onCloseSidebar()}
              />
            )}
            {!authUser && hideSidebar && !isExcludedPath && (
              <AppHeader
                unAuth={true}
                isSidebarOpen={isSidebarOpen}
                onOpenSidebar={() => onOpenSidebar()}
                onCloseSidebar={() => onCloseSidebar()}
              />
            )}
            <div className={authUser ? `app-main` : ""}>
              <AIJobOffCanvas></AIJobOffCanvas>
              {authUser && !hideSidebar && (
                <AppSidebar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              )}
              <div className={authUser ? `app-main__outer` : ""}>
                <div className={"app-main__inner "}>
                  <ToastContainer />
                  <EnhancedSnackbar />
                  <Routes forceRefresh={true}>
                    {renderRoutes(userroleid)}
                    <Route
                      path="/security"
                      element={
                        <PrivateRoute>
                          <CandidateUnderConstruction title={"Security"} />
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
                    {/* <Route path="/login/:id" element={<Login />} /> */}
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
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
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
                    <Route
                      path="/payment/:id"
                      element={<Payment authUser={authUser} />}
                    />
                    <Route
                      path="/Unsubscribe/:token"
                      element={<UnsubscribeEmail />}
                    />
                    {/* <Route path="/snackbar-demo" element={<SnackbarDemo />} /> */}
                    <Route path="/enhanced-snackbar-examples" element={<EnhancedSnackbarExamples />} />
                  </Routes>
                </div>
                {authUser && <AppFooter />}
                {!authUser && hideSidebar && !isExcludedPath && <AppFooter />}
              </div>
            </div>
          </>
        )}
      </Suspense>
    </>
  );
}
