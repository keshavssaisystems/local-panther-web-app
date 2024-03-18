import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import { NoDataFound } from "_components/common/nodatafound";
import custDashIcons from "assets/utils/images/customer/dashboard";
import "./dashboard.scss";

export function StackBarChart({ graphData }) {
  const stackValues = [
    "Matched",
    "Applied",
    "Interviews",
    "Offer",
    "Accepted",
    "Rejected",
  ];
  const stackValuesKey = {
    Matched: "matchedcount",
    Applied: "appliedcount",
    Interviews: "interviewcount",
    Offer: "offerscount",
    Accepted: "acceptedcount",
    Rejected: "rejectedcount",
  };
  let mainArray = {
    acceptedcount: [],
    appliedcount: [],
    interviewcount: [],
    jobscount: [],
    matchedcount: [],
    offerscount: [],
    rejectedcount: [],
    jobtitle: [],
    jobid: [],
  };
  let seriesDataArray = [];
  if (graphData?.length !== undefined) {
    graphData.forEach((jobValue) => {
      Object.keys(jobValue).forEach((key) => {
        mainArray[key]?.push(jobValue[key]);
      });
    });
    stackValues.forEach((element) => {
      let seriesData = {
        name: element,
        data: mainArray[stackValuesKey[element]],
      };
      seriesDataArray.push(seriesData);
    });
  }
  let wrappedTitle = [];
  if (mainArray["jobtitle"]?.length > 0) {
    mainArray["jobtitle"].forEach((title) => {
      let wrapTitle = title.split(" ");
      wrappedTitle.push(wrapTitle);
    });
  }
  let baroptions = {
    chart: {
      type: "bar",
      height: 380,
      width: "90%",
      stacked: true,
      toolbar: {
        show: false,
      },
      fontFamily: "Capitana",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        hideZeroBarsWhenGrouped: false,
        columnWidth: "30%",
        dataLabels: {
          total: {
            enabled: true,
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: [
      "#26A0FB",
      "#FEBC3B",
      "#8B75D7",
      "#FB6900",
      "#26E7A6",
      "#B44BB0",
      "#FF6178",
    ],
    series: seriesDataArray,
    labels: wrappedTitle,
    xaxis: {
      labels: {
        show: true,
        rotate: 0,
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          colors: "#78909c",
        },
        formatter: (value) => {
          return value.toFixed(0);
        },
      },
      yaxis: {
        min: "-1",
      },
    },
  };
  return (
    <>
      <div className="customer-slider">
        <div className=" mb-2 main-title">
          <img
            src={custDashIcons.statistics}
            width={16}
            height={16}
            alt="stat icon"
          />{" "}
          <span
            style={{ fontWeight: "500", color: "#2F2E2E", fontSize: "16px" }}
          >
            Job Preferences
          </span>
        </div>
      </div>
      <Card className="mb-3 stackchart">
        {graphData?.length > 0 && (
          <CardBody className="pt-4">
            <Chart
              options={baroptions}
              series={baroptions.series}
              type={baroptions.chart.type}
              height={baroptions.chart.height}
              width={baroptions.chart.width}
            />
          </CardBody>
        )}
        {graphData?.length === 0 && (
          <>
            <Row
              style={{ textAlign: "center" }}
              className="center-middle-align"
            >
              <Col>
                <NoDataFound></NoDataFound>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </>
  );
}
