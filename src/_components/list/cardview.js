import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  ButtonGroup,
  UncontrolledPopover,
} from "reactstrap";
import { AcceptModal } from "_components/modal/acceptmodal";
import { RejectModal } from "_components/modal/rejectmodal";
import { FiMapPin } from "react-icons/fi";
import Alert from 'react-bootstrap/Alert';
import {
  BsBriefcase,
  BsAward,
  BsHandThumbsUp,
  BsStar,
  BsQuestionCircle,
  BsXCircle,
  BsClock,
  BsMortarboard,
  BsFileEarmark,
  BsBuildings,
  BsCheckCircle,
  BsPerson,
  BsPencil
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import "./cardview.scss";
import { ProgressCircle } from "_components/common/progress";
import moment from "moment";
import customerIcons from "assets/utils/images/customer";
import { ScorePopup } from "./scorePopup";
import SweetAlert from "react-bootstrap-sweetalert";
import AssigneeAtsCandidate from "_containers/customer/atscustomercandidatelist/AssigneeAtsCandidate";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, CANDIDATE_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export const CandidateCardView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const [showSchdIntModal, setShowSchdIntSModal] = useState(false);
  const [openBDModal, setOpenBDModal] = useState(false);
  const [atsCandidateId, setAtsCandidateId] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [assignedCompanyId, setAssignedCompanyId] = useState(null);
  const [assignmentStartDate, setAssignmentStartDate] = useState(null);
  const [assignmentEndDate, setAssignmentEndDate] = useState(null);
  const [assignedCompanyName, setAssignedCompanyName] = useState(null);
  const isStaffingFirm = props.isStaffingFirm;
  const dispatch = useDispatch();
  const onRejectClick = () => {
    setShowReModal(true);
  };

  const onSubmitRejectModal = async (comment, reasonid) => {
    let userId = localStorage.getItem("userId");
    let res = await dispatch(
      customerCandidateListsActions.putRejectCandidate({
        id: props?.data?.candidaterecommendedjobid,
        customerrejectedcomment: comment,
        customerrejectedreasonid: reasonid,
        currentUserId: userId,
      })
    );
    setShowReModal(false);
    if (res.payload.statusCode === 204) {
      // setShowRejSModal(true);    
      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    } else {
      // props.showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });

      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    }
  };

  const onActionClick = (type) => {
    props.onActionClick(props?.data?.candidaterecommendedjobid, type);
  };

  const onCloseRejSModal = () => {
    setShowRejSModal(false);
    props.updateList();
  };

  const onScheduleInterview = () => {
    setShowSchdIntSModal(true);
  };

  const getFormData = (formData) => {
    postScheduledInterview(formData);
  };
  const postScheduledInterview = async function (formData) {
    let res = await dispatch(
      customerCandidateListsActions.postScheduleInterview(formData)
    );
    if (res.payload.statusCode === 201) {
      setShowSchdIntSModal(false);
      // props.showSweetAlert({
      //   title: "Interview scheduled successfully!",
      //   type: "success",
      // });
      props.updateList();

      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.INTERVIEW_SCHEDULED_SUCCESSFULLY,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      // props.showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });

      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    }
  };

  const returnSkills = () => {
    if (
      props?.data?.candidateSkillDtos &&
      props?.data?.candidateSkillDtos?.length > 0
    ) {
      return props?.data?.candidateSkillDtos
        .map((element) => element.skillname)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnEducation = () => {
    if (
      props?.data?.candidateEducationDtos &&
      props?.data?.candidateEducationDtos?.length > 0
    ) {
      return props?.data?.candidateEducationDtos
        .map((element) => element.levelofeducation)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnCert = () => {
    if (
      props?.data?.candidateCertificationDtos &&
      props?.data?.candidateCertificationDtos?.length > 0
    ) {
      return props?.data?.candidateCertificationDtos
        .map((element) => element.certificationname)
        .join(", ");
    } else {
      return "";
    }
  };

  const returnWorkExperince = () => {
    if (
      props?.data?.candidateQualificationsDtos &&
      props?.data?.candidateQualificationsDtos?.length > 0
    ) {
      return (
        <Row>
          {props.data.candidateQualificationsDtos.map((data, index) => {
            return (
              <>
                <Col sm={12} md={12} lg={12} xl={12} className="card-details">
                  {data.jobtitle ? data.jobtitle : "-"}
                </Col>
                <Col sm={8} md={8} lg={8} xl={8} className="card-details-op">
                  {data.company ? data.company : "-"}
                </Col>
                <Col
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  className="right-align card-details-op pl-0"
                >
                  {" "}
                  {data.iscurrentlyworking
                    ? `${data.startdate === null
                      ? "NA"
                      : moment(data.startdate).format("YYYY")
                    } - Present`
                    : `${data.startdate === null
                      ? "NA"
                      : moment(data.startdate).format("YYYY")
                    } - ${data.enddate === null
                      ? index === 0
                        ? "Present"
                        : "NA"
                      : moment(data.enddate).format("YYYY")
                    }`}
                </Col>
              </>
            );
          })}
        </Row>
      );
    } else {
      return "-";
    }
  };

  const returnResume = () => {
    return (
      <Row>
        <Col sm={6} md={6} lg={6} xl={6} className="card-details-op">
          <p>  <span style={{ cursor: "pointer", marginLeft: "3px" }} onClick={() => onBuildResume()}>OpenWorX CV</span>
            <img
              style={{ float: "left", cursor: "pointer" }}
              src={customerIcons.view_cv_icon}
              alt="view cv icon"
              onClick={() => onBuildResume()}
            ></img></p>
        </Col>
        <Col sm={5} md={5} lg={5} xl={5} className="card-details-op">
          {props?.data?.candidateResumeDto?.resumepath && (
            <p>
              <span style={{ cursor: "pointer", marginLeft: "3px" }} onClick={() => onCandidateResume()}>
                Candidate CV
              </span>
              <img
                style={{ float: "left", cursor: "pointer" }}
                src={customerIcons.view_cv_icon}
                alt="view cv icon"
                onClick={() => onCandidateResume()}
              ></img></p>
          )}
        </Col>
      </Row>)
  };

  const onBuildResume = () => {
    if (props?.data?.recommendedationCandidateShortList?.length > 0) {
      props.onBuildResume(
        props?.data?.recommendedationCandidateShortList[0].candidateid,
        props?.data?.scorejson?.replace(/'/g, '"').replace(/candidate"s/g, "candidate's"),
        props?.data?.jobtitle ? props?.data?.jobtitle : "",
      );
    }
  };

  const onCandidateResume = () => {
    if (props?.data?.recommendedationCandidateShortList?.length > 0) {
      props.onCandidateResume(
        props?.data?.recommendedationCandidateShortList[0].candidateid,
        props?.data?.candidateResumeDto?.resumepath
      );
    }
  };

  const onPresentClick = () => {
    props.onPresentClick(props?.data?.candidaterecommendedjobid);
  };

  const updateAssignedDetail = (atsCandidateId, isAssigned, assignedCompanyId, assignedCompanyName, assignmentStartDate, assignmentEndDate) => {
    setAtsCandidateId(atsCandidateId);
    setIsAssigned(isAssigned);
    setAssignedCompanyId(assignedCompanyId);
    setAssignedCompanyName(assignedCompanyName);
    setAssignmentStartDate(assignmentStartDate);
    setAssignmentEndDate(assignmentEndDate);
    setOpenBDModal(true);
  };

  const onCloseBDModal = () => {
    setOpenBDModal(false);
    setAtsCandidateId(null);
  };

  const handleRefreshData = () => {
    if (props.updateList && typeof props.updateList === "function") {
      props.updateList();
    }
  };

  return (
    <>
      <Card className="main-card mb-3 cust-cand-card">
        <CardBody>
          <Row>
            <Col className="col-12">
              <Row>
                <Col xs={7} sm={7} md={7} lg={7} xl={8} xxl={9}>
                  <div className="card-title">
                    {props?.data?.candidateQualificationsDtos &&
                      props?.data?.candidateQualificationsDtos.length > 0
                      ? props?.data?.candidateQualificationsDtos[0]?.jobtitle
                      : "-"}
                  </div>
                  <p className="card-details-op">
                    <span>
                      <FiMapPin size={"16px"} />
                    </span>{" "}
                    {props?.data?.recommendedationCandidateShortList &&
                      props?.data?.recommendedationCandidateShortList.length > 0
                      ? (props?.data?.recommendedationCandidateShortList[0]
                        ?.cityname
                        ? `${props?.data?.recommendedationCandidateShortList[0]?.cityname}, `
                        : "") +
                      "" +
                      (props?.data?.recommendedationCandidateShortList[0]
                        ?.statename
                        ? props?.data?.recommendedationCandidateShortList[0]
                          ?.statename
                        : "")
                      : ""}
                  </p>
                </Col>
                <Col xs={5} sm={5} md={5} lg={5} xl={4} xxl={3}>
                  <div className="card-title right-align">
                    {props?.data?.avgscore ? (
                      <>
                        <Button
                          className="me-2 mb-2"
                          color="link"
                          id={
                            "PopoverCustom-" +
                            props?.data?.candidaterecommendedjobid
                          }
                        >
                          <ProgressCircle avgscore={props?.data?.avgscore} />
                        </Button>
                        <UncontrolledPopover
                          className="popover-custom"
                          placement={"bottom"}
                          trigger="legacy"
                          fade={false}
                          target={
                            "PopoverCustom-" +
                            props?.data?.candidaterecommendedjobid
                          }
                        >
                          <ScorePopup
                            scoreJson={props?.data?.scorejson
                              ?.replace(/'/g, '"')
                              .replace(/candidate"s/g, "candidate's")}
                          />
                        </UncontrolledPopover>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsBriefcase size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      gap: "8px" 
                      }}>
                      <div 
                      style={{ 
                        display: "flex",
                        alignItems: "center",
                        gap: "8px" }}>
                        <b>Work Experience</b>
                      </div>

                      {localStorage.getItem("atsEnableStatus") === "true" && props?.data?.isatscandidate === false && (
                        <div
                          style={{
                            backgroundColor: "#FED7AA",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                          }}
                        >
                          <span
                            style={{
                              color: "#C2410C",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            Non‑ATS
                          </span>
                        </div>
                      )}
                    </div>
                    <p>{returnWorkExperince()}</p>
                  </Col>
                 
                  </Row>
              </p>
            </Col>

            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsMortarboard size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Education </b> <p>{returnEducation()}</p>
                  </Col>
                </Row>
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsStar size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Skills </b>
                    <p> {returnSkills()}</p>
                  </Col>
                </Row>
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <Row>
                  <Col md="1" lg="1">
                    <span className="pe-2">
                      <BsAward size={"16px"} />
                    </span>
                  </Col>
                  <Col md="11" lg="11">
                    <b>Certfications/Licences </b>{" "}
                    <div>
                      {isStaffingFirm === false && (
                        <>
                          <img
                            style={{
                              float: "right",
                              marginLeft: "0.25rem",
                              marginTop: "2px",
                              cursor: "pointer",
                            }}
                            src={customerIcons.view_cv_text}
                            alt="view cv text"
                            onClick={() => onBuildResume()}
                          ></img>
                          <img
                            style={{ float: "right", cursor: "pointer" }}
                            src={customerIcons.view_cv_icon}
                            alt="view cv icon"
                            onClick={() => onBuildResume()}
                          ></img>
                        </>
                      )}

                      <p style={{ overflow: "visible" }}>{returnCert()}</p>
                    </div>
                  </Col>
                </Row>
              </p>
            </Col>
            {isStaffingFirm && (
              <>
                <Col className="col-12">
                  <p className="card-details">
                    <Row>
                      <Col md="1" lg="1">
                        <span className="pe-2">
                          <BsFileEarmark size={"16px"} />
                        </span>
                      </Col>
                      <Col md="11" lg="11">
                        <b>Resume </b>
                        <p>{returnResume()}</p>

                      </Col>
                    </Row>
                  </p>
                </Col>
                <Col className="col-12">
                  <p className="card-details">
                    <Row>
                      <Col md="1" lg="1">
                        <span className="pe-2">
                          <BsBuildings size={"16px"} />
                        </span>
                      </Col>
                      <Col md="11" lg="11">
                        <b>Client Company </b>
                        <p> {props?.data?.clientcompanyname}</p>
                      </Col>
                    </Row>
                  </p>
                </Col>
                <Col className="col-12">
                  <p className="card-details">
                    <Row>
                      <Col md="1" lg="1">
                        <span className="pe-2">
                          <BsPerson size={"16px"} />
                        </span>
                      </Col>
                      <Col md="11" lg="11">
                        <b>Candidate Name</b>
                        <p>{`${props?.data?.firstname} ${props?.data?.lastname}`}</p>
                      </Col>
                    </Row>
                  </p>
                </Col>
                {props.data.assignedInfoDTO?.[0]?.isassigned === true && 
                (<Col className="col-12"> 
                    <div className="card-details"> 
                      <Row> 
                        <Col md="1" lg="1"> 
                        <span className="pe-2">
                          <img
                            src={customerIcons.On_Assignment}
                            alt="On assignment"
                            width="22"
                            height="25"
                            style={{ verticalAlign: "middle", objectFit: "contain" }}
                          />
                        </span>
                          
                        </Col> 
                        <Col md="11" lg="11">
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
                            <div>
                              <b>Assignment Status</b> 
                              <div>On Assignment / Already Working</div>
                                <div className="d-flex flex-column gap-1">
                                  <div className="d-flex align-items-center">
                                    <span>
                                      {props.data.assignedInfoDTO?.[0]?.assignmentstartdate
                                        ? 
                                        moment(props.data.assignedInfoDTO?.[0]?.assignmentstartdate ).format("MM/DD/YYYY")
                                         : "-"}
                                    </span>
                                       {" - "}
                                    <span>
                                      {props.data.assignedInfoDTO?.[0]?.assignmentenddate
                                        ? moment(props.data.assignedInfoDTO?.[0]?.assignmentenddate ).format("MM/DD/YYYY")
                                         : "-"}
                                    </span>
                                  </div>
                              </div>
                            </div>
                            <div className="me-3 float-end">
                                <BsPencil
                                    className="edit-icon"
                                    size={16}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      const atsDetail = props.data.assignedInfoDTO?.[0];
                                      updateAssignedDetail(
                                          atsDetail?.atscandidateid,
                                          atsDetail?.isassigned,
                                          atsDetail?.assignedcompanyid,
                                          atsDetail?.assignedcompanyname,
                                          atsDetail?.assignmentstartdate,
                                          atsDetail?.assignmentenddate
                                      );
                                    }}
                                />
                              </div>
                          </div>
                        </Col> 
                      </Row> 
                    </div> 
                </Col> )}
              </>)}
          </Row>
        </CardBody>
        <CardFooter className="auto-margin">
          <Row noGutters>
          {props?.data?.isclosed === false ? (
            <ButtonGroup className="card-btn-grp" size="sm">
              {/* <Col>
              <Button
                title="accept"
                className=" btn-icon"
                color="success"
                onClick={() => onAcceptClick()}
              >
                <BsCheckCircle />
              </Button>
            </Col> */}
              <Button
                outline
                title="maybe"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onActionClick("maybe")}
              >
                <BsQuestionCircle></BsQuestionCircle>  Maybe
              </Button>
              <Button
                outline
                title="liked"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onActionClick("like")}
              >
                <BsHandThumbsUp></BsHandThumbsUp>  Like
              </Button>
              {isStaffingFirm && (
                <Button
                  outline
                  title="present"
                  className="btn-icon mb-1"
                  color="primary"
                  onClick={() => onActionClick("presented")}
                  size="sm"
                  disabled={props?.data?.ispresented}
                >
                  <BsCheckCircle/> {props?.data?.ispresented ? "Presented" : "Present"}
                </Button>
              )}
              <Button
                outline
                title="schedule"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onScheduleInterview()}
              >
                <BsClock />  Schedule
              </Button>
              <Button
                outline
                title="decline"
                className="btn-icon mb-1"
                color="primary"
                onClick={() => onRejectClick()}
                size="sm"
              >
                <BsXCircle></BsXCircle> Decline
              </Button>

            </ButtonGroup>
             ) :  props?.data?.isclosed === true ?(
                <Button
                outline
                title="Job Closed"
                className="btn-icon lg-12"
                color="danger"
                size="lg"
                disabled={true}
              >
                <BsXCircle></BsXCircle>  Job Closed
              </Button>
          ):null}
          </Row>
        </CardFooter>
      </Card>
      <>
        {showAModal ? (
          <AcceptModal
            isAMOpen={showAModal}
            onAcceptYesClick={() => setShowAModal(false)}
            onAcceptNoClick={() => setShowAModal(false)}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showReModal ? (
          <RejectModal
            isRMOpen={showReModal}
            onCancelReject={() => setShowReModal(false)}
            onSubmitReject={(comment, reasonid) =>
              onSubmitRejectModal(comment, reasonid)
            }
            rejectDrpDwnList={props.rejectDrpDwnList}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showRejSModal ? (
          // <RejectSuccessModal
          //   isRejectConfOpen={showRejSModal}
          //   onOkClickRejSuccess={() => onCloseRejSModal()}
          // />
          <>
            <SweetAlert
              title={"Candidate status updated successfully!"}
              show={showRejSModal}
              type={"success"}
              onConfirm={() => onCloseRejSModal()}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {" "}
        {showSchdIntModal ? (
          <ScheduleInterviewModal
            candidateData={props.data}
            durationOptions={props.durationOptions}
            postData={(e) => {
              getFormData(e);
            }}
            isOpen={showSchdIntModal}
            onClose={() => setShowSchdIntSModal(false)}
          />
        ) : (
          <></>
        )}
      </>      <>
        {openBDModal ? (
          <AssigneeAtsCandidate
            isOpen={openBDModal}
            atsCandidateId={atsCandidateId}
            isAssigned={isAssigned}
            assignedCompanyId={assignedCompanyId}
            assignedCompanyName={assignedCompanyName}
            assignmentStartDate={assignmentStartDate}
            assignmentEndDate={assignmentEndDate}
            onClose={() => onCloseBDModal()}
            onRefresh={handleRefreshData}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
