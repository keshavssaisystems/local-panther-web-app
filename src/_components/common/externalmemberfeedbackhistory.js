import React from "react";
import DataTable from "react-data-table-component";
import { Row, Col } from "reactstrap";
import moment from "moment";
import memoize from "memoize-one";
import { getTimezoneDateTime } from "_helpers/helper";
import { useSelector } from "react-redux";
import "./../common/offerhistory.scss";

export const ExternalMemberFeedbackHistTable = (props) => {

    const interviewStatusList = useSelector((state) => state.scheduleInterview.interviewStatus);
    const interviewRoundList = useSelector((state) => state.dropdown.interviewRounds);

    const columns = memoize((statusList, roundList) => [
        {
            name: <span className="table-title">Round</span>,
            id: "Round",
            cell: (row) => {
                // Prefer DB-stored interviewroundid lookup; fall back to client-side roundname
                if (row?.interviewroundid) {
                    const match = roundList?.find((r) => Number(r.id) === Number(row.interviewroundid));
                    if (match) return match.name;
                }
                return row?.roundname || "-";
            },
            selector: (row) => {
                if (row?.interviewroundid) {
                    const match = roundList?.find((r) => Number(r.id) === Number(row.interviewroundid));
                    if (match) return match.name;
                }
                return row?.roundname || "-";
            },
            grow: 1
        },
        {
            name: <span className="table-title">Name</span>,
            id: "Name",
            cell: (row) => row?.name ? row.name : "-",
            selector: (row) => row?.name ? row.name : "-",
            grow: 1
        },
        {
            name: <span className="table-title">Email</span>,
            id: "Email",
            cell: (row) => row?.email ? row.email : "-",
            selector: (row) => row?.email ? row.email : "-",
            grow: 2
        },
        {
            name: <span className="table-title">Interview Status</span>,
            id: "Interview Status",
            cell: (row) => {
                if (!row?.interviewstatusid) return "-";
                const match = statusList?.find((s) => Number(s.id) === Number(row.interviewstatusid));
                return match ? match.name : row.interviewstatusid;
            },
            selector: (row) => {
                if (!row?.interviewstatusid) return "-";
                const match = statusList?.find((s) => Number(s.id) === Number(row.interviewstatusid));
                return match ? match.name : String(row.interviewstatusid);
            },
            grow: 1
        },
        {
            name: <span className="table-title">Feedback</span>,
            id: "Feedback",
            cell: (row) => row?.feedback ? row.feedback : "-",
            selector: (row) => row?.feedback ? row.feedback : "-",
            grow: 3
        },
        {
            name: <span className="table-title">Submitted On</span>,
            id: "Submitted On",
            cell: (row) => row?.createddate
                ? getTimezoneDateTime(moment(row.createddate).format("YYYY-MM-DD HH:mm:ss"))
                : "-",
            selector: (row) => row?.createddate
                ? getTimezoneDateTime(moment(row.createddate).format("YYYY-MM-DD HH:mm:ss"))
                : "-",
            grow: 1
        }
    ]);

    return (
        <div className="hist-cont">
            <Row>
                <Col>
                    <DataTable
                        data={props?.externalFeedbackList}
                        columns={columns(interviewStatusList, interviewRoundList)}
                        persistTableHead
                    // pagination
                    />
                </Col>
            </Row>
        </div>
    );
};
