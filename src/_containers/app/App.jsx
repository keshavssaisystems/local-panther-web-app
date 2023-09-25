import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import { PrivateRoute } from "_components";
import { Home } from "_containers/home";
import { Dashboard } from "dashboard";
import { JobList } from "_containers/customer/jobs/JobList";
import { ScheduleInterview } from "_containers/customer/scheduleInterview";
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

export function App() {
  const authUser = useSelector((x) => x?.auth?.token);

  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <>
      {authUser && <AppHeader />}
      <div className={authUser ? `app-main` : ""}>
        {authUser && <AppSidebar />}
        <div className={authUser ? `app-main__outer` : ""}>
          <div className="app-main__inner">
            <Routes>
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
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
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
                path="/scheduled-interview"
                element={
                  <PrivateRoute>
                    <ScheduleInterview />
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
              <Route
                path="/test"
                element={<CustomerCandidateLists type={"matched"} />}
              />
              <Route
                path="/test1"
                element={<CustomerCandidateLists type={"liked"} />}
              />
              <Route
                path="/test2"
                element={<CustomerCandidateLists type={"maybe"} />}
              />
              <Route
                path="/test3"
                element={<CustomerCandidateLists type={"applied"} />}
              />
              <Route
                path="/test4"
                element={<CustomerCandidateLists type={"scheduled"} />}
              />
              <Route
                path="/test5"
                element={<CustomerCandidateLists type={"accepted"} />}
              />
              <Route
                path="/test6"
                element={<CustomerCandidateLists type={"rejected"} />}
              />
            </Routes>
          </div>
          {authUser && <AppFooter />}
        </div>
      </div>
    </>
  );
}
