import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";

export function StackBarChart({ graphData }) {
  const stackValues = [
    "Matched candidates",
    "Liked by customer",
    "Liked by candidate",
    "Liked by both",
    "Accepted by customer",
    "Accepted by candidate",
    "Accepted by both",
    "Rejected by customer",
    "Rejected by candidate",
  ];
  const stackValuesKey = {
    "Matched candidates": "matchedcandidate",
    "Liked by customer": "likedbycustomer",
    "Liked by candidate": "likedbycandidate",
    "Liked by both": "likedbyboth",
    "Accepted by customer": "acceptedbycustomer",
    "Accepted by candidate": "acceptedbycandidate",
    "Accepted by both": "acceptedbyboth",
    "Rejected by customer": "rejectedbycustomer",
    "Rejected by candidate": "rejectedbycandidate",
  };
  let mainArray = {
    matchedcandidate: [],
    likedbycustomer: [],
    likedbycandidate: [],
    likedbyboth: [],
    acceptedbycustomer: [],
    acceptedbycandidate: [],
    rejectedbycustomer: [],
    rejectedbycandidate: [],
    acceptedbyboth: [],
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
  let baroptions = {
    chart: {
      type: "bar",
      height: 380,
      width: "80%",
      // stacked: true,
      // stackType: "100%",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    colors: [
      "#008FFB",
      "#00D8B6",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#01BFD6",
      "#5564BE",
      "#F7A600",
      "#EDCD24",
      "#F74F58",
    ],
    series: seriesDataArray,
    labels: mainArray["jobtitle"],
    xaxis: {
      labels: {
        show: true,
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
