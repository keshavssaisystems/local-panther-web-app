import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";
import "./dashboard.scss";
import moment from "moment";

export function Statistics({ graphData }) {
  let jobsArray = [];
  let interviewArray = [];
  let candidateArray = [];
  let monthArray = [];
  graphData.forEach((element) => {
    jobsArray?.push(element?.jobs);
    interviewArray?.push(element?.interviews);
    candidateArray?.push(element?.candidates);
    monthArray?.push(moment(element?.startdate).format("MMM"));
  });
  let options = {
    chart: {
      fontFamily: "Capitana",
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: "#E0E0E0",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#2B80FD", "#14BD66", "#FF406D"],
    xaxis: {
      categories: monthArray,
    },
    series: [
      {
        name: "New jobs",
        data: jobsArray,
      },
      {
        name: "New candidates",
        data: candidateArray,
      },
      {
        name: "Interviews",
        data: interviewArray,
      },
    ],
    legend: {
      position: "top",
      offsetX: 100,
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  };
  return (
    <>
      <Card className="mb-3 chart-fixed-height statistics">
        <CardBody className="p-0">
          <div className="card-header-title font-size-lg mt-3 ms-4 text-capitalize fw-normal stats-title">
            Statistics
          </div>
          <span className="mt-1 ms-4 stats-subtitle">Last 6 months</span>
          <Chart
            options={options}
            series={options.series}
            type={"line"}
            height={"80%"}
            width={"95%"}
          />
        </CardBody>
      </Card>
    </>
  );
}
