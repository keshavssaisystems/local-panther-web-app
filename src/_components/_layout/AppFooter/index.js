import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./appfooter.scss";
import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "_store";
import logo from "../../../assets/utils/images/panther-logo.png";
import admin from "../../../assets/utils/OpenWorx_Admin_User_Manual.pdf";
import employer from "../../../assets/utils/OpenWorx_Web_Employer_User_Manual.pdf";
import candidate from "../../../assets/utils/OpenWorx_Web_Candidate_User_Manual.pdf";

export function AppFooter() {
  const dispatch = useDispatch();

  const privacyPolicy = useSelector((state) => state.getSettings?.user?.data);

  const termsData = useSelector(
    (state) => state.getSettings?.user?.serviceDetails
  );
  const contactData = useSelector(
    (state) => state.getSettings?.user?.companyDetails
  );
  useEffect(() => {
    loadData();
  }, []);

  const loadData = function () {
    dispatch(settingsActions.getPolicy());
    dispatch(settingsActions.getService());
    dispatch(settingsActions.getCompanyDetails());
  };

  let userRoleId = localStorage.getItem("userroleid");
  let helpFile = logo;
  if (userRoleId === 1) {
    helpFile = logo;
  } else if (userRoleId === 2) {
    helpFile = logo;
  }

  return (
    <div className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer-left">
          <div className="footer-dots">
            Powered by{" "}
            <img src={logo} className="footer-logo ms-1" alt="logo" />
            <div className="dots-separator" />
            <Link
              to={privacyPolicy ? privacyPolicy[0]?.name : ""}
              target="_blank"
              className="text-primary account-text me-3"
            >
              Privacy Policy
            </Link>
            <div className="dots-separator" />
            <Link
              to={termsData ? termsData[0]?.name : ""}
              className="text-primary account-text me-3"
              target="_blank"
            >
              Terms
            </Link>
          </div>
        </div>
        <div className="app-footer-right">
          <div className="footer-dots">
            {/* <div className="dots-separator" />
            <Link to="/security" className="text-primary account-text me-3">
              Security
            </Link> */}
            {/* <div className="dots-separator" /> */}
            {/* <Link
              to={contactData ? contactData[0]?.name : ""}
              className="text-primary account-text me-3"
              target="_blank"
            >
              About us
            </Link> */}
            <Link
              to={
                userRoleId === "1"
                  ? admin
                  : userRoleId === "2"
                  ? employer
                  : candidate
              }
              className="text-primary account-text me-3"
              target="_blank"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
