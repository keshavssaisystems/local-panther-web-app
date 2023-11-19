import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";
import "./dashboard.scss";

export function OpenJobsGraph({ graphData }) {
  let options = {
    chart: {
      fontFamily: "Capitana",
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#545CD8"],
    xaxis: {
      categories: ["< 7 days", "< 30 days", "< 60 days", " 60+ days"],
    },
    yaxis: {
      show: false,
    },
    series: [
      {
        name: "New jobs",
        data: [10, 41, 35, 10],
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
      <Card className="mb-3 chart-fixed-height open-jobs-graph">
        <CardBody className="p-0">
          <div className="mt-3 ms-4 open-jobs-count">
            234
            <span className="mt-1 ms-2 open-jobs-title">Open Jobs</span>
          </div>

          <Chart
            options={options}
            series={options.series}
            type={"bar"}
            height={"80%"}
            width={"95%"}
          />
        </CardBody>
      </Card>
    </>
  );
}
