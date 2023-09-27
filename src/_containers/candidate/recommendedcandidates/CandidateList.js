import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Label,
  Input,
  Card,
  CardBody,
  Modal,
  FormGroup,
  Row,
  Col,
  Button,
} from "reactstrap";
import { candidateActions } from "_store";
import cx from "classnames";
import { useDispatch } from "react-redux";
import { CandidateProfile } from "../candidateProfile";
import PageTitle from "../../../_components/common/pagetitle";
import { CustomPagination } from "../../../_components/common/pagination";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import errorIcon from "../../../assets/utils/images/error_icon.png";
import successIcon from "../../../assets/utils/images/success_icon.svg";
import candidatelogo from "../../../assets/utils/images/profile_pic.svg";
import { useParams } from "react-router-dom";
import { applyMask } from "_helpers/helper";
import { CandidatePopover } from "_components/popover/candidatepopover";
import { SkillsPopover } from "_components/popover/skillspopover";
import "./candidate.scss";

export const CandidateList = (props) => {
  const dispatch = useDispatch();
  const { jobId } = useParams();

  const [commentLength, setCommentLength] = useState(0);
  const [reasonError, setReasonError] = useState(false);
  const [candidatesList, setCandidateList] = useState([]);
  const [getCandidateList, setList] = useState([]);
  const [showCandidate, setShowCandidate] = useState(false);
  const [selectedCandidate, setselectedCandidate] = useState();
  const [pageSize, setpageSize] = useState(10);
  const [isExpError, setIsExpError] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [jobTitle, setJobTitle] = useState();

  const [acceptModal, setAcceptModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectConfirmation, setRejectConfirmation] = useState(false);
  let totalPages = useRef();
  let pageIndex = useRef(1);
  let skillDetails = [];

  let searchData = useRef("");
  let rejectedCandidateId = useRef();
  let rejectedApplicationId = useRef();
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  const [reasonList, setReasonList] = useState([
    {
      value: 1,
      type: "Location Issue",
    },
    {
      value: 2,
      type: "Skills not matched",
    },
    {
      value: 3,
      type: "Fake Profile",
    },
  ]);

  let rejectReqData = {
    candidateid: 0,
    applicationstatusid: 0,
    applicationstatus: "",
    rejectedreasonid: 0,
    rejectedcomment: "",
    currentUserId: 0,
  };

  useEffect(() => {
    getCandidatesList();
  }, []);

  useEffect(() => {
    setCandidateList(getCandidateList);
  }, [getCandidateList]);

  const onChangeReason = function (data) {
    rejectReqData.rejectedreasonid = data;
    setReasonError(false);
  };

  const addComment = function (data) {
    rejectReqData.rejectedcomment = data;
    setCommentLength(rejectReqData.rejectedcomment.length);
  };

  const getCandidatesList = async function () {
    setAcceptModal(false);
    setRejectConfirmation(false);
    setRejectModal(false);
    let listType =
      props.type === "candidate"
        ? "Applied"
        : props.type === "accepted"
          ? "Accepted"
          : "Rejected";
    let url =
      "JobApplications/GetJobAppliedCandidatesList/" +
      jobId +
      "?pageSize=" +
      pageSize +
      "&pageNumber=" +
      pageIndex.current +
      `&isActive=true&Applicationstatus=${listType}`;
    if (searchData.current !== "") {
      url += "&searchText=" + searchData.current;
    }
    if (minExperience != "") {
      url += "&minExperience=" + minExperience;
    }
    if (maxExperience != "") {
      url += "&maxExperience=" + maxExperience;
    }

    let response = await dispatch(candidateActions.getCandidates({ url }));

    setList(response.payload.data.candidateList);
    setJobTitle(response.payload.data.jobTitle);
    totalPages.current = Math.round(
      Number(response.payload.data.totalRows) / pageSize
    );

    if (totalPages.current * pageSize !== response.payload.data.totalRows) {
      totalPages.current++;
    }
  };

  const onHandleMinExpChange = function (event) {
    setMinExperience(event.target.value);
    if (minExperience && maxExperience) {
      if (parseInt(event.target.value) > parseInt(maxExperience)) {
        setIsExpError(true);
      } else {
        setIsExpError(false);
      }
    } else {
      setIsExpError(false);
    }
  };

  const onHandleMaxExpChange = function (event) {
    setMaxExperience(event.target.value);
    if (minExperience) {
      if (parseInt(minExperience) > parseInt(event.target.value)) {
        setIsExpError(true);
      } else {
        setIsExpError(false);
      }
    } else {
      setIsExpError(false);
    }
  };

  const onShowProfile = function (data) {
    setselectedCandidate(data);
    setShowCandidate(true);
  };

  const onSearch = function (data) {
    setSearchText(data);
    searchData.current = data;
  };
  const onReset = function () {
    setMinExperience("");
    setMaxExperience("");

    setIsExpError(false);
    getCandidatesList();
  };

  const onClearSearch = function () {
    setSearchText("");
    searchData.current = "";
    getCandidatesList();
  };

  const rejectCandidate = function (data) {
    rejectedCandidateId.current = data.candidateid;
    rejectedApplicationId.current = data.jobapplicationid;
    setRejectModal(!rejectModal);
  };

  const acceptRejectCandidate = async function (check, data) {
    let candidateid;
    let jobId;
    let applicationstatusid = 0;
    let rejectedreasonid = rejectReqData.rejectedreasonid;
    let rejectedcomment = rejectReqData.rejectedcomment;
    let currentUserId = 1;
    let applicationstatus;
    if (check === "reject") {
      if (rejectedreasonid == 0) {
        setReasonError(true);
        return;
      } else {
        setReasonError(false);
      }
      applicationstatus = "Rejected";
      candidateid = rejectedCandidateId.current;
      jobId = rejectedApplicationId.current;
      rejectedreasonid = rejectReqData.rejectedreasonid;
      rejectedcomment = rejectReqData.rejectedcomment;
    } else {
      applicationstatus = "Accepted";
      candidateid = data.candidateid;
      jobId = data.jobapplicationid;
    }
    await dispatch(
      candidateActions.acceptRejectCandidate({
        candidateid,
        jobId,
        applicationstatusid,
        rejectedreasonid,
        rejectedcomment,
        currentUserId,
        applicationstatus,
      })
    );
    if (check === "accept") {
      setAcceptModal(!acceptModal);
    } else {
      setRejectModal(!rejectModal);
      setRejectConfirmation(!rejectConfirmation);
    }
  };

  const getSkills = function (data) {
    let skillData = [];
    skillDetails = [];
    let splitData = data.split(",");
    for (let i = 0; i < splitData.length; i++) {
      if (i < 3) {
        skillData.push(splitData[i]);
      }
      skillDetails.push(splitData[i]);
    }
    return skillData.join(",");
  };

  const handlePageChange = (page) => {
    pageIndex.current = page;
    getCandidatesList();
  };

  const showButtons = (type, col) => {
    if (type === "candidate") {
      return (
        <>
          <Button
            className="primary-btn candidate-table-btn table-btn me-2"
            onClick={(evt) => acceptRejectCandidate("accept", col)}
          >
            Accept
          </Button>
          <Button
            className="primary-btn candidate-table-btn table-btn"
            onClick={(evt) => rejectCandidate(col)}
          >
            Reject
          </Button>
        </>
      );
    } else if (type === "accepted") {
      return (
        <>
          <Button className="primary-btn candidate-table-btn table-btn me-2">
            Interview
          </Button>
          <Button
            className="primary-btn candidate-table-btn table-btn"
            onClick={(evt) => rejectCandidate(col)}
          >
            Reject
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button className="primary-btn candidate-table-btn table-btn me-2">
            Reject Reason
          </Button>
        </>
      );
    }
  };

  return (
    <div>
      {!showCandidate ? (
        <div>
          <PageTitle
            heading="Applied Candidates for "
            jobTitle={jobTitle}
            icon={titlelogo}
          />

          <Card className="main-card mb-2 candidate-list">
            <CardBody>
              <Row>
                <Col md={12} sm={12} lg={8}>
                  <Row>
                    <Col lg={3} md={12} sm={12}>
                      <Label className="input-label">Min Experience</Label>
                      <Input
                        type="input"
                        id="minExp"
                        className="input-text placeholder-input"
                        name="minExp"
                        placeholder="Enter min experience"
                        value={minExperience}
                        style={{
                          borderColor: isExpError ? "red" : "#ced4da",
                        }}
                        onInput={(evt) => onHandleMinExpChange(evt)}
                      ></Input>
                    </Col>

                    <Col lg={3} md={12} sm={12}>
                      <Label className="input-label">Max Experience</Label>
                      <Input
                        type="input"
                        id="maxExp"
                        className="input-text placeholder-input"
                        name="maxExp"
                        value={maxExperience}
                        placeholder="Enter max experience"
                        style={{
                          borderColor: isExpError ? "red" : "#ced4da",
                        }}
                        onChange={(evt) => onHandleMaxExpChange(evt)}
                      ></Input>
                    </Col>
                    <Col lg={4} md={12} sm={12} className="filter-btn-mt">
                      <Button
                        className="me-2 filter-btn"
                        onClick={(evt) =>
                          !isExpError ? getCandidatesList() : ""
                        }
                        style={{
                          backgroundColor: !isExpError
                            ? "rgb(33 91 153)"
                            : "grey",
                          cursor: !isExpError ? "pointer" : "not-allowed",
                        }}
                      >
                        Submit
                      </Button>

                      <Button
                        className=" filter-btn"
                        onClick={(evt) => onReset()}
                      >
                        reset
                      </Button>
                    </Col>
                  </Row>
                  {isExpError ? (
                    <p className="filter-info-text filter-error-msg">
                      Minimum experience should be less than Max Experience
                    </p>
                  ) : (
                    <p className="filter-info-text">
                      Filter candidates by year of experience.
                    </p>
                  )}
                </Col>

                <Col md={12} sm={12} lg={4}>
                  <div
                    className={cx(
                      "candidate-search-wrapper search-wrapper candidate-seacrh-mt",
                      {
                        active: true,
                      }
                    )}
                  >
                    <div className="input-holder float-end">
                      <input
                        type="text"
                        className="search-input search-placeholder"
                        id="search-input"
                        value={searchText}
                        onInput={(evt) => onSearch(evt.target.value)}
                        placeholder="Search by skill/location"
                      />
                      <button
                        className="btn-close"
                        onClick={(evt) => onClearSearch()}
                      />
                      <button
                        onClick={(evt) => getCandidatesList()}
                        className="search-icon"
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Table
            responsive
            borderless
            className="align-middle mb-0 candidate-table"
          >
            <thead>
              <tr className="candidate-table-header">
                <th>Name</th>
                <th>Experience</th>
                <th>Notice Period</th>
                <th>Skills</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            {candidatesList.length > 0 ? (
              <tbody>
                {candidatesList.map((col, ind) => (
                  <tr key={col.email} className="candidate-table-body">
                    <td>
                      <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                          <div className="widget-content-left me-3">
                            <div className="widget-content-left">
                              <img
                                src={candidatelogo}
                                className="candidate-logo"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="widget-content-left flex2">
                            <div className="candidate-name">
                              <span id={`candidatepopover${ind}`}>
                                {applyMask(col.firstname + col.lastname)}
                              </span>
                              <CandidatePopover data={col} ind={ind} />
                            </div>
                            <div className="candidate-primary-skill">
                              {col.primaryskills}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="candidate-table-data">
                      {col.experienceyears + " years"}
                    </td>
                    <td className="candidate-table-data">{col.noticeperiod}</td>
                    <td className="candidate-table-data">
                      {getSkills(col.secondaryskills) + " "}
                      {skillDetails.length > 3 ? (
                        <>
                          <a
                            className="candidate-more-link"
                            id={`skillspopover${ind}`}
                          >
                            +{skillDetails.length - 3} More
                          </a>
                          <SkillsPopover data={col} ind={ind} />
                        </>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="candidate-table-data">
                      {col.cityname && col.statename
                        ? col.cityname + " , " + col.statename
                        : col.cityname
                          ? col.cityname
                          : col.statename}
                    </td>

                    <td>
                      <Button
                        className="me-2 candidate-table-btn profile-btn"
                        onClick={(evt) => onShowProfile(col)}
                      >
                        Profile
                      </Button>
                      {showButtons(props.type, col)}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <></>
            )}
          </Table>

          <CustomPagination
            totalPages={totalPages.current}
            pageIndex={pageIndex.current}
            onCallBack={handlePageChange}
          ></CustomPagination>
        </div>
      ) : (
        <div>
          <CandidateProfile
            selectedData={selectedCandidate}
            jobId={jobId}
            setShowCandidate={setShowCandidate}
          ></CandidateProfile>
        </div>
      )}

      <Modal className="modal-dialog-align" isOpen={acceptModal}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center success-modal-text">
              Candidate Accepted Successfully
            </div>
            <div>
              <Row className="d-flex justify-content-center mb-4 accept-interview-text">
                Would you like to schedule
              </Row>
              <Row className="d-flex justify-content-center mb-4 accept-interview-text">
                an interview?
              </Row>
              <Row>
                <Col className="d-flex justify-content-center interview-btn">
                  <Button
                    color="primary"
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => getCandidatesList()}
                  >
                    Yes
                  </Button>
                  <Button
                    color="primary"
                    className="success-close-btn"
                    onClick={(evt) => getCandidatesList()}
                  >
                    No
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-dialog-reject-align" isOpen={rejectModal}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="error-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center reject-reason-text">
              Please Provide a Reason for
            </div>
            <div className="mb-3 d-flex justify-content-center reject-reason-text">
              Candidate Rejection
            </div>
            <div className="candidate-list">
              <Row>
                <Col className="mb-2">
                  <Label
                    className="reject-modal-label"
                    for="exampleCustomSelectDisabled"
                  >
                    Reason <span className="required-icon">*</span>
                  </Label>
                  <Input
                    className="reason-dropdown-input dropdown-placeholder"
                    style={{
                      borderColor: reasonError ? "red" : "#ced4da",
                    }}
                    type="select"
                    id="jobType"
                    name="jobType"
                    placeholder="Select Reason"
                    onChange={(evt) => onChangeReason(evt.target.value)}
                  >
                    <option className="dropdown-placeholder">
                      Select Reason
                    </option>
                    {reasonList.map((col) => (
                      <option key={col.value} value={col.value}>
                        {col.type}
                      </option>
                    ))}
                  </Input>
                  {reasonError ? (
                    <p className="filter-info-text filter-error-msg">
                      Reason is required
                    </p>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label className="reject-modal-label" for="exampleText">
                      Comment
                    </Label>
                    <Input
                      type="textarea"
                      className="dropdown-placeholder"
                      placeholder="Enter comment here"
                      onInput={(evt) => addComment(evt.target.value)}
                      name="text"
                      maxLength={100}
                      id="exampleText"
                    />
                    <div>
                      <span className="dropdown-placeholder float-end">
                        {commentLength}/100
                      </span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center ">
                  <Button
                    className="me-2 reject-modal-btn"
                    onClick={(evt) => acceptRejectCandidate("reject", "")}
                  >
                    Submit
                  </Button>
                  <Button
                    className="reject-close-btn"
                    onClick={(evt) => setRejectModal(false)}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align " isOpen={rejectConfirmation}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Candidate Rejected
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Successfully!
            </div>
            <div className="mb-3 d-flex justify-content-center reject-text">
              {" "}
              Thank you!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center ">
                  <Button
                    color="primary"
                    onClick={(evt) => getCandidatesList()}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
};
