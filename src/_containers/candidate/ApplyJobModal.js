import { CheckboxFormGroup } from "_components/formComponents/CheckboxFormGroup";
import { NoticePeriod } from "_components/dropdownComponents/NoticePeriod";
import { InputFormGroup } from "_components/formComponents/InputFormGroup";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForJobActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import "./candidate.scss";
import { FiMapPin } from "react-icons/fi";
import logo from "../../assets/utils/images/panther-logo.png";

import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Form,
  Row,
  Col,
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
      noticeperiodid: event.target.elements.noticePeriod.value,
      isrelocate: event.target.elements.relocate.checked,
      isvideoconference: event.target.elements.isvideoconference.checked,
      isactive: true,
      currentUserId: 1,
    };
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
                <CheckboxFormGroup
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
                <CheckboxFormGroup
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
      <SweetAlert
        title="Applied Successfully"
        show={showSuccess}
        type="success"
        onConfirm={() => setShowSuccess(false)}
      />
    </>
  );
}
