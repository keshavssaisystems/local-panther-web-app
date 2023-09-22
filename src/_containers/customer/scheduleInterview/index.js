import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import memoize from 'memoize-one';
import classnames from "classnames";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  CardHeader,
  Card,
  CardBody,
  CardTitle,

  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { BsPuzzle } from "react-icons/bs";

import { InterviewDetail } from "./interviewDetail";
import { ScheduleInterviewModal } from "./scheduleInterviewModal";

const customStyles = {
  headRow: {
    style: {
      borderTopWidth: '0px',
    },
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightWidth: '0px',
      },
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightWidth: '0px',
        cursor: 'pointer'
      },
    },
  },
};

export function ScheduleInterview() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [state, setState] = useState({
    activeTab: "1",
    transform: true,
    isDetailPage: false,
  });

  const toggle = (tab) => {
    if (state.activeTab !== tab) {
      setState({
        activeTab: tab,
      });
    }
  }
  const [showPopup, setShowPopup] = useState(false);

  const columns = memoize(clickHandler => [

    {
      name: "Candidate",
      selector: row => row.candidate,
      sortable: true,
    },
    {
      name: "Skills",
      id: "skills",
      selector: row => row.skills,
      sortable: true,
    },
    {
      name: "Experience",
      selector: row => row.experience,
      sortable: true,
    },
    {
      name: "Scheduled time",
      selector: row => row.scheduled,
      sortable: true,
    },
    {
      name: "Mode",
      selector: row => row.mode,
      sortable: true,
    },
    {
      name: "Action",
      cell: () => (
        <div className="d-block w-100 text-center">
          <UncontrolledButtonDropdown direction="start">
            <DropdownToggle className="btn-icon btn-icon-only btn btn-link" color="link">
              <FontAwesomeIcon icon={faEllipsisV}/>
            </DropdownToggle>
            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
              <DropdownItem onClick={() => setOpenModal(true)}>
                <i className="dropdown-icon lnr-license"> {" "} </i>
                <span>Schedule interview</span>
              </DropdownItem>
              {/* <DropdownItem>
                <i className="dropdown-icon lnr-enter"> {" "} </i>
                <span>Interview detail</span>
              </DropdownItem> */}
              <DropdownItem>
                <i className="dropdown-icon lnr-layers">\ {" "} </i>
                <span>Candidate detail</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-trash">\ {" "} </i>
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

  const data = [{
    candidate: 'Ajay Singh',
    skills: 'Java, Mysql, Sql',
    experience: '5+ Yearas',
    scheduled: '25/09/2023 3:30 PM',
    mode: 'Telephonic'
  }, {
    candidate: 'Rao Singh',
    skills: 'Java, Sql',
    experience: '2+ Years',
    scheduled: '25/09/2023 2:00 PM',
    mode: 'Video'
  }, {
    candidate: 'Ajit Yadav',
    skills: 'Java, Mysql',
    experience: '3+ Years',
    scheduled: '25/09/2023 01:00 PM',
    mode: 'Telephonic'
  }, {
    candidate: 'Abhay Singh',
    skills: 'Java, Mysql',
    experience: '1+ Year',
    scheduled: '25/09/2023 12:00 PM',
    mode: 'Video'
  }]

  const handleButtonClick = () => {
		console.log('clicked');
	};

  const handleRowClick = (data) => {
    // console.log('e :>> ', data);
    setState({ isDetailPage: true })
  }
 
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle className="mb-0">
                {" "}
                <span className="icon-box">
                  <BsPuzzle style={{ transform: "rotate(90deg)" }} />
                </span>{" "}
                  Schedule interview
              </CardTitle>
            </CardBody>
          </Card>
        </Col>

        {!state?.isDetailPage ? <Col md="12">
          <Row>
            <Col md="12">
              <Card className="mb-3">
                <CardHeader>
                  <Nav justified>
                    <NavItem className="border-right">
                      <NavLink href="#"
                        className={classnames({
                          active: state.activeTab === "1",
                        })}
                        onClick={() => {
                          toggle("1");
                        }}>
                        Availability
                      </NavLink>
                    </NavItem>

                    <NavItem className="border-right">
                      <NavLink href="#"
                        className={classnames({
                          active: state.activeTab === "2",
                        })}
                        onClick={() => {
                          toggle("2");
                        }}>
                        Upcoming
                      </NavLink>
                    </NavItem>

                    <NavItem className="border-right">
                      <NavLink href="#"
                        className={classnames({
                          active: state.activeTab === "3",
                        })}
                        onClick={() => {
                          toggle("3");
                        }}>
                        Calender
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#"
                        className={classnames({
                          active: state.activeTab === "4",
                        })}
                        onClick={() => {
                          toggle("4");
                        }}>
                        Schedule interview
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody>
                  <TabContent activeTab={state.activeTab}>
                    {/* Availability */}
                    <TabPane tabId="1">
                      <p>
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </p>
                    </TabPane>

                    {/* Upcoming */}
                    <TabPane tabId="2">
                      <p>
                        Like Aldus PageMaker including versions of Lorem. It
                        has survived not only five centuries, but also the
                        leap into electronic typesetting, remaining
                        essentially unchanged.{" "}
                      </p>
                    </TabPane>

                    {/* Calender  */}
                    <TabPane tabId="3">
                      <p>
                        Lorem Ipsum has been the industry's standard dummy
                        text ever since the 1500s, when an unknown printer
                        took a galley of type and scrambled it to make a type
                        specimen book. It has survived not only five
                        centuries, but also the leap into electronic
                        typesetting, remaining essentially unchanged.{" "}
                      </p>
                    </TabPane>
                    
                    {/* Schedule interview */}
                    <TabPane tabId="4">
                      <Row>
                        <Col md="12">
                          <Card className="main-card mb-3">
                            <CardBody>
                              <DataTable 
                                onRowClicked={handleRowClick}
                                columns={columns(handleButtonClick)}
                                data={data}
                                selectableRows
                                persistTableHead
                                customStyles={customStyles}
                              />
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col> : 
          <Col md="12">
            <InterviewDetail />
          </Col>
        }
      </Row>

      <ScheduleInterviewModal 
        isOpen={openModal}
      />
    </>
  );
}
