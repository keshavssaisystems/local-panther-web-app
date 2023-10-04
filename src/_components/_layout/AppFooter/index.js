import React from "react";
import { Link } from "react-router-dom";
import "./appfooter.scss";

export function AppFooter() {
  return (
    <div className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer-left">
          <div className="footer-dots">
            &copy; The Panther Group
            <div className="dots-separator" />
              <Link
                to="/policy"
                className="text-primary account-text me-3"
              >
                Privacy Policy
              </Link>
            <div className="dots-separator" />
             <Link
                to="/terms"
                className="text-primary account-text me-3"
              >
                Terms
              </Link>
          </div>
        </div>
        <div className="app-footer-right"></div>
      </div>
    </div>
  );
}
