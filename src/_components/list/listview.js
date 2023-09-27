import React from "react";
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
import { IoIosCheckmark, IoIosClose, IoIosThumbsUp, IoIosHelp } from "react-icons/io";
import "./listview.scss"

export const CandidateListView = (props) => {


  const columns = memoize((clickHandler) => [
    {
      name: "Customer",
      id: "Customer",
      selector: (row) => row.firstname + " " + row.lastname,
      sortable: true,
    },
    {
      name: "Skills",
      selector: (row) => row.primaryskills + "," + row.secondaryskills,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.address,
      sortable: true,
    },

    {
      name: "Experience",
      selector: (row) => row.experienceyears,
      sortable: true,
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Interest",
      width: "170px",
      cell: () => (
        <div>
          <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
            <Col>
              <Button title="accept" className=" btn-icon " color="success">
                <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
              </Button>
            </Col>
            <Col>
              <Button title="reject" className="btn-icon" color="danger">
                <IoIosClose fontSize={"24px"}></IoIosClose>
              </Button>
            </Col>
            <Col>
              <Button title="liked" className=" btn-icon" color="primary">
                <IoIosThumbsUp fontSize={"24px"}></IoIosThumbsUp>
              </Button>
            </Col>
          </Row>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
    },
    {
      name: "Action",
      cell: () => (
        <div className="d-block w-100 text-center">
          <UncontrolledButtonDropdown direction="start">
            <DropdownToggle
              className="btn-icon btn-icon-only btn btn-link"
              color="link"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </DropdownToggle>
            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
              <DropdownItem>
                <i className="dropdown-icon lnr-layers"></i>
                <span>Profile</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-license"> </i>
                <span>Schedule interview</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-license"> </i>
                <span>Interview details</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-trash"></i>
                <span>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  const columnsForCustomView = memoize((clickHandler) => [{
    name: "Job ID",
    id: "Candidate",
    selector: (row) => row.jobapplicationid,
    sortable: true,
  },
  {
    name: "Title",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row) => row.description,
    sortable: true,
  },

  {
    name: "Location",
    selector: (row) => row.address,
    sortable: true,
  },

  {
    name: "Experience",
    selector: (row) => row.experienceyears,
    sortable: true,
  },

  {
    name: "Interest",
    width: "170px",
    cell: () => (
      <div>
        <Row xs={5} sm={5} md={5} lg={5} xl={5} className="candidate-listview-tab">

          <Col>
            <Button title="accept" className="btn-icon" color="success">
              <IoIosCheckmark fontSize={"20px"} className=""></IoIosCheckmark>
            </Button>
          </Col>
          <Col>
            <Button title="liked" className=" btn-icon" color="primary">
              <IoIosHelp fontSize={"20px"}></IoIosHelp>
            </Button>
          </Col>
          <Col>
            <Button title="reject" className="btn-icon" color="danger">
              <IoIosClose fontSize={"20px"}></IoIosClose>
            </Button>
          </Col>

          <Col>
            <Button title="liked" className=" btn-icon" color="primary">
              <IoIosThumbsUp fontSize={"20px"}></IoIosThumbsUp>
            </Button>
          </Col>
        </Row>
      </div>
    ),
    ignoreRowClick: true,
    button: true,
  },
  {
    name: "Action",
    cell: () => (
      <div className="d-block w-100 text-center">
        <UncontrolledButtonDropdown direction="start">
          <DropdownToggle
            className="btn-icon btn-icon-only btn btn-link"
            color="link"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </DropdownToggle>
          <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
            <DropdownItem>
              <i className="dropdown-icon lnr-layers"></i>
              <span>View interview details</span>
            </DropdownItem>
           
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
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
        columns={props.type === "Customer" ? columns(handleButtonClick) : columnsForCustomView(handleButtonClick)}
        selectableRows
        persistTableHead
        pagination
      />
    </>
  );
};
