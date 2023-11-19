import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import "./dashboard.scss";

export function Statistics({ graphData }) {
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
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    },
    series: [
      {
        name: "New jobs",
        data: [10, 41, 35, 10, 49, 62],
      },
      {
        name: "New candidates",
        data: [10, 91, 35, 51, 49, 91],
      },
      {
        name: "Interviews",
        data: [10, 41, 81, 51, 43, 1],
      },
    ],
    legend: {
      position: "top",
      offsetX: 400,
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
