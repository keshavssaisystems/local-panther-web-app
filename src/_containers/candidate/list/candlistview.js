import React, { useState } from "react";
import memoize from "memoize-one";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Col,
  Button,
} from "reactstrap";

import customerIcons from "assets/utils/images/customer";

export const CandListView = (props) => {
  const onBtnClick = (type, candidaterecommendedjobid) => {
    props.onCandidateActions(type, candidaterecommendedjobid);
  };

  const onShowModal = (row, type) => {
    props.showModal(row, type);
  };
  const renderButtons = (row) => {
    if (props.type === "liked") {
      return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
          <Col>
            <Button
              disabled={props.type === "maybe"}
              // outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              //   onClick={() => onRejectClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="danger"
              onClick={() =>
                onBtnClick("rejected", row.candidaterecommendedjobid)
              }
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
          <Col>
            <Button
              size="sm"
              title="accept"
              className="btn-icon"
              color="success"
              onClick={() =>
                onBtnClick("accepted", row.candidaterecommendedjobid)
              }
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "maybe") {
      return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
              onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_liked} alt="list like"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() =>
                onBtnClick("rejected", row.candidaterecommendedjobid)
              }
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
          <Col>
            <Button
              size="sm"
              title="accept"
              className="btn-icon"
              color="success"
              onClick={() =>
                onBtnClick("accepted", row.candidaterecommendedjobid)
              }
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "applied") {
      return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
              onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_liked} alt="list like"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() =>
                onBtnClick("rejected", row.candidaterecommendedjobid)
              }
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "interview") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
              onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_liked} alt="list like"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() =>
                onBtnClick("rejected", row.candidaterecommendedjobid)
              }
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
          <Col>
            <Button
              size="sm"
              title="accept"
              className="btn-icon"
              color="success"
              onClick={() =>
                onBtnClick("accepted", row.candidaterecommendedjobid)
              }
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "accepted") {
      return (
        <Row xs={1} sm={1} md={1} lg={1} xl={1} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() =>
                onBtnClick("rejected", row.candidaterecommendedjobid)
              }
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "rejected") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          </Col>
          <Col>
            <Button
              size="sm"
              title="accept"
              className="btn-icon"
              color="success"
              onClick={() =>
                onBtnClick("accepted", row.candidaterecommendedjobid)
              }
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
        </Row>
      );
    }
  };

  const renderMenu = (row) => {
    return (
      <div className="d-block w-100 text-center">
        <UncontrolledButtonDropdown className="menu-ellipses" direction="start">
          <DropdownToggle
            className="btn-icon btn-icon-only btn btn-link"
            color="link"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </DropdownToggle>
          <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
            <DropdownItem onClick={() => onShowModal(row, "jd")}>
              <i className="dropdown-icon lnr-layers"></i>
              <span>Job details</span>
            </DropdownItem>

            {row.customerscheduleddatetime ? (
              <DropdownItem onClick={() => onShowModal(row, "id")}>
                <i className="dropdown-icon lnr-license"> </i>
                <span>Interview details</span>
              </DropdownItem>
            ) : (
              <></>
            )}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };

  const columns = memoize((clickHandler) => [
    {
      name: <span className="table-title">Job Id</span>,
      id: "Job Id",
      selector: (row) => (
        <span className="table-cell" title={row.jobid}>
          {row.jobid}
        </span>
      ),
      sortable: true,
      maxWidth: "150px",
      minWidth: "100px",
    },
    {
      name: <span className="table-title">Title</span>,
      id: "Title",
      selector: (row) => (
        <span className="table-cell" title={row.jobtitle}>
          {row.jobtitle}
        </span>
      ),
      sortable: true,
      maxWidth: "220px",
      minWidth: "150px",
    },

    {
      name: <span className="table-title">Location</span>,
      selector: (row) => (
        <span className="table-cell" title={row.locationaddress}>
          {row.locationaddress}
        </span>
      ),
      sortable: true,
      maxWidth: "350px",
      minWidth: "250px",
    },

    {
      name: <span className="table-title">Experience</span>,
      selector: (row) => (
        <span
          className="table-cell"
          title={
            row?.jobExperienceScheduleDtos &&
            row?.jobExperienceScheduleDtos[0]?.experiencelevel
              ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
              : "-"
          }
        >
          <>
            {row?.jobExperienceScheduleDtos &&
            row?.jobExperienceScheduleDtos[0]?.experiencelevel
              ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
              : "-"}
          </>
        </span>
      ),
      sortable: true,
      maxWidth: "250px",
      minWidth: "150px",
    },

    {
      name: <span className="table-title">Interest</span>,
      cell: (row) => <div className="list-btn-group">{renderButtons(row)}</div>,
      ignoreRowClick: true,
      button: true,
      maxWidth: "350px",
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Action</span>,
      cell: (row) => <>{renderMenu(row)}</>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "150px",
      minWidth: "100px",
    },
  ]);

  const handleButtonClick = () => {
    console.log("clicked");
  };

  const handleRowClick = (data) => {
    console.log(data);
  };

  return (
    <>
      <DataTable
        onRowClicked={handleRowClick}
        data={props.data}
        columns={columns(handleButtonClick)}
        selectableRows
        persistTableHead
        // pagination
        className="cust-list-view"
      />
    </>
  );
};
