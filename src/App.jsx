import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from '_helpers';
import { PrivateRoute } from '_components';
import { Home } from 'home';
// import { Dashboard } from 'dashboard';
import FormStickyBasic  from 'createjob/CreateJob'
import { Login } from 'login';

import { AppHeader } from '_layout/AppHeader';
import { AppSidebar } from '_layout/AppSidebar';
import { AppFooter } from '_layout/AppFooter';

export function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <>
            <AppHeader />
            <div className="app-main">
                <AppSidebar />
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <Routes>
                            <Route
                                path="/home"
                                element={
                                    <PrivateRoute>
                                        <Home />
                                    </PrivateRoute>
                                }
                            />
   <Route path="/" element={< FormStickyBasic/>} />
                            {/* <Route path="/" element={<Dashboard />} /> */}
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                <AppFooter />
                </div>
            </div>
        </>
    );
}
