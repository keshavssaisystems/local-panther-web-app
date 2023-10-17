import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";

export function StackBarChart({ graphData }) {
  console.log(graphData);
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
  let JobTitle = [];
  let mainArray = [];
  let matchedcandidate = [];
  let likedbycustomer = [];
  let likedbycandidate = [];
  let likedbyboth = [];
  let acceptedbycustomer = [];
  let acceptedbycandidate = [];
  let acceptedbyboth = [];
  let rejectedbycustomer = [];
  let rejectedbycandidate = [];
  let seriesDataArray = [];
  if (graphData?.length !== undefined) {
    graphData.forEach((jobValue) => {
      if (jobValue.hasOwnProperty("matchedcandidate")) {
        matchedcandidate.push(jobValue["matchedcandidate"]);
      }
      if (jobValue.hasOwnProperty("likedbycustomer")) {
        likedbycustomer.push(jobValue["likedbycustomer"]);
      }
      if (jobValue.hasOwnProperty("likedbycandidate")) {
        likedbycandidate.push(jobValue["likedbycandidate"]);
      }
      if (jobValue.hasOwnProperty("likedbyboth")) {
        likedbyboth.push(jobValue["likedbyboth"]);
      }
      if (jobValue.hasOwnProperty("acceptedbycustomer")) {
        acceptedbycustomer.push(jobValue["acceptedbycustomer"]);
      }
      if (jobValue.hasOwnProperty("acceptedbycandidate")) {
        acceptedbycandidate.push(jobValue["acceptedbycandidate"]);
      }
      if (jobValue.hasOwnProperty("acceptedbyboth")) {
        acceptedbyboth.push(jobValue["acceptedbyboth"]);
      }
      if (jobValue.hasOwnProperty("rejectedbycustomer")) {
        rejectedbycustomer.push(jobValue["rejectedbycustomer"]);
      }
      if (jobValue.hasOwnProperty("rejectedbycandidate")) {
        rejectedbycandidate.push(jobValue["rejectedbycandidate"]);
      }
      if (jobValue.hasOwnProperty("jobtitle")) {
        JobTitle.push(jobValue["jobtitle"]);
      }
      mainArray["matchedcandidate"] = matchedcandidate;
      mainArray["likedbycustomer"] = likedbycustomer;
      mainArray["likedbycandidate"] = likedbycandidate;
      mainArray["likedbyboth"] = likedbyboth;
      mainArray["acceptedbycustomer"] = acceptedbycustomer;
      mainArray["acceptedbycandidate"] = acceptedbycandidate;
      mainArray["rejectedbycustomer"] = rejectedbycustomer;
      mainArray["rejectedbycandidate"] = rejectedbycandidate;
      mainArray["acceptedbyboth"] = acceptedbyboth;
    });
    stackValues.forEach((element) => {
      let seriesData = {
        name: element,
        data: mainArray[stackValuesKey[element]],
      };
      seriesDataArray.push(seriesData);
    });
    console.log(seriesDataArray);
  }
  let baroptions = {
    chart: {
      type: "bar",
      height: 380,
      width: "80%",
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
      },
    },
    series: seriesDataArray,
    labels: JobTitle,
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
