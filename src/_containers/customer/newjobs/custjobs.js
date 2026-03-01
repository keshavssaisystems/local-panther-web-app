import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { custJobListActions, createjobActions, dropdownActions } from "_store";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { custListPageSize } from "_helpers/constants";
import { AssignJobsModal } from "./AssignJobsModal";
import { CardPagination } from "_components/common/cardpagination";
import { CustJobCard } from "./custjobcard";
import { CustJobDetail } from "./custjobdetails";
import { CustJobListView } from "./custJobListView";
import Loader from "react-loaders";
import { CustJobFilter } from "./custjofilter";
import { NoDataFound } from "_components/common/nodatafound";
import moment from "moment/moment";
import { analytics } from "../../../firebase/index";
import { CommonFilters } from "../../../_components/common/commonFilters";
import { setJobStatus, setHiringManagerId, setSearchText } from "_store/commonCustFiltersSlice";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import { FaThLarge, FaList } from "react-icons/fa";
import  titlelist from "../../../assets/utils/images/customer/tilelist.svg";
import titleblock from "../../../assets/utils/images/customer/tileblock.svg";

export default function CustJobList() {
  const [page, setPage] = useState(1);
  const [viewType, setViewType] = useState("block");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  // const [placeHolder, setPlaceHolder] = useState("Search job title");
  // const [selectedOpt, setSelectedOpt] = useState("JobTitle");
  // const [searchText, setSearchText] = useState("");
  // const [jobStatus, setJobStatus] = useState("");
  // const [hiringManagerId, setHiringMangerId] = useState("");


  const userId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyid");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const dispatch = useDispatch();
  const getCompanyDetails = async function () {
    await dispatch(
      createjobActions.getCustomerDetailsThunk(
        userDetails?.InternalUserId
      )
    );
  };
  const getJobList = async function (filterObj) {
    await dispatch(custJobListActions.getJobList(filterObj));
  };
  const jobList = useSelector((state) => state.custJobListReducer.jobList);
  const totalRows = useSelector((state) => state.custJobListReducer.totalRows);
  const jdLoading = useSelector((state) => state.custJobListReducer.jdLoading);
  const loading = useSelector((state) => state.custJobListReducer.loading);
  const jobDetail = useSelector((state) => state.custJobListReducer.jobDetail);

  let current = Number(totalRows) / custListPageSize;
  if (current * custListPageSize !== totalRows) {
    current++;
  }

  const { selectedOpt, searchText, jobStatus, hiringManagerId } = useSelector(
    (state) => state.commonCustFilters
  );

  const hiringManagers = useSelector(
    (state) => state?.customerReportReducer?.hiringmangers || []
  );

  useEffect(() => {
    dispatch(createjobActions.getCustomerDetailsThunk(userDetails?.InternalUserId));
    dispatch(dropdownActions.getCloseJobReasonListThunk());
  }, [dispatch])

  useEffect(() => {
    dispatch(custJobListActions.clearJobList());

    // dispatch(dropdownActions.getCloseJobReasonListThunk());
    if (userId) {
      const filterObj = {
        pageSize: custListPageSize,
        pageNumber: 1,
        searchText: searchText ?? "",
        companyId: companyId,
        searchType: selectedOpt,
        jobStatus: jobStatus,
        hiringManagerId: hiringManagerId || userId,
      };
      dispatch(custJobListActions.getJobList(filterObj));
    }
  }, [jobStatus, hiringManagerId]);

  // useEffect(() => {
  //   //setHiringMangerId(localStorage.getItem("userId"));
  //   getCompanyDetails();
  //   onPageChange(page);
  //   if (analytics) {
  //     analytics.logEvent("page_visit", {
  //       page_title: "New Jobs",
  //       page_location: window.location.pathname,
  //       page_path: window.location.pathname,
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (jobList.length > 0) {
      dispatch(custJobListActions.getJobDetail({ jobId: jobList[0].jobid }));

    }
  }, [jobList, dispatch]);

  const onPageChange = (page) => {
    let filterOnPageChange = {
      pageSize: custListPageSize,
      pageNumber: page,
      searchText: searchText ?? "",
      companyId: companyId,
      searchType: selectedOpt,
      jobStatus: jobStatus,
      hiringManagerId: hiringManagerId,
    };
    getJobList(filterOnPageChange);
  };

  const onSearchData = () => {
    setPage(1);
    onPageChange(1);
  };

  const handlePageChange = (page) => {
    setPage(page);
    onPageChange(page);
  };

  const getSelectedJob = (e) => {
    dispatch(custJobListActions.getJobDetail({ jobId: e }));
  };

  const publishNewJob = async function (event) {
    let jobId = event;
    let payload = {
      currentUserId: userId,
    };
    let res = await dispatch(createjobActions.getPublishJobThunk({ jobId, payload }));

    if (res?.payload) {
      dispatch(showSnackbar({
        message: "Success.",
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 2000,
        maxWidth: 500,
      }));

      dispatch(
        custJobListActions.publishJob({
          jobList: jobList,
          jobDetail: jobDetail,
          jobId: jobId,
          publisheddate: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
        })
      );
      getSelectedJob(jobId);
    }
    else {
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 2000,
        maxWidth: 500,
      }));
      return;
    }
  };
  const closeJob = (event) => {
    let jobId = event.jobId;
    let payload = {
      closedjobreasonid: event.closedjobreasonid,
      currentUserId: userId,
    };
    dispatch(createjobActions.getCloseJobThunk({ jobId, payload }));
    dispatch(
      custJobListActions.closeJob({
        jobList: jobList,
        jobDetail: jobDetail,
        jobId: jobId,
      })
    );
    getSelectedJob(jobId);
  };

  const onJobStatusChange = (event) => {
    dispatch(setJobStatus(event));
    // setJobStatus(event);
    // let filterOnPageChange = {
    //   pageSize: custListPageSize,
    //   pageNumber: page,
    //   searchText: searchText ?? "",
    //   companyId: localStorage.getItem("companyid"),
    //   searchType: selectedOpt,
    //   jobStatus: event,
    //   hiringManagerId: hiringManagerId
    // };
    // getJobList(filterOnPageChange);
  };

  const onJobHiringMangerChange = (event) => {
    dispatch(setHiringManagerId(event));
    //setHiringMangerId(event);
    // let filterOnPageChange = {
    //   pageSize: custListPageSize,
    //   pageNumber: page,
    //   searchText: searchText ?? "",
    //   companyId: localStorage.getItem("companyid"),
    //   searchType: selectedOpt,
    //   jobStatus: jobStatus,
    //   hiringManagerId: event,
    // };
    // getJobList(filterOnPageChange);
  };

  const handleAssignClick = () => {
    setIsAssignModalOpen(true);
  };

  const handleAssignJobs = async (jobIds, hiringManagerIds) => {
    setIsAssigning(true);
    try {
      const res = await dispatch(
        custJobListActions.assignJobs({
          jobIds: jobIds,
          hiringManagerId: hiringManagerIds,
        })
      );
      
      // Check if all results are successful
      if (!res?.payload || !Array.isArray(res.payload) || res.payload.length === 0) {
        throw new Error("Failed to assign jobs");
      }
      
      // Verify all responses are successful (status 200)
      const allSuccessful = res.payload.every(
        (result) => result?.statusCode === 200
      );
      
      if (!allSuccessful) {
        throw new Error("Some jobs failed to assign");
      }

      dispatch(
        showSnackbar({
          message: "Jobs assigned successfully!",
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 2000,
          maxWidth: 500,
        })
      );
      setIsAssignModalOpen(false);
      setSelectedJobs([]);
      handlePageChange(page);
    } catch (error) {
      dispatch(
        showSnackbar({
          message: "Failed to assign jobs. Please try again.",
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 2000,
          maxWidth: 500,
        })
      );
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Row>
        <Col md="12">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <PageTitle heading="Open Jobs" />
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => setViewType("block")}
                title="Block View"
                aria-label="Block View"
                style={{
                  background: viewType === "block" ? "#2f479b" : "white",
                  border: viewType === "block" ? "2px solid #2f479b" : "2px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "40px",
                  height: "40px",
                }}
              >
                <img src={titleblock} alt="Block View" style={{ width: "18px", height: "18px", filter: viewType === "block" ? "brightness(0) invert(1)" : "none" }} />
              </button>

              <button
                onClick={() => setViewType("list")}
                title="List View"
                aria-label="List View"
                style={{
                  background: viewType === "list" ? "#2f479b" : "white",
                  border: viewType === "list" ? "2px solid #2f479b" : "2px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "40px",
                  height: "40px",
                }}
              >
                <img src={titlelist} alt="List View" style={{ width: "18px", height: "18px", filter: viewType === "list" ? "brightness(0) invert(1)" : "none" }} />
              </button>
            </div>
          </div>
        </Col>

        <CommonFilters
          onSearchData={() => onSearchData()}
          //   // placeHolder={placeHolder}
          //   // setPlaceHolder={setPlaceHolder}
          //   // selectedOpt={selectedOpt}
          //   // setSelectedOpt={setSelectedOpt}
          //   // searchText={searchText}
          //   // setSearchText={setSearchText}
          onJobStatusChange={onJobStatusChange}
          onJobHiringMangerChange={onJobHiringMangerChange}
          showClearButtonAtEnd={true}
          showAssignButton={true}
          selectedJobsCount={selectedJobs.length}
          onAssignClick={handleAssignClick}
          viewType={viewType}
        />
      </Row>
      <Row>
        {jobList?.length > 0 ? (
          <>
            {!loading ? (
              <>
                {viewType === "block" ? (
                  // Block View Layout
                  <>
                {" "}
                <p className="mb-1 row-count">{totalRows} jobs</p>
                <Col
                  xs="12"
                  lg="4"
                >
                  {jobList?.length > 0 ? (
                    jobList.map((data) => {
                      return (
                        <CustJobCard
                          key={data.jobid}
                          name={data.jobtitle}
                          customer={data.companyname}
                          minExperience={data.minexperience}
                          maxExperience={data.maxexperience}
                          location={data.cityname + ", " + data.statename}
                          description={data.description}
                          role={data.jobrole}
                          jobId={data.jobid}
                          createdDate={data.jobcreatedatetime}
                          type={"Open"}
                          selectedJob={
                            jobDetail?.length > 0 ? jobDetail[0]?.jobid : ""
                          }
                          getSelectedJobId={(e) => getSelectedJob(e)}
                          additionalData={data}
                        />
                      );
                    })
                  ) : (
                    <></>
                  )}
                  {!loading && jobList?.length > 0 ? (
                    <>
                      <CardPagination
                        totalPages={current}
                        pageIndex={page}
                        onCallBack={(evt) => handlePageChange(evt)}
                      ></CardPagination>
                    </>
                  ) : (
                    <></>
                  )}
                </Col>
                <Col
                  xs="12" lg="8"
                >
                  {!jdLoading ? (
                    <>
                      {jobDetail?.length > 0 && jobList?.length > 0 ? (
                        <>
                          <CustJobDetail
                            jobDetails={jobDetail}
                            type={"Open"}
                            publishJob={(e) => publishNewJob(e)}
                            closeJob={(e) => closeJob(e)}
                            hiringManagerId={hiringManagerId}
                          ></CustJobDetail>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      {" "}
                      <Loader
                        type="line-scale-pulse-out-rapid"
                        className="d-flex justify-content-center"
                      />
                    </>
                  )}
                </Col>
              </>
            ) 
             : (
                  // List View Layout
                  <Col xs="12">
                    <CustJobListView
                      jobList={jobList}
                      totalRows={totalRows}
                      current={current}
                      page={page}
                      handlePageChange={handlePageChange}
                      closeJob={closeJob}
                      getSelectedJob={getSelectedJob}
                      onSelectedJobsChange={setSelectedJobs}
                    />
                  </Col>
                )}
              </>
            ) : (
              <>
                {" "}
                <Loader
                  type="line-scale-pulse-out-rapid"
                  className="d-flex justify-content-center"
                />
              </>
            )}
          </>
        ) : (
          <>
            {!loading && (<Row
              style={{ textAlign: "center", minHeight: "40vh" }}
              className="center-middle-align"
            >
              <Col>
                {" "}
                <NoDataFound></NoDataFound>
              </Col>
            </Row>)}
          </>
        )}
      </Row>

      {/* Assign Jobs Modal */}
      <AssignJobsModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedJobs={selectedJobs}
        onAssign={handleAssignJobs}
        isLoading={isAssigning}
        hiringManagers={hiringManagers}
      />
    </>
  );
}
