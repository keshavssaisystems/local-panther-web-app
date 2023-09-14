import { RadioButtonFormGroup } from "_components/formComponents/radioButtonFormGroup";
import { NoticePeriod } from "_components/dropdownComponents/NoticePeriod";
import { InputFormGroup } from "_components/formComponents/InputFormGroup";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForJobActions } from "_store";
import "./candidate.scss";
import { FiMapPin } from "react-icons/fi";
import logo from "../../assets/utils/images/panther-logo.png";
import successIcon from "../../assets/utils/images/success_icon.svg";

import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Form,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

export function ApplyJobModal({ jobId, heading, subHeading, location }) {
  const [modal, setModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  let applyForJob = null;
  const onApplyClick = (event) => {
    event.preventDefault();
    let data = {
      jobapplicationid: 0,
      jobid: jobId,
      candidateid: 35,
      applicationdate: new Date(),
      applicationstatus: "accepted",
      noticeperiodid:
        event.target.elements.noticePeriod.value === ""
          ? 0
          : event.target.elements.noticePeriod.value,
      isrelocate: event.target.elements.relocate.value === "yes" ? true : false,
      isvideoconference:
        event.target.elements.isvideoconference.value === "yes" ? true : false,
      isactive: true,
      currentUserId: 1,
      skills: event.target.elements.skills.value,
    };
    console.log(data);
    postApplyForJob(data);
    toggle();
    setShowSuccess(true);
  };
  const dispatch = useDispatch();
  const postApplyForJob = async function (formElement) {
    await dispatch(applyForJobActions.postApplyForJob(formElement));
  };
  applyForJob = useSelector((state) => state.applyForJob);
  // console.log(applyForJob);
  return (
    <>
      <Button
        color={"primary"}
        className="float-end apply-button"
        onClick={toggle}
      >
        {" "}
        Apply Now{" "}
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        fullscreen={"md"}
        size="lg"
        backdrop={"static"}
      >
        <ModalHeader>Apply for this job</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="menu-header-content btn-pane-right text-start mb-4 mt-0">
                <div>
                  <h5 className="menu-header-title job-title-details">
                    {heading}
                  </h5>
                  <p className="mb-0 mt-0">{subHeading}</p>
                  <p className="mb-0 mt-0">
                    <FiMapPin className="muted-icon" /> {location}
                  </p>
                </div>
              </div>
            </Col>
            <Col>
              <img src={logo} alt="logo" className="float-end display-logo" />
            </Col>
          </Row>
          <Form onSubmit={onApplyClick}>
            <InputFormGroup
              label={"Additional Skills"}
              name={"skills"}
              id={"skills"}
              type={"textarea"}
              placeholder={"Type to search for skill"}
              showValidation={false}
              validationMessage={"Please enter skills"}
              mandatory={false}
            />
            <Row>
              <Col>
                <RadioButtonFormGroup
                  id="isvideoconference"
                  name="isvideoconference"
                  label="Will you be available for video conference"
                />
              </Col>
              <Col>
                <NoticePeriod showValidation={false} validationMessage={""} />
              </Col>
            </Row>
            <Row>
              <Col>
                <RadioButtonFormGroup
                  id="relocate"
                  name="relocate"
                  label="Are you willing to Relocate?"
                />
              </Col>
              <Col></Col>
            </Row>
            <Button type="submit" className="float-end submit-button">
              {" "}
              Submit{" "}
            </Button>
            <Button
              color="dark"
              className="float-end cancel-button"
              onClick={toggle}
            >
              {" "}
              Cancel{" "}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={showSuccess}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3 mt-4">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center popup-message">
              Success!
            </div>
            <div className="mb-0">
              <p className="popup-message-content">
                You've successfully applied for the{" "}
                <b className="fw-semi-bold">{heading}</b> position at
                <b className="fw-semi-bold">{" " + subHeading}</b>. We
                appreciate your interest and will get back to you as soon as we
                can.
              </p>
            </div>
            <div className="popup-button-div-custom">
              <Row>
                <Col className="d-flex justify-content-center mb-4 ">
                  <Button
                    className="popup-button-custom"
                    onClick={() => setShowSuccess(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}
