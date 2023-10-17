import React from "react";
import { Card, CardBody } from "reactstrap";
import Chart from "react-apexcharts";

export function StackBarChart() {
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
    series: [
      {
        name: "Clothing",
        data: [42, 52, 16, 55, 59, 51, 45, 32, 26, 33],
      },
      {
        name: "Food Products",
        data: [6, 12, 4, 7, 5, 3, 6, 4, 3, 3],
      },
    ],
    labels: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
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
