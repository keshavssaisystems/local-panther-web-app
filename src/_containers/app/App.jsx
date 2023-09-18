import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import { PrivateRoute } from "_components";
import { Home } from "_containers/home";
import { Dashboard } from "dashboard";
import { JobList } from "_containers/customer/jobs/JobList";
import { JobDetail } from "_containers/customer/jobs/JobDetail";
import { CreateJob } from "_containers/customer/createJob/CreateJob";
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
              <Route path="/job-list" element={<JobList />} />
              <Route path="/JobDetail" element={<JobDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route
                path="/candidate-list"
                element={<CandidateList type="candidate" />}
              />
              <Route
                path="/rejected-list"
                element={<CandidateList type="rejected" />}
              />
              <Route
                path="/accepted-list"
                element={<CandidateList type="accepted" />}
              />
              <Route path="/recommended-job" element={<RecommendedJobList />} />
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
