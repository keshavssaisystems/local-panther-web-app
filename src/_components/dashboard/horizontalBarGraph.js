import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import "./dashboard.scss";

export function HorizonatalBarGraph({ graphData }) {
  let options = {
    chart: {
      fontFamily: "Capitana",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: "#E0E0E0",
      xaxis: {
        lines: {
          show: true,
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
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: [
      "rgba(255, 64, 109, 0.40)",
      "rgba(247, 185, 36, 0.40)",
      "rgba(43, 128, 253, 0.40)",
    ],
    xaxis: {
      categories: ["Rejected ", "Scheduled", "Accepted"],
    },
    series: [
      {
        name: "Rejected",
        data: [graphData?.rejected, 0, 0],
      },
      {
        name: "Scheduled",
        data: [0, graphData?.scheduled, 0],
      },
      {
        name: "Accepted",
        data: [0, 0, graphData?.accepted],
      },
    ],
    legend: {
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  };
  return (
    <>
      <Card className="mb-3 chart-fixed-height">
        <CardBody className="p-0">
          <Row>
            <Col md={1} sm={1} xs={1}>
              <div className="icon-wrapper rounded-circle mt-3 ms-3">
                <div className={"icon-wrapper-bg bg-dark"} />
                <i className={"lnr-users mb-1 text-dark"} />
              </div>
            </Col>
            <Col md={11} sm={11} xs={11} className="ps-2">
              <div className="card-header-title font-size-lg mt-3 ms-4 text-capitalize fw-normal">
                Candidate Interview's
              </div>
              <span className="text-muted mt-1 ms-4">
                Accepted, Scheduled & rejected
              </span>
            </Col>
          </Row>
          <Chart
            options={options}
            series={options.series}
            type={"bar"}
            height={250}
            width={"95%"}
          />
        </CardBody>
      </Card>
    </>
  );
}
