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
import { CandidateTablist } from "_containers/candidate/candidateTablist";
import { CandidateProfile } from "_containers/candidate/candidateProfile";
import { Policy } from "_containers/policy";
import { Terms } from "_containers/terms";
import { Security } from "_containers/security";
import { Contact } from "_containers/Contact";
import { CustJobList } from "_containers/customer/newjobs/custjobs";
import { CustomerUnderConstruction } from "_containers/customer/common/customerUnderConstruction";
import { CandidateUnderConstruction } from "_containers/candidate/common/candidateUnderConstruction";

// Admin
import { OnboardCustomer } from "_containers/admin/customer";
import { AdminUnderConstruction } from "_containers/admin/common/adminUnderConstruction";
import {
  OpenJobs,
  NewCandidate,
  CandidateReport,
  IncompleteCandidateProfile,
  PartiallyFilledJobs,
} from "_containers/admin";

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
                <AdminUnderConstruction title={"Customers"} />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidate-list"
            element={
              <PrivateRoute>
                <AdminUnderConstruction title={"Candidates"} />
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
            element={
              <PrivateRoute>
                <AdminUnderConstruction title={"Reports"} />
              </PrivateRoute>
            }
          />
          <Route path="/report/open-jobs" element={<OpenJobs />} />
          <Route path="/report/new-candidates" element={<NewCandidate />} />
          
          <Route path="/report/partially-filled-job" element={<AdminUnderConstruction title={"Partially filled jobs"} />} />
          <Route
            path="/report/incomplete-candidate-profile"
            element={<AdminUnderConstruction title={"Incomplete candidate profile"}/>}
          />
          <Route
            path="/report/hiring-manager-report"
            element={<AdminUnderConstruction title={"Hiring manager report"}/>}
          />
          <Route
            path="/report/candidate-report"
            element={<AdminUnderConstruction title={"Candidate Report"}/>}
          />
          <Route
            path="/report/jobs-without-matched-candidates"
            element={<AdminUnderConstruction title={"Jobs without matched candidate"}/>}
          />
          <Route
            path="/report/canddates-without-matched-jobs"
            element={<AdminUnderConstruction title={"Candidate without matched jobs"}/>}
          />
          <Route
            path="/report/non-published-jobs"
            element={<AdminUnderConstruction title={"Non published jobs"}/>}
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
            path="/report"
            element={
              <PrivateRoute>
                <CustomerUnderConstruction title={"Reports"} />
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
                <CandidateTablist />
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
                <CandidateUnderConstruction title={"Calendar"} />
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

              {/* <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              /> */}

              {/* <Route
                path="/candidate-list/:jobId"
                element={
                  <PrivateRoute>
                    <CandidateList type="candidate" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/rejected-candidate/:jobId"
                element={
                  <PrivateRoute>
                    <CandidateList type="rejected" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/accepted-candidate/:jobId"
                element={
                  <PrivateRoute>
                    <CandidateList type="accepted" />
                  </PrivateRoute>
                }
              /> */}

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
