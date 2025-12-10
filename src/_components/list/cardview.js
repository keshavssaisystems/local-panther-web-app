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
  BsCheckCircle
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

import { SNACKBAR_TYPES, SNACKBAR_POSITION, CANDIDATE_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export const CandidateCardView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const [showSchdIntModal, setShowSchdIntSModal] = useState(false);
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
        props?.data?.recommendedationCandidateShortList[0].candidateid
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
  }

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
                    <b>Work Experience</b>
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
              </>)}
          </Row>
        </CardBody>
        <CardFooter className="auto-margin">
          <Row noGutters>
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
                >
                  <BsCheckCircle ></BsCheckCircle >  Present
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
      </>
    </>
  );
};
