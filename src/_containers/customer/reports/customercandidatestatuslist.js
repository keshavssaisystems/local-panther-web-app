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

import {
  getCustReporCandStatList,
  getRecommendedJobStatus,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import Loader from "react-loaders";
import { updateMonthstoYears, USPhoneNumber } from "_helpers/helper";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";

const columns = [
  // {
  //   name: "Candidate Id",
  //   selector: (row) => row.candidateid,
  //   sortable: true,
  // },
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
    selector: (row) => (row.phone ? USPhoneNumber(row.phone) : ""),
    sortable: true,
  },
  {
    name: "Skills",
    selector: (row) => row.skill,
    sortable: true,
  },
  {
    name: "Education",
    selector: (row) => row.education,
    sortable: true,
  },
  {
    name: "Experience",
    selector: (row) =>
      row.experience > 0 ? updateMonthstoYears(row.experience) : "",
    sortable: true,
  },
  // {
  //   name: "Location",
  //   selector: (row) => row.location,
  //   sortable: true,
  // },
  {
    name: "Certifications",
    selector: (row) => row.certifications,
    sortable: true,
  },
];

export function CustomerReportCandidateStatus() {
  const dispatch = useDispatch();
  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [recommStatusId, setRecommStatusId] = useState();
  const [excelData, setExcelData] = useState([]);

  const candidateStatusList = useSelector(
    (state) => state?.customerReportReducer?.candidateStatusList
  );

  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const recommendedJobStatusList = useSelector(
    (state) => state?.customerReportReducer?.recommendedJobStatusList
  );

  useEffect(() => {
    if (candidateStatusList?.length > 0) {
      let filteredData = candidateStatusList.map((data) => {
        return {
          Name: data.candidatename,
          Email: data.email,
          Phone: data.phone ? USPhoneNumber(data.phone) : "",
          Skills: data?.skill,
          Education: data?.education ? data?.education : "",
          Experience: data.experience,
          Certifications: data.certification,
        };
      });
      setExcelData(filteredData);
    }
  }, [candidateStatusList]);
  useEffect(() => {
    onGetCustReporCandStatList({});
    dispatch(getRecommendedJobStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGetCustReporCandStatList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };

    dispatch(getCustReporCandStatList(data));
  };

  const onSubmitHandler = () => {
    onGetCustReporCandStatList(filter);
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setRecommStatusId("");
    onGetCustReporCandStatList({});
  };

  return (
    <>
      <PageTitle
        heading={"Customer Candidate Status List Report"}
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
                    <DropdownItem
                      onClick={() =>
                        exportToExcel(
                          excelData,
                          "customerCandidateStatusListReport"
                        )
                      }
                    >
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
                    <Input
                      type="select"
                      value={recommStatusId}
                      name="customerrecommendedjobstatusid"
                      id="customerrecommendedjobstatusid"
                      placeholder="Recommended Status Id"
                      onChange={(e) => {
                        handleChange(
                          "customerrecommendedjobstatusid",
                          e.target.value
                        );
                        setRecommStatusId(e.target.value);
                      }}
                    >
                      <option value={""}>Matched</option>
                      {recommendedJobStatusList?.length > 0 ? (
                        recommendedJobStatusList.map((data) => (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Input>
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
                  <>
                    {candidateStatusList.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={candidateStatusList}
                        fixedHeader
                        pagination
                      />
                    ) : (
                      <Row className="center-align">
                        <NoDataFound></NoDataFound>
                      </Row>
                    )}
                  </>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
