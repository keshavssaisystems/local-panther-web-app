import React, { useState } from "react";
import { Card, CardBody, CardFooter, Row, Col, Button } from "reactstrap";
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,
  IoIosBriefcase,
  IoIosStar,
  IoIosAlbums,
  IoIosTime,
  IoIosLocate,
} from "react-icons/io";
import { AcceptModal } from "_components/modal/acceptmodal";
import { RejectModal } from "_components/modal/rejectmodal";
import { RejectSuccessModal } from "_components/modal/rejectsuccessmodal";

export const CandidateCardView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const onAcceptClick = () => {
    setShowAModal(true);
  };

  const onRejectClick = () => {
    setShowReModal(true);
  };

  const onSubmitRejectModal = (evt) => {
    setShowReModal(false);
    setShowRejSModal(true);
  };
  return (
    <>
      <Card className="main-card mb-3">
        <CardBody>
          <Row>
            <Col className="col-12">
              <span className="pe-2">
                <IoIosAlbums fontSize={"16px"}></IoIosAlbums>
              </span>
              {props?.data?.jobtitle}
            </Col>

            {/* <Col className="col-12">
              <IoIosContact fontSize={"16px"}></IoIosContact>
              <b>Name:</b>
              {props?.data?.firstname + "  " + props?.data?.lastname}
            </Col> */}
            <Col className="col-12">
              <span className="pe-2">
                <IoIosLocate fontSize={"16px"}></IoIosLocate>
              </span>
              {props?.data?.locationaddress}
            </Col>
            <Col className="col-12">
              <span className="pe-2">
                <IoIosBriefcase fontSize={"16px"}></IoIosBriefcase>
              </span>

              {props?.data?.email}
            </Col>
            <Col className="col-12">
              <span className="pe-2">
                <IoIosStar fontSize={"16px"}></IoIosStar>
              </span>

              {props?.data?.primaryskills}
              {props?.data?.secondaryskills}
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="auto-margin">
          <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
            {/* <Col>
              <Button
                title="accept"
                className=" btn-icon"
                color="success"
                onClick={() => onAcceptClick()}
              >
                <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
              </Button>
            </Col> */}
            <Col>
              <Button title="liked" className=" btn-icon" color="primary">
                <IoIosThumbsUp fontSize={"24px"}></IoIosThumbsUp>
              </Button>
            </Col>
            <Col>
              <Button title="maybe" className=" btn-icon" color="primary">
                <IoIosHelp fontSize={"24px"}></IoIosHelp>
              </Button>
            </Col>
            <Col>
              <Button
                title="reject"
                className="btn-icon"
                color="danger"
                onClick={() => onRejectClick()}
              >
                <IoIosClose fontSize={"24px"}></IoIosClose>
              </Button>
            </Col>

            <Col>
              <Button
                title="schedule"
                className="mb-2 me-2 btn-icon"
                color="primary"
              >
                <IoIosTime fontSize={"24px"}></IoIosTime>
              </Button>
            </Col>
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
            onSubmitReject={(evt) => onSubmitRejectModal(evt)}
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
            onOkClickRejSuccess={() => setShowRejSModal(false)}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
