import React from "react";
import DataTable from "react-data-table-component";
import { Row, Col } from "reactstrap";
import moment from "moment";
import memoize from "memoize-one";
import { getTimezoneDateTime } from "_helpers/helper";
export const CandidateInterviewHistTable = (props) => {

    const columns = memoize((clickHandler) => [
        {
            name: <span className="table-title">Scheduled By</span>,
            id: "Scheduled By",
            cell: (row) => (
                <div
                    style={{
                        background: row?.BGColor,
                        color: row?.TextColor,
                        margin: '5px 0',
                        padding: '4px 10px',
                        borderRadius: '20px',           // makes it round like a pill
                        display: 'inline-block'
                    }}
                >
                    {row.lastscheduledbyname}
                </div>),
            selector: (row) => (row?.lastscheduledbyname ? row?.lastscheduledbyname : "-"),
            grow: 1
        },
        {
            name: <span className="table-title">Date Time</span>,
            id: "Date Time",
            cell: (row) => getTimezoneDateTime(moment(row?.scheduledate + " " + row?.starttime).format("YYYY-MM-DD HH:mm:ss")),
            selector: (row) => (getTimezoneDateTime(moment(row?.scheduledate + " " + row?.starttime).format("YYYY-MM-DD HH:mm:ss"))),
            grow: 1
        },

        {
            name: <span className="table-title">Interviewer</span>,
            id: "Interviewer",
            cell: (row) => row?.intervieweremailids,
            selector: (row) => (row?.intervieweremailids),
            grow: 1
        },

        {
            name: <span className="table-title">Feedback</span>,
            id: "Feedback",
            cell: (row) => (row?.interviewstatus || '') + (row?.interviewfeedback ? " - " + row?.interviewfeedback : ''),
            selector: (row) => (row?.interviewstatus || '' + (row?.interviewfeedback ? " - " + row?.interviewfeedback : '')),
            grow: 2
        },

        {
            name: <span className="table-title">Round</span>,
            id: "Round",
            cell: (row) => row?.roundname,
            selector: (row) => (row?.roundname),
            grow: 2
        }
    ]);

    const handleButtonClick = () => {
        console.log("clicked");
    };

    return (
        <div className="hist-cont">
            <Row>
                <Col>
                    <DataTable
                        data={props?.candidateInterviewList}
                        columns={columns(handleButtonClick)}
                        persistTableHead
                    // pagination
                    />
                </Col>
            </Row>
        </div>
    );
}