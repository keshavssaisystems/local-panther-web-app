import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Col,
  Row,
  FormGroup,
  InputGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import { getCustReportMatchedCandList } from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import Loader from "react-loaders";
const columns = [
  {
    name: "Candidate Id",
    selector: (row) => row.candidateid,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.candidatename,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
  },
  {
    name: "Skills",
    selector: (row) => row.skills,
    sortable: true,
  },
  {
    name: "Education",
    selector: (row) => row.education,
    sortable: true,
  },
  {
    name: "Experience",
    selector: (row) => row.experience,
    sortable: true,
  },
  {
    name: "Location",
    selector: (row) => row.location,
    sortable: true,
  },
  {
    name: "Certifications",
    selector: (row) => row.certifications,
    sortable: true,
  },
];

export function CustomerReportMatchedCandidate() {
  const dispatch = useDispatch();

  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [candidateId, setCandidateId] = useState();
  useEffect(() => {
    onGetCustReportMatchedCandList({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matchedCandidateList = useSelector(
    (state) => state?.customerReportReducer?.matchedCandidateList
  );
  const loading = useSelector((state) => state?.customerReportReducer?.loading);

  const onGetCustReportMatchedCandList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };

    dispatch(getCustReportMatchedCandList(data));
  };

  const onSubmitHandler = () => {
    onGetCustReportMatchedCandList(filter);
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setCandidateId("");
    onGetCustReportMatchedCandList({});
  };

  return (
    <>
      <PageTitle
        heading={"Customer Matched Candidate List by Job Report"}
        icon={titlelogo}
      />
      <Row>
        <Col md="12" lg="12" xl="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                Filter by
              </div>
              <div className="btn-actions-pane-right actions-icon-btn">
                <UncontrolledButtonDropdown>
                  <DropdownToggle
                    className="btn-icon btn-icon-only"
                    color="link"
                  >
                    <i className="pe-7s-menu btn-icon-wrapper" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem header>Download Report</DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-arrow-down-circle"> </i>
                      <span>Excel</span>
                    </DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-arrow-down-circle"> </i>
                      <span>pdf</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    {/* <Label for="jobid">Job Id</Label> */}
                    <Input
                      name="candidateid"
                      id="candidateid"
                      placeholder="Candidate Id"
                      value={candidateId}
                      onChange={(e) => {
                        handleChange("candidateid", e.target.value);
                        setCandidateId(e.target.value);
                      }}
                    />
                  </FormGroup>
                </Col>

                <Col lg="3" md="3" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <ButtonGroup>
                        <Button
                          style={{ background: "rgb(47 71 155)" }}
                          className="btn-square btn btn-primary me-4"
                          type="button"
                          onClick={() => onSubmitHandler()}
                        >
                          <FontAwesomeIcon icon={faSearch} /> Search
                        </Button>
                        <Button
                          style={{ background: "rgb(47 71 155)" }}
                          className="btn-square btn btn-primary"
                          type="button"
                          onClick={() => onSubmitClear()}
                        >
                          Clear
                        </Button>
                      </ButtonGroup>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mt-1">
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <DataTable
                    columns={columns}
                    data={matchedCandidateList}
                    fixedHeader
                    pagination
                  />
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
