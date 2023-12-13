import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";

export function StackBarChart({ graphData }) {
  const stackValues = [
    "Accepted",
    "Applied",
    "Interviews",
    "Matched",
    "Offer",
    "Rejected",
  ];
  const stackValuesKey = {
    Accepted: "acceptedcount",
    Applied: "appliedcount",
    Interviews: "interviewcount",
    Matched: "matchedcount",
    Offer: "offerscount",
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
      type: "line",
      height: 380,
      width: "90%",
      toolbar: {
        show: false,
      },
      fontFamily: "Capitana",
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: [
      "#26E7A6",
      "#FEBC3B",
      "#8B75D7",
      "#FB6900",
      "#B44BB0",
      "#26A0FB",
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
    },
  };
  return (
    <>
      <Card className="mb-3">
        <CardBody className="pt-0">
          <Chart
            options={baroptions}
            series={baroptions.series}
            type={baroptions.chart.type}
            height={baroptions.chart.height}
            width={baroptions.chart.width}
          />
        </CardBody>
      </Card>
    </>
  );
}
