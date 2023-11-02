import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import moment from "moment-timezone";
import "./dashboard.scss";
import { getTimezoneDateTime } from "_helpers/helper";

export function UpcomingInterviewTable({ tableData }) {
  const customStyles = {
    headRow: {
      style: {
        borderTopWidth: "0px",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightWidth: "0px",
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightWidth: "0px",
          cursor: "pointer",
        },
      },
    },
  };
  const columns = (clickHandler) => [
    {
      name: "Candidate",
      selector: (row) => row.candidatename,
      sortable: true,
      width: "170px",
    },
    {
      name: "Job title",
      id: "jobtitle",
      selector: (row) => (row.jobtitle === "" ? "-" : row.jobtitle),
      sortable: true,
      width: "150px",
    },
    {
      name: "Date",
      sortable: true,
      width: "120px",
      selector: (row) =>
        getTimezoneDateTime(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime,
          "MM/DD/YYYY"
        ),
    },
    {
      name: "Time",
      sortable: true,
      width: "100px",
      selector: (row) =>
        getTimezoneDateTime(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime,
          "h:mm a"
        ),
    },
    {
      name: "Status",
      selector: (row) => (row.meetingstatus === "" ? "-" : row.meetingstatus),
      sortable: true,
    },
  ];
  return (
    <>
      <Card className="mb-3 chart-fixed-height">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <BsFillCalendarWeekFill className="me-1" />
            Upcoming interviews
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <DataTable
            columns={columns()}
            data={tableData}
            persistTableHead
            customStyles={customStyles}
            pagination
            className="mt-2"
          />
        </CardBody>
      </Card>
    </>
  );
}
