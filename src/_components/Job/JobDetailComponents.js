import React from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./job.scss";

export function HeadingAndDetailWithDiv({ heading, detail }) {
  return (
    <>
      <div className="p-3">
        <h6 className="fw-bold">{heading}</h6>
        <p className="mb-0">{detail}</p>
      </div>
    </>
  );
}

export function HeadingAndDetail({ heading, detail }) {
  return (
    <>
      <h6 className="fw-bold">{heading}</h6>
      <p className="mb-0">{detail}</p>
    </>
  );
}

export function ButtonWithCount({ buttonName, color, count, action }) {
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(action);
  };
  return (
    <>
      <Button color={color} className="mr-10" onClick={navigateTo}>
        {" "}
        {buttonName}{" "}
        <span className="badge rounded-pill bg-light">{count}</span>{" "}
      </Button>
    </>
  );
}

export function HeadingWithPill({ heading, pillData }) {
  return (
    <>
      <h6 className="fw-bold">{heading}</h6>
      {pillData.length > 0 &&
        pillData.map((pill, key) => (
          <div key={key} className="mb-2 me-2 badge rounded-pill bg-secondary">
            {" "}
            {pill}{" "}
          </div>
        ))}
      {pillData.length === 0 && <p className="mb-0">-</p>}
    </>
  );
}

export function DetailsHeader({ heading, subHeading, image }) {
  return (
    <>
      <div className="dropdown-menu-header">
        <div className="dropdown-menu-header-inner bg-info">
          <div className="menu-header-content btn-pane-right">
            <div>
              <h5 className="menu-header-title fw-bold">{heading}</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
