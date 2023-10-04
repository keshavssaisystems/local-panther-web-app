import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import { PrivateRoute } from "_components";
import { Home } from "_containers/home";
import { Dashboard } from "dashboard";
import { JobList } from "_containers/customer/jobs/JobList";
import { ScheduleInterview } from "_containers/customer/scheduleInterview/scheduleInterview";
import { CreateJobWizard } from "_containers/customer/createJob/createJobWizard";
import { Login } from "_containers/login/Login";
import { Registration } from "_containers/registration/Registration";
import { RegistrationSuccess } from "_containers/registration/RegistrationSuccess";
import { CandidateList } from "_containers/candidate/recommendedcandidates/CandidateList";
import { RecommendedJobList } from "_containers/candidate/RecommendedJobList";
import { AppHeader } from "_components/_layout/AppHeader";
import { AppSidebar } from "_components/_layout/AppSidebar";
import { AppFooter } from "_components/_layout/AppFooter";
import "./app.scss";
import { ForgotPassword } from "_containers/forgotpassword/forgotPassword";
import { ForgotPasswordSuccess } from "_containers/forgotpassword/forgotPasswordSuccess";
import { CustomerCandidateLists } from "_containers/customer/candidatelists/customercandidatelists";
import { CandidateTablist } from "_containers/candidate/candidateTablist";
import { OnboardCustomer } from "_containers/admin/customer";
import { CandidateProfile } from "_containers/candidate/candidateProfile";

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
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-customer"
            element={<OnboardCustomer></OnboardCustomer>}
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
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-list"
            element={
              <PrivateRoute>
                <JobList />
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
        </>
      );
    } else {
      return (
        <>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
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
            <Routes>
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
