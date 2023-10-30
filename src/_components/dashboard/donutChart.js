import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import "./dashboard.scss";

export function DonutChart({ graphData }) {
  let total = graphData?.accepted + graphData?.scheduled + graphData?.rejected;
  let acceptedPercentage = (graphData?.accepted / total) * 100 ?? 0;
  let rejectedPercentage = (graphData?.rejected / total) * 100 ?? 0;
  let scheduledPercentage = (graphData?.scheduled / total) * 100 ?? 0;
  let options = {
    chart: {
      type: "donut",
      width: "70%",
      height: 300,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#00D8B6", "#008FFB", "#FF4560"],
    plotOptions: {
      pie: {
        customScale: 0.8,
        donut: {
          size: "55%",
        },
      },
      stroke: {
        colors: undefined,
      },
    },
    fill: {
      type: "gradient",
    },
    series: [graphData?.accepted, graphData?.scheduled, graphData?.rejected],
    labels: [
      Math.round(acceptedPercentage) + "% Accepted",
      Math.round(scheduledPercentage) + "% Scheduled",
      Math.round(rejectedPercentage) + "% Rejected",
    ],
    legend: {
      position: "right",
      offsetY: 60,
      offsetX: 30,
    },
  };
  return (
    <>
      <Card className="mb-3 chart-fixed-height">
        <CardBody className="p-0">
          <Row>
            <Col md={1} className="me-2">
              <div className="icon-wrapper rounded-circle mt-3 ms-3">
                <div className={"icon-wrapper-bg bg-dark"} />
                <i className={"lnr-users mb-1 text-dark"} />
              </div>
            </Col>
            <Col>
              <div className="card-header-title font-size-lg mt-3 ms-4 text-capitalize fw-normal">
                Candidate's
              </div>
              <span className="text-muted mt-1 ms-4">
                Accepted, scheduled & rejected
              </span>
            </Col>
          </Row>
          <Chart
            options={options}
            series={options.series}
            type={options.chart.type}
            height={options.chart.height}
            width={options.chart.width}
          />
        </CardBody>
      </Card>
    </>
  );
}
