import { useEffect, useState } from "react";
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
  getCustReportJobAgingList,
  getJobDropdown,
  getCustReportJobDetail,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import Loader from "react-loaders";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import "./customerreport.scss";

export function CustomerReportJobAging() {
  const dispatch = useDispatch();

  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [jobId, setJobId] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showJDModal, setShowJDModal] = useState(false);
  const jobAgingList = useSelector(
    (state) => state?.customerReportReducer?.jobAgingList
  );

  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDetail = useSelector(
    (state) => state?.customerReportReducer?.jobDetail
  );
  const jobDropDownList = useSelector(
    (state) => state?.customerReportReducer?.jobDropDownList
  );
  useEffect(() => {
    onGetCustReportJobAgingList({});
    dispatch(getJobDropdown());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (jobAgingList?.length > 0) {
      let filteredData = jobAgingList.map((data) => {
        return {
          "Job Code": data.jobid,
          Title: data.jobtitle,
          Status: data.jobstatus,
          "No. of Days": data.noofdays,
          "Aging group": data.aginggroup,
        };
      });
      setExcelData([
        {
          sheetName: "JobAging",
          details: filteredData,
        },
      ]);
    }
  }, [jobAgingList]);

  const onGetCustReportJobAgingList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };
    dispatch(getCustReportJobAgingList(data));
  };

  const onSubmitHandler = () => {
    onGetCustReportJobAgingList(filter);
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setJobId("");
    onGetCustReportJobAgingList({});
  };

  const openJobDetails = async (jobId) => {
    let res = await dispatch(getCustReportJobDetail(jobId));

    if (res?.payload?.statusCode === 200) {
      setShowJDModal(true);
    }
  };

  const columns = [
    {
      name: <span className="table-title">Job Code</span>,
      selector: (row) => row.jobid,
      cell: (row) => (
        <span className="table-cell" title={row.jobid}>
          {row.jobid}
        </span>
      ),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: <span className="table-title">Title</span>,
      selector: (row) => row.jobtitle,
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
      minWidth: "350px",
    },
    {
      name: <span className="table-title">Status</span>,
      selector: (row) => row.jobstatus,
      cell: (row) => (
        <span className="table-cell" title={row.jobstatus}>
          {row.jobstatus}
        </span>
      ),
      sortable: true,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">No. of Days</span>,
      selector: (row) => row.noofdays,
      cell: (row) => (
        <span className="table-cell" title={row.noofdays}>
          {row.noofdays}
        </span>
      ),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: <span className="table-title">Aging group</span>,
      selector: (row) => row.aginggroup,
      cell: (row) => (
        <span className="table-cell" title={row.aginggroup}>
          {row.aginggroup}
        </span>
      ),
      sortable: true,
      minWidth: "350px",
    },
  ];

  return (
    <>
      <PageTitle heading={"Customer Aging Group Report"} icon={titlelogo} />
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
                        exportToExcel(excelData, "customerJobAgingReport", true)
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
                      value={jobId}
                      name="jobid"
                      id="jobid"
                      placeholder="Job Id"
                      onChange={(e) => {
                        handleChange("jobid", e.target.value);
                        setJobId(e.target.value);
                      }}
                    >
                      <option value={""}>Select a Job</option>
                      {jobDropDownList?.length > 0 ? (
                        jobDropDownList.map((data) => (
                          <option value={data.jobid} key={data.jobid}>
                            {data.jobtitle}
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
                    {jobAgingList.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={jobAgingList}
                        fixedHeader
                        pagination
                        className="cust-rep-list-view"
                      />
                    ) : (
                      <Row className="center-align ">
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
