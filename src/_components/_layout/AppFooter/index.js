import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./appfooter.scss";
import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "_store";

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

  return (
    <div className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer-left">
          <div className="footer-dots">
            &copy; OpenWorx
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
            <Link
              to={contactData ? contactData[0]?.name : ""}
              className="text-primary account-text me-3"
              target="_blank"
            >
              About us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
