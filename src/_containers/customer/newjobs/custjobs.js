import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { custJobListActions, createjobActions, dropdownActions } from "_store";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { custListPageSize } from "_helpers/constants";
import { CardPagination } from "_components/common/cardpagination";
import { CustJobCard } from "./custjobcard";
import { CustJobDetail } from "./custjobdetails";
import Loader from "react-loaders";
import { CustJobFilter } from "./custjofilter";
import { NoDataFound } from "_components/common/nodatafound";
import moment from "moment/moment";
import { analytics } from "../../../firebase/index";

export const CustJobList = () => {
  const [page, setPage] = useState(1);
  const [placeHolder, setPlaceHolder] = useState("Search job title");
  const [selectedOpt, setSelectedOpt] = useState("JobTitle");
  const [searchText, setSearchText] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [hiringManagerId, setHiringMangerId] = useState("");
  const dispatch = useDispatch();
  const getCompanyDetails = async function () {
    await dispatch(
      createjobActions.getCustomerDetailsThunk(
        JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
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

  useEffect(() => {
    setHiringMangerId(localStorage.getItem("userId"));
    getCompanyDetails();
    onPageChange(page);
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "New Jobs",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    if (jobList.length > 0) {
      dispatch(custJobListActions.getJobDetail({ jobId: jobList[0].jobid }));
      dispatch(dropdownActions.getCloseJobReasonListThunk());
    }
  }, [jobList, dispatch]);

  const onPageChange = (page) => {
    let filterOnPageChange = {
      pageSize: custListPageSize,
      pageNumber: page,
      searchText: searchText ?? "",
      companyId: localStorage.getItem("companyid"),
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

  const publishNewJob = function (event) {
    let jobId = event;
    let payload = {
      currentUserId: localStorage.getItem("userId"),
    };
    dispatch(createjobActions.getPublishJobThunk({ jobId, payload }));
    dispatch(
      custJobListActions.publishJob({
        jobList: jobList,
        jobDetail: jobDetail,
        jobId: jobId,
        publisheddate: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
      })
    );
    getSelectedJob(jobId);
  };
  const closeJob = (event) => {
    let jobId = event.jobId;
    let payload = {
      closedjobreasonid: event.closedjobreasonid,
      currentUserId: localStorage.getItem("userId"),
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
    setJobStatus(event);
    let filterOnPageChange = {
      pageSize: custListPageSize,
      pageNumber: page,
      searchText: searchText ?? "",
      companyId: localStorage.getItem("companyid"),
      searchType: selectedOpt,
      jobStatus: event,
      hiringManagerId: hiringManagerId
    };
    getJobList(filterOnPageChange);
  };

  const onJobHiringMangerChange = (event) => {
    setHiringMangerId(event);
    let filterOnPageChange = {
      pageSize: custListPageSize,
      pageNumber: page,
      searchText: searchText ?? "",
      companyId: localStorage.getItem("companyid"),
      searchType: selectedOpt,
      jobStatus: jobStatus,
      hiringManagerId: event,
    };
    getJobList(filterOnPageChange);
  };

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading="Open Jobs" icon={titlelogo} />
        </Col>
        <CustJobFilter
          onSearchData={() => onSearchData()}
          placeHolder={placeHolder}
          setPlaceHolder={setPlaceHolder}
          selectedOpt={selectedOpt}
          setSelectedOpt={setSelectedOpt}
          searchText={searchText}
          setSearchText={setSearchText}
          onJobStatusChange={onJobStatusChange}
          onJobHiringMangerChange={onJobHiringMangerChange}
          hiringManagerId={hiringManagerId}
          setHiringMangerId={setHiringMangerId}
        />

        <Row>
          {jobList?.length > 0 ? (
            <>
              {!loading ? (
                <>
                  {" "}
                  <p className="mb-1 row-count">{totalRows} jobs</p>
                  <Col
                    xs={{ size: 12, order: 1 }}
                    sm={{ size: 12, order: 1 }}
                    md={{ size: 12, order: 1 }}
                    lg={{ size: 4, order: 1 }}
                    xl={{ size: 4, order: 1 }}
                    xxl={{ size: 4, order: 1 }}
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
                              jobDetail?.length > 0 ? jobDetail[0].jobid : ""
                            }
                            getSelectedJobId={(e) => getSelectedJob(e)}
                            additionalData={data}
                          />
                        );
                      })
                    ) : (
                      <></>
                    )}
                    {/* {!loading && jobList?.length > 0 ? (
                      <>
                        <CardPagination
                          totalPages={current}
                          pageIndex={page}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
                    )} */}
                  </Col>
                  <Col
                    xs={{ size: 12, order: 2 }}
                    sm={{ size: 12, order: 2 }}
                    md={{ size: 12, order: 2 }}
                    lg={{ size: 4, order: 3 }}
                    xl={{ size: 4, order: 3 }}
                    xxl={{ size: 4, order: 3 }}
                  >
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
                    xs={{ size: 12, order: 3 }}
                    sm={{ size: 12, order: 3 }}
                    md={{ size: 12, order: 3 }}
                    lg={{ size: 8, order: 2 }}
                    xl={{ size: 8, order: 2 }}
                    xxl={{ size: 8, order: 2 }}
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
              <Row
                style={{ textAlign: "center", minHeight: "40vh" }}
                className="center-middle-align"
              >
                <Col>
                  {" "}
                  <NoDataFound></NoDataFound>
                </Col>
              </Row>
            </>
          )}
        </Row>
        <Row>
          {/* <Col
            xs={{ size: 12, order: 2 }}
            sm={{ size: 12, order: 2 }}
            md={{ size: 12, order: 2 }}
            lg={{ size: 4, order: 3 }}
            xl={{ size: 4, order: 3 }}
            xxl={{ size: 4, order: 3 }}
          >
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
          </Col> */}
        </Row>
      </Row>
    </>
  );
};
