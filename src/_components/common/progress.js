import React from "react";
import { Progress } from "react-sweet-progress";
import "./progress.scss";
export const ProgressCircle = (props) => {
  return (
    <div className="progress-cont">
      <Progress
        className="mb-3"
        percent={props?.avgscore * 10}
        type="circle"
        width={60}
        strokeWidth={6}
        symbol={props?.avgscore * 10 + "%"}
        status={
          props?.avgscore * 10 < 40
            ? "error"
            : props?.avgscore * 10 >= 80
            ? "success"
            : "active"
        }
        theme={{
          error: {
            symbol: <span className="perc">{props?.avgscore * 10 + "%"}</span>,
            trailColor: "#FFEBF0",
            color: "#FF406D",
          },

          active: {
            symbol: <span className="perc">{props?.avgscore * 10 + "%"}</span>,
            trailColor: "#FFF3D6",
            color: "#F7B924",
          },
          success: {
            symbol: <span className="perc">{props?.avgscore * 10 + "%"}</span>,
            trailColor: "#D0F2E0",
            color: "#14BD66",
          },
        }}
      />
    </div>
  );
};
