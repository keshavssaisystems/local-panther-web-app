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
import { analytics } from "../../../firebase/index";
import "./customerreport.scss";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
export function CustomerReportJobAging() {
  const dispatch = useDispatch();

  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [jobId, setJobId] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showJDModal, setShowJDModal] = useState(false);
  const [jobSelected, setJobSelected] = useState(null);
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
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Employer Job aging Report",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    if (jobAgingList?.length > 0) {
      let filteredData = jobAgingList.map((data) => {
        return {
          "Job code": data.jobid,
          Title: data.jobtitle,
          Status: data.jobstatus,
          "No. of days": data.noofdays,
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


  const debouncedFetch = React.useMemo(
    () =>
      debounce((inputValue, callback) => {
        dispatch(getJobDropdown(inputValue)).then((res) => {
          const data = res?.payload?.data || [];
          const options = data.map((j) => ({
            label: j.jobtitle || j.name,
            value: j.jobid || j.id,
            jobid: j.jobid || j.id,
          }));
          callback(options);
        });
      }, 300),
    [dispatch]
  );

  const loadJobOptions = (inputValue) =>
    new Promise((resolve) => debouncedFetch(inputValue, resolve));

  const custJobSelectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: 0 }),
    menu: (base) => ({ ...base, borderRadius: 0 }),
    menuList: (base) => ({ ...base, borderRadius: 0 }),
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      boxShadow: state.isFocused ? base.boxShadow : "none",
      borderRadius: 0,
    }),
    valueContainer: (base) => ({ ...base, height: "38px", padding: "0 8px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, height: "38px" }),
  };

  const onSubmitClear = () => {
    setFilter({});
    setJobId("");
    setJobSelected(null);
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
      name: <span className="table-title">Job code</span>,
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
      name: <span className="table-title">No. of days</span>,
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
      <PageTitle
        heading={"Hiring Manager Aging Group Report"}
        icon={titlelogo}
      />
      <Row className="cust-report-job-cont">
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
                    <DropdownItem header>Download report</DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        exportToExcel(excelData, "customerJobAgingReport", true)
                      }
                    >
                      <FontAwesomeIcon
                        className="pe-2"
                        icon={faFileExcel}
                        style={{ boxSizing: "content-box" }}
                      />
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
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={(jobDropDownList || []).map((j) => ({
                        label: j.jobtitle,
                        value: j.jobid,
                        jobid: j.jobid,
                      }))}
                      loadOptions={loadJobOptions}
                      className="cust-job-autosuggest"
                      classNamePrefix="react-select"
                      placeholder="Search job"
                      onChange={(selected) => {
                        handleChange("jobid", selected ? selected.jobid : null);
                        setJobId(selected ? selected.jobid : null);
                        setJobSelected(selected);
                      }}
                      value={jobSelected}
                      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      styles={custJobSelectStyles}
                    />
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
