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
} from "reactstrap";
import { useSelector } from "react-redux";
import { formatDate } from "_helpers/helper";
import { history } from "_helpers";
import { candidateListActions } from "_store";
import { useDispatch } from "react-redux";
import jobsIcon from "../../../assets/utils/images/latest-job.svg";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { CandJobDetail } from "../list/candjobcard";

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
        <span title={row.locationaddress}>{row.locationaddress}</span>
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
    setPageNo(page);
    let candObj = {
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
  const navigateToJobs = function (data) {
    //history.navigate("/job-list");
    debugger;
    let new_data = [...selected];
    new_data.push(data);
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
    setOpenJob(false);
    props.onCallBack();
  };

  const onApplyClickBtn = () => {};

  return (
    <>
      <Card className="card-hover-shadow-2x mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-md text-capitalize fw-bold">
            <img src={jobsIcon} alt="jobs-img" className="me-2" />
            Latest jobs
          </div>
        </CardHeader>
        <div className="scroll-area-md">
          <DataTable
            data={candidateJobList ? candidateJobList : []}
            columns={columns}
            fixedHeader
            fixedHeaderScrollHeight="390px"
          />
          {/* <PerfectScrollbar>
            <Table
              responsive
              hover
              striped
              borderless
              className="align-middle mb-0"
            >
              <thead>
                <tr>
                  <th>Job title</th>
                  <th>Job location</th>
                  <th>Company</th>
                  <th>Updated date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {candidateJobList?.map((col) => (
                  <tr>
                    <td>{col.jobtitle}</td>

                    <td>{col.locationaddress}</td>
                    <td>{col.companyname}</td>
                    <td>{formatDate(col.jobcreatedatetime)}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </PerfectScrollbar> */}
        </div>
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
    </>
  );
}
