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
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,
  IoIosMail,
  IoIosContact,
  IoIosBriefcase,
  IoIosStar,
  IoIosAlbums,
  IoIosTime,
} from "react-icons/io";

export const CandidateListView = (props) => {
  const columns = memoize((clickHandler) => [
    {
      name: "Profile",
      selector: (row) => row.primaryskills,
      sortable: true,
    },
    {
      name: "Name",
      id: "Name",
      selector: (row) => row.firstname + " " + row.lastname,
      sortable: true,
    },
    {
      name: "Experience",
      selector: (row) => row.experienceyears,
      sortable: true,
    },
    {
      name: "Skills",
      selector: (row) => row.secondaryskills,
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
              <Button title="accept" className=" btn-icon" color="primary">
                <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
              </Button>
            </Col>
            <Col>
              <Button title="reject" className="btn-icon" color="primary">
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
                <i className="dropdown-icon lnr-license"> </i>
                <span>Schedule interview</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-layers">\ </i>
                <span>Profile</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-trash">\ </i>
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

  const data = [
    {
      candidate: "Ajay Singh",
      skills: "Java, Mysql, Sql",
      experience: "5+ Yearas",
      scheduled: "25/09/2023 3:30 PM",
      mode: "Telephonic",
    },
    {
      candidate: "Rao Singh",
      skills: "Java, Sql",
      experience: "2+ Years",
      scheduled: "25/09/2023 2:00 PM",
      mode: "Video",
    },
    {
      candidate: "Ajit Yadav",
      skills: "Java, Mysql",
      experience: "3+ Years",
      scheduled: "25/09/2023 01:00 PM",
      mode: "Telephonic",
    },
    {
      candidate: "Abhay Singh",
      skills: "Java, Mysql",
      experience: "1+ Year",
      scheduled: "25/09/2023 12:00 PM",
      mode: "Video",
    },
  ];

  const handleButtonClick = () => {
    console.log("clicked");
  };

  const handleRowClick = (data) => {};
  return (
    <>
      <DataTable
        onRowClicked={handleRowClick}
        data={props.data}
        columns={columns(handleButtonClick)}
        selectableRows
        persistTableHead
        pagination
      />
    </>
  );
};
