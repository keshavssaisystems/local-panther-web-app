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
import { RejectSuccessModal } from "_components/modal/rejectsuccessmodal";
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
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import "./cardview.scss";
import { ProgressCircle } from "_components/common/progress";
import moment from "moment";
import customerIcons from "assets/utils/images/customer";
import { ScorePopup } from "./scorePopup";

export const CandidateCardView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const [showSchdIntModal, setShowSchdIntSModal] = useState(false);
  const dispatch = useDispatch();

  const onRejectClick = () => {
    setShowReModal(true);
  };

  const onSubmitRejectModal = async (reasonid, comment) => {
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
      setShowRejSModal(true);
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
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
      props.showSweetAlert({
        title: "Interview scheduled successfully!!!",
        type: "success",
      });

      props.updateList();
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
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
          {props.data.candidateQualificationsDtos.map((data) => {
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
                    ? `${moment(data.startdate).format("YYYY")} - Present`
                    : `${moment(data.startdate).format("YYYY")} - ${moment(
                        data.enddate
                      ).format("YYYY")}`}
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

  const onBuildResume = () => {
    if (props?.data?.recommendedationCandidateShortList?.length > 0) {
      props.onBuildResume(
        props?.data?.recommendedationCandidateShortList[0].candidateid
      );
    }
  };

  return (
    <>
      <Card className="main-card mb-3 cust-cand-card">
        <CardBody>
          <Row>
            <Col className="col-12">
              <Row>
                <Col className="col-9">
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
                <Col className="col-3">
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

                      <p style={{ overflow: "visible" }}>{returnCert()}</p>
                    </div>
                  </Col>
                </Row>
              </p>
            </Col>
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
                title="liked"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onActionClick("like")}
              >
                Like <BsHandThumbsUp></BsHandThumbsUp>
              </Button>

              <Button
                outline
                title="maybe"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onActionClick("maybe")}
              >
                Maybe <BsQuestionCircle></BsQuestionCircle>
              </Button>

              <Button
                outline
                title="reject"
                className="btn-icon mb-1"
                color="primary"
                onClick={() => onRejectClick()}
                size="sm"
              >
                Reject <BsXCircle></BsXCircle>
              </Button>

              <Button
                outline
                title="schedule"
                className="btn-icon mb-1"
                color="primary"
                size="sm"
                onClick={() => onScheduleInterview()}
              >
                <span>Schedule</span> <BsClock />
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
            onSubmitReject={(reason, comment) =>
              onSubmitRejectModal(reason, comment)
            }
            rejectDrpDwnList={props.rejectDrpDwnList}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showRejSModal ? (
          <RejectSuccessModal
            isRejectConfOpen={showRejSModal}
            onOkClickRejSuccess={() => onCloseRejSModal()}
          />
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
