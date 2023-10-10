import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  ButtonGroup,
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
      props.showSweetAlert({ title: res.payload.message, type: "success" });

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

  return (
    <>
      <Card className="main-card mb-3 cust-cand-card">
        <CardBody>
          <Row>
            <Col className="col-12">
              <Row>
                <Col className="col-10">
                  <div className="card-title">{props?.data?.jobtitle}</div>
                </Col>
                <Col className="col-2">
                  {/* <div className="card-title right-align">
                    {props?.data?.avgscore}
                  </div> */}
                </Col>
              </Row>
            </Col>

            {/* <Col>
              <div className="card-details-op">{props?.data?.jobtitle}</div>
            </Col> */}

            {/* <Col className="col-12">
              <IoIosContact fontSize={"16px"}></IoIosContact>
              <b>Name:</b>
              {props?.data?.firstname + "  " + props?.data?.lastname}
            </Col> */}
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <FiMapPin size={"16px"} />
                </span>
                {props?.data?.locationaddress}
              </p>
            </Col>

            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsBriefcase size={"16px"} />
                </span>
                <b>Work Experience: </b>
                {props?.data?.jobExperienceScheduleDtos &&
                props?.data?.jobExperienceScheduleDtos[0]?.experiencelevel
                  ? props?.data?.jobExperienceScheduleDtos[0]?.experiencelevel
                  : "-"}
                {/* Work Experience: {props?.data?.minexperience}-{" "}
                {props?.data?.maxexperience} Years */}
              </p>
            </Col>
            {/* <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsListStars size={"16px"} />
                </span>
                Education: {props?.data?.jobSkillDtos}
              </p>
            </Col> */}
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsMortarboard size={"16px"} />
                </span>
                <b>Education: </b> {returnEducation()}
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsStar size={"16px"} />
                </span>
                <b>Skills: </b> {returnSkills()}
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsAward size={"16px"} />
                </span>
                <b>Credentials: </b> {returnCert()}
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
                className="btn-icon"
                color="primary"
                size="sm"
                onClick={() => onActionClick("like")}
              >
                Like <BsHandThumbsUp></BsHandThumbsUp>
              </Button>

              <Button
                outline
                title="maybe"
                className="btn-icon"
                color="primary"
                size="sm"
                onClick={() => onActionClick("maybe")}
              >
                Maybe <BsQuestionCircle></BsQuestionCircle>
              </Button>

              <Button
                outline
                title="reject"
                className="btn-icon"
                color="primary"
                onClick={() => onRejectClick()}
                size="sm"
              >
                Reject <BsXCircle></BsXCircle>
              </Button>

              <Button
                outline
                title="schedule"
                className="btn-icon"
                color="primary"
                size="sm"
                onClick={() => onScheduleInterview()}
              >
                Schedule <BsClock />
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
