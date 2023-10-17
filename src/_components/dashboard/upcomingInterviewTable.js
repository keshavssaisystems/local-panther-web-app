import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import moment from "moment-timezone";

export function UpcomingInterviewTable() {
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
      width: "150px",
    },
    {
      name: "Job title",
      id: "jobtitle",
      selector: (row) =>
        row.candidateskills === "" ? "-" : row.candidateskills,
      sortable: true,
      width: "120px",
    },
    {
      name: "Date",
      sortable: true,
      width: "80px",
      selector: (row) =>
        moment(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime
        )
          .tz("America/New_York")
          .format("MM/DD/YYYY h:mm a"),
    },
    {
      name: "Time",
      sortable: true,
      width: "80px",
      selector: (row) =>
        moment(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime
        )
          .tz("America/New_York")
          .format("MM/DD/YYYY h:mm a"),
    },
    {
      name: "Status",
      selector: (row) => (row.duration === "" ? "-" : row.duration),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (row.duration === "" ? "-" : row.duration),
      sortable: true,
    },
  ];
  return (
    <>
      <Card className="mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <BsFillCalendarWeekFill className="me-1" />
            Upcoming interviews
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <DataTable
            columns={columns()}
            data={[]}
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
