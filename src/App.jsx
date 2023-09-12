import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { history } from '_helpers';
import { PrivateRoute } from '_components';
import { Home } from 'home';
import { Dashboard } from 'dashboard';
import { JobList } from '_containers/customer/jobs/JobList';
import { JobDetail } from '_containers/customer/jobs/JobDetail';
import { CreateJob }  from '_containers/customer/createJob/CreateJob'
import { Login } from 'login';
import { Registration } from 'registration';
import { CandidateList } from 'Candidate';
import { RecommendedJobList } from "Candidate/RecommendedJobList";
import { AppHeader } from '_layout/AppHeader';
import { AppSidebar } from '_layout/AppSidebar';
import { AppFooter } from '_layout/AppFooter';

export function App() {
    const authUser = useSelector(x => x.auth.user);

    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <>
            {authUser && <AppHeader />}
            <div className={authUser ? `app-main` : ''}>
            {authUser &&  <AppSidebar />}
                <div className={authUser ? `app-main__outer` : ''}>
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
                            <Route path="/job-detail" element={<JobDetail />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/createJob" element={<CreateJob />} />
                            <Route path="/candidate-list" element={<CandidateList />} />
                            <Route path="/recommended-job" element={<RecommendedJobList />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/registration" element={<Registration />} />
                            {/* <Route path="*" element={<Navigate to="/" />} /> */}
                            
                        </Routes>
                    </div>
                    {authUser && <AppFooter />}
                </div>
            </div>
        </>
    );
}
