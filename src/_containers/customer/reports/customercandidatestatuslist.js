import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Col,
  Row,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileExcel } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import {
  getCustReporCandStatList,
  getRecommendedJobStatus,
  getCustReportJobDetail,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import Loader from "react-loaders";
import { updateMonthstoYears, USPhoneNumber } from "_helpers/helper";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import { getProfileActions } from "_store";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import "./customerreport.scss";

export function CustomerReportCandidateStatus() {
  const dispatch = useDispatch();
  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [recommStatusId, setRecommStatusId] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJDModal, setShowJDModal] = useState(false);
  const candidateStatusList = useSelector(
    (state) => state?.customerReportReducer?.candidateStatusList
  );

  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDetail = useSelector(
    (state) => state?.customerReportReducer?.jobDetail
  );
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
      setExcelData([
        {
          sheetName: "CandidateListByStatus",
          details: filteredData,
        },
      ]);
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

  const onCandidateClick = async (candidateId) => {
    const response = await dispatch(
      getProfileActions.getCandidate(candidateId)
    );
    if (response?.payload) {
      setShowProfileModal(true);
    }
  };

  const openJobDetails = async (jobId) => {
    let res = await dispatch(getCustReportJobDetail(jobId));

    if (res?.payload?.statusCode === 200) {
      setShowJDModal(true);
    }
  };

  const columns = [
    // {
    //   name: "Candidate Id",
    //   selector: (row) => row.candidateid,
    //   sortable: true,
    // },
    {
      name: <span className="table-title">Name</span>,

      selector: (row) => row.candidatename,
      cell: (row) => (
        <span className="table-cell" title={row.candidatename}>
          <Button
            color="link"
            onClick={() => onCandidateClick(row.candidateid)}
          >
            {" "}
            {row.candidatename}
          </Button>
        </span>
      ),
      sortable: true,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Title</span>,
      cell: (row) => (
        <span className="table-cell" title={row.jobtitle}>
          <Button
            className="no-padding"
            color="link"
            onClick={() => openJobDetails(row.jobid)}
          >
            {row.jobtitle}
          </Button>
        </span>
      ),
      sortable: true,
      selector: (row) => row.jobtitle,
      minWidth: "400px",
    },
    {
      name: <span className="table-title">Email</span>,
      selector: (row) => row.email,
      cell: (row) => (
        <span className="table-cell" title={row.email}>
          {row.email}
        </span>
      ),
      sortable: true,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Phone</span>,
      selector: (row) => row.phone,
      cell: (row) => (
        <span
          className="table-cell"
          title={row.phone ? USPhoneNumber(row.phone) : ""}
        >
          {row.phone ? USPhoneNumber(row.phone) : ""}
        </span>
      ),
      sortable: true,
      minWidth: "180px",
    },
    {
      name: <span className="table-title">Skills</span>,
      selector: (row) => row.skill,
      cell: (row) => (
        <span className="table-cell" title={row?.skill}>
          {row?.skill}
        </span>
      ),
      sortable: true,
      minWidth: "400px",
    },
    {
      name: <span className="table-title">Education</span>,
      selector: (row) => row.education,
      cell: (row) => (
        <span className="table-cell" title={row.education}>
          {row.education}
        </span>
      ),
      sortable: true,
      minWidth: "400px",
    },
    {
      name: <span className="table-title">Experience</span>,
      selector: (row) => row.experience,
      cell: (row) => (
        <span
          className="table-cell"
          title={row.experience > 0 ? updateMonthstoYears(row.experience) : ""}
        >
          {row.experience > 0 ? updateMonthstoYears(row.experience) : ""}
        </span>
      ),
      sortable: true,
      minWidth: "200px",
    },
    // {
    //   name: "Location",
    //   selector: (row) => row.location,
    //   sortable: true,
    // },
    {
      name: <span className="table-title">Certifications</span>,
      selector: (row) => row.certifications,
      cell: (row) => row.certifications,
      sortable: true,
      minWidth: "200px",
    },
  ];

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
                          "customerCandidateStatusListReport",
                          true
                        )
                      }
                    >
                      <FontAwesomeIcon className="pe-2" icon={faFileExcel} />
                      <span>Excel</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="4" sm="12" sx="12">
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

                <Col lg="3" md="4" sm="12" sx="12">
                  <Button
                    style={{ background: "rgb(47 71 155)" }}
                    className="me-4"
                    color="primary"
                    type="button"
                    onClick={() => onSubmitHandler()}
                  >
                    <FontAwesomeIcon icon={faSearch} /> Search
                  </Button>
                  <Button
                    // style={{ background: "rgb(47 71 155)" }}
                    color="link"
                    type="button"
                    onClick={() => onSubmitClear()}
                  >
                    Clear
                  </Button>
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
                        className="cust-rep-list-view"
                        sortable
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
      <>
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {" "}
        {showJDModal && jobDetail?.length > 0 ? (
          <CustJobDetailModal
            isOpen={showJDModal}
            data={jobDetail}
            onClose={() => setShowJDModal(false)}
            isAdmin={true}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
}
