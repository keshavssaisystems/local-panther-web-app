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
            : props?.avgscore * 10 > 80
            ? "success"
            : "active"
        }
        theme={{
          error: {
            symbol: <span className="perc">{props?.avgscore * 10 + "%"}</span>,
            trailColor: "pink",
            color: "red",
          },

          active: {
            symbol: <span className="perc">{props?.avgscore * 10 + "%"}</span>,
            trailColor: "lightblue",
            color: "blue",
          },
          success: {
            symbol: <span className="perc">{props?.avgscore * 10 + "%"}</span>,
            trailColor: "lime",
            color: "green",
          },
        }}
      />
    </div>
  );
};
