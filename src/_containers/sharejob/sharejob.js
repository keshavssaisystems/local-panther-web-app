import React, { useState, useEffect } from "react";
import PageTitle from "../../_components/common/pagetitle";
import titlelogo from "../../assets/utils/images/candidate.svg";
import { Alerts } from "_containers/candidate/dashboard/alerts";
import { useDispatch } from "react-redux";
import { candidateDashboardActions } from "_store";

export const ShareJobDetails = () => {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return <div>Share Job</div>;
};
