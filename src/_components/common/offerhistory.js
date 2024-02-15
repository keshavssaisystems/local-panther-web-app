import React from "react";
import DataTable from "react-data-table-component";
import { Row, Col } from "reactstrap";
import moment from "moment";
import memoize from "memoize-one";
import finalOffer from "assets/utils/images/job-detail-icons/finaloffer.svg";
import previousOffer from "assets/utils/images/job-detail-icons/previousoffer.svg";
import currentOffer from "assets/utils/images/job-detail-icons/currentoffer.svg";
import "./offerhistory.scss";
export const OfferHistTable = (props) => {
  const returnStatus = (row, index) => {
    if (index === 0 && row?.isfinaloffer) {
      return (
        <div
          style={{ textTransform: "unset" }}
          className="mb-2 me-2 badge bg-success rounded-pill"
        >
          New offer
        </div>
      );
    } else if (index === 0 && props?.activeTab === "accepted") {
      return (
        <div
          style={{ textTransform: "unset" }}
          className="mb-2 me-2 badge bg-success rounded-pill"
        >
          Accepted offer
        </div>
      );
    } else if (index === 0) {
      return (
        <div
          style={{ textTransform: "unset" }}
          className="mb-2 me-2 badge bg-primary rounded-pill"
        >
          New offer
        </div>
      );
    } else {
      return (
        <div
          style={{ textTransform: "unset" }}
          className="mb-2 me-2 badge bg-danger rounded-pill"
        >
          Previous offer
        </div>
      );
    }
  };

  const returnOffer = (row, index) => {
    if (index === 0 && row?.isfinaloffer) {
      return (
        <img
          src={finalOffer}
          alt="final offer"
          className={"icon-pointer me-2"}
          width={"20px"}
          title="Final Offer - Click to view offer"
          onClick={() => window.open(row?.offerfilepath)}
        ></img>
      );
    } else if (index === 0 && props?.activeTab === "accepted") {
      return (
        <img
          src={finalOffer}
          alt="final offer"
          className={"icon-pointer me-2"}
          width={"20px"}
          title="Final Offer - Click to view offer"
          onClick={() => window.open(row?.offerfilepath)}
        ></img>
      );
    } else if (index === 0) {
      return (
        <img
          src={currentOffer}
          alt="new offer"
          className={"icon-pointer"}
          width={"20px"}
          title="New Offer - Click to view offer"
          onClick={() => window.open(row?.offerfilepath)}
        ></img>
      );
    } else {
      return (
        <img
          src={previousOffer}
          alt="previous offer"
          className={"icon-pointer me-2"}
          width={"20px"}
          title="Previous Offer - Click to view offer"
          onClick={() => window.open(row?.offerfilepath)}
        ></img>
      );
    }
  };

  const columns = memoize((clickHandler) => [
    {
      name: <span className="table-title">Generated date</span>,
      id: "Generated date",
      cell: (row) =>
        row?.createddate ? moment(row?.createddate).format("MM/DD/YYYY") : "-",
      selector: (row) => (row?.createddate ? row?.createddate : "-"),
    },
    {
      name: <span className="table-title">Start date</span>,
      id: "Start date",
      cell: (row) =>
        row?.startdate ? moment(row?.startdate).format("MM/DD/YYYY") : "-",
      selector: (row) => (row?.startdate ? row?.startdate : "-"),
    },

    {
      name: <span className="table-title">Salary</span>,
      id: "Salary",
      cell: (row) => (row?.salary ? `$${row?.salary}` : "-"),
      selector: (row) => (row?.salary ? row?.salary : "-"),
    },

    {
      name: <span className="table-title">Status</span>,
      id: "Status",
      cell: (row, index) => returnStatus(row, index),
      //   selector: (row) => (row?.salary ? row?.salary : "-"),
    },

    {
      name: <span className="table-title">Offer letter doc</span>,
      id: "Offer letter doc",
      cell: (row, index) => returnOffer(row, index),
      //   selector: (row) => (row?.salary ? row?.salary : "-"),
    },
  ]);

  const handleButtonClick = () => {
    console.log("clicked");
  };

  const handleRowClick = (data) => {
    console.log(data);
  };
  return (
    <div className="hist-cont">
      <Row>
        <Col>
          <DataTable
            onRowClicked={handleRowClick}
            data={props?.offerHistory}
            columns={columns(handleButtonClick)}
            persistTableHead
            // pagination
          />
        </Col>
      </Row>
    </div>
  );
};
