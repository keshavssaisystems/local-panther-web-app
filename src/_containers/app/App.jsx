import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import { PrivateRoute } from "_components";
import {
  AdminDashboard,
  CustomerDashboard,
  CandidateDashboard,
} from "_containers/dashboard/Dashboard";

import { ScheduleInterview } from "_containers/customer/scheduleInterview/scheduleInterview";
import { CreateJobWizard } from "_containers/customer/createJob/createJobWizard";
import { Login } from "_containers/login/Login";
import { Registration } from "_containers/registration/Registration";
import { RegistrationSuccess } from "_containers/registration/RegistrationSuccess";
import { RecommendedJobList } from "_containers/candidate/RecommendedJobList";
import { AppHeader } from "_components/_layout/AppHeader";
import { AppSidebar } from "_components/_layout/AppSidebar";
import { AppFooter } from "_components/_layout/AppFooter";
import "./app.scss";
import { ForgotPassword } from "_containers/forgotpassword/forgotPassword";
import { ForgotPasswordSuccess } from "_containers/forgotpassword/forgotPasswordSuccess";
import { CustomerCandidateLists } from "_containers/customer/candidatelists/customercandidatelists";
// import { CandidateTablist } from "_containers/candidate/candidateTablist";
import { CandidateList } from "_containers/candidate/list/candidatelist";
import { CandidateProfile } from "_containers/candidate/candidateProfile";
import { Policy } from "_containers/policy";
import { Terms } from "_containers/terms";
import { Security } from "_containers/security";
import { Contact } from "_containers/contact";
import { CustJobList } from "_containers/customer/newjobs/custjobs";
import { CustomerUnderConstruction } from "_containers/customer/common/customerUnderConstruction";
import { CandidateUnderConstruction } from "_containers/candidate/common/candidateUnderConstruction";

// Admin
import { OnboardCustomer } from "_containers/admin/customer";
import { AdminUnderConstruction } from "_containers/admin/common/adminUnderConstruction";
import {
  OpenJobs,
  NewCandidate,
  HiringManager,
  CandidateReport,
  IncompleteCandidateProfile,
  PartiallyFilledJobs,
} from "_containers/admin";
import { CandidateSchedules } from "_containers/candidate/calendar/candidateSchedules";
import { Calendar } from "_containers/customer/common/calendar";
import { CustomerReportJobList } from "_containers/customer/reports/customerjobs";
import { CustomerReportScheduledInterviews } from "_containers/customer/reports/customerscheduleinterviews";
import { CustomerReportInterviewedCandidates } from "_containers/customer/reports/customerinterviewdcandidates";
import { CustomerReportJobAging } from "_containers/customer/reports/customerjobaging";
import { CustomerReportMatchedCandidate } from "_containers/customer/reports/customermatchedjoblist";
import { CustomerReportCandidateStatus } from "_containers/customer/reports/customercandidatestatuslist";
import AdminCompanyList from "_containers/admin/AdminCompanyList";
import AdminCustomersList from "_containers/admin/AdminCustomersList";

export function App() {
  const authUser = useSelector((state) => state.auth.token);
  const userroleid = useSelector((state) => state.auth.userroleid);

  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

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
                <AdminCustomersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/company"
            element={
              <PrivateRoute>
                <AdminCompanyList />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <AdminUnderConstruction title={"Calendar"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <AdminUnderConstruction title={"Users"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PrivateRoute>
                <AdminUnderConstruction title={"Roles"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu-mapping"
            element={
              <PrivateRoute>
                <AdminUnderConstruction title={"Menu mapping"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-customer"
            element={<OnboardCustomer></OnboardCustomer>}
          />
          <Route
            path="/report"
            element={<HiringManager title={"Hiring Manager Report"} />}
          />
          <Route
            path="/report/hiring-manager-report"
            element={<HiringManager title={"Hiring Manager Report"} />}
          />
          <Route
            path="/report/open-jobs"
            element={<OpenJobs title={"Open Jobs"} />}
          />
          <Route
            path="/report/new-candidates"
            element={<NewCandidate title={"New Candidate"} />}
          />
          <Route
            path="/report/partially-filled-job"
            element={<OpenJobs title={"Partially Filled Jobs"} />}
          />
          <Route
            path="/report/incomplete-candidate-profile"
            element={<OpenJobs title={"Incomplete Candidate Profile"} />}
          />
          <Route
            path="/report/candidate-report"
            element={<OpenJobs title={"Candidate Report"} />}
          />
          <Route
            path="/report/jobs-without-matched-candidates"
            element={<OpenJobs title={"Jobs Without Matched Candidate"} />}
          />
          <Route
            path="/report/canddates-without-matched-jobs"
            element={<OpenJobs title={"Candidate Without Matched Jobs"} />}
          />
          <Route
            path="/report/non-published-jobs"
            element={<OpenJobs title={"Non Published Jobs"} />}
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
                <CreateJobWizard />
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
          />
          <Route
            path="/report/customer-jobs/:id"
            element={
              <PrivateRoute>
                <CustomerReportJobList />
              </PrivateRoute>
            }
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
            path="/report/customer-interviewed-candidates"
            element={
              <PrivateRoute>
                <CustomerReportInterviewedCandidates />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-job-aging"
            element={
              <PrivateRoute>
                <CustomerReportJobAging />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-matched-candidate-list-by-job"
            element={
              <PrivateRoute>
                <CustomerReportMatchedCandidate />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/customer-candidate-list-by-status"
            element={
              <PrivateRoute>
                <CustomerReportCandidateStatus />
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
          <Route
            path="/candidate-profile/:id"
            element={<CandidateProfile></CandidateProfile>}
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CandidateSchedules title={"Calendar"} />
              </PrivateRoute>
            }
          />
        </>
      );
    }
  };

  return (
    <>
      {authUser && <AppHeader />}
      <div className={authUser ? `app-main` : ""}>
        {authUser && <AppSidebar />}
        <div className={authUser ? `app-main__outer` : ""}>
          <div className="app-main__inner">
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
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route
                path="/registration-success"
                element={<RegistrationSuccess />}
              />
              <Route
                path="/forgot-password-success"
                element={<ForgotPasswordSuccess />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </div>
          {authUser && <AppFooter />}
        </div>
      </div>
    </>
  );
}
