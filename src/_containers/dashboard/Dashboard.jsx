import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "_components/common/pagetitle";

// DASHBOARDS
import AdminDashboardDetails from "_containers/admin/AdminDashboardDetails";

import titlelogo from "../../assets/utils/images/candidate.svg";
import { userActions } from "_store";
import CustomerDashboardDetails from "_containers/customer/CustomerDashboardDetails";
import CandidateDashboardDetails from "_containers/candidate/CandidateDashboardDetails";
import { analytics } from "firebase";

export const AdminDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getAll());
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin dashboard",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, [dispatch]);

  return (
    <div>
      <PageTitle heading="Admin Dashboard" icon={titlelogo} />
      <AdminDashboardDetails />
    </div>
  );
};

export const CustomerDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getAll());
  }, [dispatch]);

  return (
    <div>
      <PageTitle heading="Customer Dashboard" icon={titlelogo} />
      <CustomerDashboardDetails />
    </div>
  );
};

export const CandidateDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getAll());
  }, [dispatch]);

  return (
    <div>
      <PageTitle heading="Candidate Dashboard" icon={titlelogo} />
      <CandidateDashboardDetails />
    </div>
  );
};
