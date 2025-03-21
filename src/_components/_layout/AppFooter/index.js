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
          </div>
        </div>
        <div className="app-footer-right">
          <div className="footer-dots">
            <a
              href="/privacy"
              className="text-primary account-text me-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <div className="dots-separator" />
            <a
              href="/terms"
              className="text-primary account-text me-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
            <div className="dots-separator" />
            <a
              href="/support"
              className="text-primary account-text me-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Support
            </a>
            <div className="dots-separator" />
            <a
              href="/contact"
              className="text-primary account-text me-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
            <div className="dots-separator" />
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
