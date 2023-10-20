import { useEffect, useState } from "react";
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
  getCustReportJobAgingList,
  getJobDropdown,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import Loader from "react-loaders";
import { exportToExcel } from "react-json-to-excel";

const columns = [
  {
    name: "Job Code",
    selector: (row) => row.jobid,
    sortable: true,
  },
  {
    name: "Title",
    selector: (row) => row.jobtitle,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.jobstatus,
    sortable: true,
  },
  {
    name: "No. of Days",
    selector: (row) => row.noofdays,
    sortable: true,
  },
  {
    name: "Aging group",
    selector: (row) => row.aginggroup,
    sortable: true,
  },
];

export function CustomerReportJobAging() {
  const dispatch = useDispatch();

  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [jobId, setJobId] = useState();
  const [excelData, setExcelData] = useState([]);

  const jobAgingList = useSelector(
    (state) => state?.customerReportReducer?.jobAgingList
  );

  const loading = useSelector((state) => state?.customerReportReducer?.loading);
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
      setExcelData(filteredData);
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
                        exportToExcel(excelData, "customerJobAgingReport")
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
                    data={jobAgingList}
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
