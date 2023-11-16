import React from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./jobDetails.scss";

export function ButtonWithCount({ buttonName, color, count, action }) {
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(action);
  };
  return (
    <>
      <Button color={color} className="mr-10" onClick={navigateTo}>
        {" "}
        {buttonName}
        <span className="badge pill bg-light">{count}</span>{" "}
      </Button>
    </>
  );
}
