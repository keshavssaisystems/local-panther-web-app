import React, { useState, useEffect } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  CardHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Col,
} from "reactstrap";
import { useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { formatDate } from "_helpers/helper";
import { candidateListActions, custJobListActions } from "_store";
import { useDispatch } from "react-redux";
import jobsIcon from "../../../assets/utils/images/latest-job.svg";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { CandJobDetail } from "../list/candjobcard";
import Loader from "react-loaders";
import { NoDataFound } from "_components/common/nodatafound";

export function JobsList(props) {
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  let candidateId = JSON.parse(
    localStorage.getItem("userDetails")
  ).InternalUserId;
  const candidateJobList = useSelector(
    (state) => state.candidateListReducer.candidateJobList
  );
  const totalRecords = useSelector(
    (state) => state.candidateListReducer.totalRecords
  );

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const loader = useSelector((state) => state.candidateListReducer.loading);

  const [selected, setSelected] = useState([]);
  const [openJob, setOpenJob] = useState(false);

  const columns = [
    {
      name: "Job title",
      selector: (row) => <span title={row.jobtitle}>{row.jobtitle}</span>,
      sortable: false,
    },
    {
      name: "Job location",
      selector: (row) => (
        <span
          title={
            (row?.cityname ? `${row?.cityname}, ` : "") +
            "" +
            (row.statename
              ? row.recommendedationCandidateShortList[0].statename
              : "")
          }
        >
          {(row?.cityname ? `${row?.cityname}, ` : "") +
            "" +
            (row.statename
              ? row.recommendedationCandidateShortList[0].statename
              : "")}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Company",
      selector: (row) => <span title={row.companyname}>{row.companyname}</span>,
      sortable: false,
    },
    {
      name: "Updated date",
      selector: (row) => (
        <span title={formatDate(row.jobcreatedatetime)}>
          {formatDate(row.jobcreatedatetime)}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Actions",
      cell: (row) => <>{renderMenu(row)}</>,
      sortable: false,
      ignoreRowClick: true,
      button: true,
    },
  ];

  const handlePageChange = (page) => {
    setSelected([]);
    setPageNo(page);
    let candObj = {
      isCandidate: true,
      candidateId,
      pageNumber: page,
      pageSize: 5,
    };

    dispatch(candidateListActions.getRecommendedJobList(candObj));
  };

  const renderMenu = (row) => {
    return (
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
              <span onClick={() => navigateToJobs(row)}>Job details</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };
  const navigateToJobs = async function (data) {
    let new_data = [...selected];
    let response = await dispatch(
      custJobListActions.getJobDetail({ jobId: data.jobid })
    );

    if (response.payload) {
      new_data.push(response.payload.data);
    } else {
      new_data.push(data);
    }

    setSelected(new_data);
    setOpenJob(true);
  };
  const renderPaginationItems = () => {
    const items = [];

    for (let page = 1; page <= Math.round(totalRecords / 5); page++) {
      if (page <= 3 || page > Math.round(totalRecords / 5) - 3) {
        items.push(
          <PaginationItem
            className="middle-page"
            key={page}
            active={pageNo === page}
          >
            <PaginationLink onClick={() => handlePageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const close = function () {
    setSelected([]);
    setOpenJob(false);
    props.onCallBack();
  };

  const onApplyClickBtn = () => {
    let rec = candidateJobList.find((data) => data.jobid === selected[0].jobid);
    if (rec?.candidaterecommendedjobid) {
      onCandidateCardActions("applied", rec?.candidaterecommendedjobid);
    }
  };

  const onCandidateCardActions = async (type, candidaterecommendedjobid) => {
    if (type === "applied") {
      let res = await dispatch(
        candidateListActions.candidateApply(candidaterecommendedjobid)
      );
      setOpenJob(false);
      if (res.payload.statusCode === 204) {
        showSweetAlert({ title: res.payload.message, type: "success" });
      } else {
        showSweetAlert({
          title: res.payload.message || res.payload.status,
          type: "danger",
        });
      }
      close();
    }
  };

  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    setSelected([]);
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };

  return (
    <>
      <Card className="card-hover-shadow-2x mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-md text-capitalize fw-bold">
            <img src={jobsIcon} alt="jobs-img" className="me-2" />
            Latest matched jobs
          </div>
        </CardHeader>
        {!loader ? (
          <div className="scroll-area-md">
            {candidateJobList?.length > 0 ? (
              <DataTable
                data={candidateJobList ? candidateJobList : []}
                columns={columns}
                fixedHeader
                fixedHeaderScrollHeight="390px"
              />
            ) : (
              <Row style={{ textAlign: "center" }}>
                <Col>
                  {" "}
                  <NoDataFound imageSize={"25px"} />
                </Col>
              </Row>
            )}
          </div>
        ) : (
          <div className=" d-flex justify-content-center align-items-center loader">
            <Loader active={loader} type="line-scale-pulse-out-rapid" />
          </div>
        )}
        {totalRecords > 0 ? (
          <div className="mt-2">
            {totalRecords > 5 ? (
              <Pagination className="float-end pagination-cont me-2">
                <PaginationItem disabled={pageNo === 1}>
                  <PaginationLink
                    previous
                    onClick={() => handlePageChange(pageNo + 1)}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem disabled={pageNo === totalRecords / 5}>
                  <PaginationLink
                    next
                    onClick={() => handlePageChange(pageNo + 1)}
                  />
                </PaginationItem>
              </Pagination>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </Card>

      {openJob ? (
        <Modal isOpen={openJob} size="lg">
          <ModalHeader toggle={() => close()} charCode="Y">
            <strong className="card-title-text">Job Details</strong>
          </ModalHeader>
          <ModalBody>
            <CandJobDetail
              jobDetails={selected}
              type={"Open"}
              onApplyClick={() => onApplyClickBtn()}
            ></CandJobDetail>
          </ModalBody>
        </Modal>
      ) : (
        <></>
      )}

      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
    </>
  );
}
