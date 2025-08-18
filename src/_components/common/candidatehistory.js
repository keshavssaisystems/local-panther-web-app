import React from "react";
import DataTable from "react-data-table-component";
import { Row, Col } from "reactstrap";
import moment from "moment";
import memoize from "memoize-one";
import { getTimezoneDateTime } from "_helpers/helper";
export const CandidateHistTable = (props) => {

    const columns = memoize((clickHandler) => [
        {
            name: <span className="table-title">Action type</span>,
            id: "Action type",
            cell: (row) => (
                <div
                    style={{
                        background: row?.BGColor,
                        color: row?.TextColor,
                        padding: '4px 10px',
                        borderRadius: '20px',           // makes it round like a pill
                        display: 'inline-block'
                    }}
                >
                    <span> {row.ActionType}</span>
                </div>),
            selector: (row) => (row?.ActionType ? row?.ActionType : "-"),
        },
        {
            name: <span className="table-title">Action date</span>,
            id: "Action date",
            cell: (row) => row?.ActionDateTime ? getTimezoneDateTime(moment(row?.ActionDateTime), "MM/DD/YYYY hh:mm A") : "-",
            selector: (row) => (row?.ActionDateTime ? row?.ActionDateTime : "-"),
        },

        {
            name: <span className="table-title">Action by</span>,
            id: "Action by",
            cell: (row) => row?.CutomerName ? row?.CutomerName : "-",
            selector: (row) => (row?.CutomerName ? row?.CutomerName : "-"),
        },

        {
            name: <span className="table-title">Comments</span>,
            id: "Comments",
            cell: (row) => row?.Comments ? row?.Comments : "-",
            selector: (row) => (row?.Comments ? row?.Comments : "-"),
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
                        data={props?.candidateHistoryList}
                        columns={columns(handleButtonClick)}
                        persistTableHead
                    // pagination
                    />
                </Col>
            </Row>
        </div>
    );
}