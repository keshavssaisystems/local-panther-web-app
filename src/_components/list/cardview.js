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
  BsListStars,
  BsAward,
  BsHandThumbsUp,
  BsStar,
  BsQuestionCircle,
  BsXCircle,
  BsClock,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { candidateListsActions } from "../../_containers/customer/candidatelists/candidatelists.slice";
import "./cardview.scss";

export const CandidateCardView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const dispatch = useDispatch();
  const onAcceptClick = () => {
    setShowAModal(true);
  };

  const onRejectClick = () => {
    setShowReModal(true);
  };

  const onSubmitRejectModal = async (reasonid, comment) => {
    let userId = localStorage.getItem("userId");
    let res = await dispatch(
      candidateListsActions.putRejectCandidate({
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
  return (
    <>
      <Card className="main-card mb-3 cust-cand-card">
        <CardBody>
          <Row>
            <Col className="col-12">
              <div className="card-title">{props?.data?.jobtitle}</div>
            </Col>

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
                Work Experience: {props?.data?.minexperience}-{" "}
                {props?.data?.maxexperience} Years
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsListStars size={"16px"} />
                </span>
                Education: {props?.data?.jobSkillDtos}
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsStar size={"16px"} />
                </span>
                Skills: {props?.data?.jobSkillDtos}
              </p>
            </Col>
            <Col className="col-12">
              <p className="card-details">
                <span className="pe-2">
                  <BsAward size={"16px"} />
                </span>
                Credentails MCP
              </p>
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="auto-margin">
          <Row noGutters>
            <ButtonGroup size="sm">
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
              >
                Schedule
                <BsClock />
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
    </>
  );
};
