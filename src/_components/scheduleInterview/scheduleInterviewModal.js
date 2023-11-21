import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Form,
  ModalHeader,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
  FormText,
} from "reactstrap";
import "./scheduledInterview.scss";
import InputMask from "react-input-mask";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";

export function ScheduleInterviewModal({
  candidateData,
  durationOptions,
  postData,
  isOpen = false,
  onClose,
}) {
  const [videoModeCheck, setVideoModeCheck] = useState(1);
  const [timeOption, setTimeOption] = useState([]);
  const [formatButton, setFormatButton] = useState(1);
  const [modal, setModal] = useState(false);
  const [scheduleDateValidation, setScheduleDateValidation] = useState(false);
  const [scheduleTimeValidation, setScheduleTimeValidation] = useState(false);
  const [durationValidation, setDurationValidation] = useState(false);
  const [videoLinkValidation, setVideoLinkValidation] = useState(false);
  const [interviewAddressValidation, setInterviewAddressValidation] =
    useState(false);
  const [scheduledDate, setScheduledDate] = useState();
  const toggle = () => {
    setModal(!modal);
  };
  const onRadioBtnClick = (term) => {
    setFormatButton(term);
  };
  const onVideoModeChange = (term) => {
    setVideoModeCheck(term);
  };
  useEffect(() => {
    getTimeArray();
  }, []);

  const getTimeArray = () => {
    let timeOptions = [];
    let meridiemArray = ["AM", "PM"];
    let interval = ["00", "15", "30", "45"];
    let hours = [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
    ];
    meridiemArray.forEach((meridiem) => {
      hours.forEach((term) => {
        interval.forEach((element) => {
          let timeData =
            meridiem === "PM" && term === "00"
              ? 12 + ":" + element + " " + meridiem
              : term + ":" + element + " " + meridiem;
          timeOptions.push(timeData);
        });
      });
    });
    setTimeOption(timeOptions);
  };
  const getFormValidation = (event) => {
    event.preventDefault();
    event.target.elements.scheduleDate.value === ""
      ? setScheduleDateValidation(true)
      : setScheduleDateValidation(false);
    event.target.elements.scheduleStartTime.value === ""
      ? setScheduleTimeValidation(true)
      : setScheduleTimeValidation(false);
    event.target.elements.duration.value === ""
      ? setDurationValidation(true)
      : setDurationValidation(false);
    formatButton === 1 &&
    event.target.elements.videoMode.value === "third-party-video" &&
    event.target.elements.videoLink.value === ""
      ? setVideoLinkValidation(true)
      : setVideoLinkValidation(false);
    formatButton === 3 && event.target.elements.interviewAddress.value === ""
      ? setInterviewAddressValidation(true)
      : setInterviewAddressValidation(false);
    if (
      event.target.elements.scheduleDate.value !== "" &&
      event.target.elements.scheduleStartTime.value !== "" &&
      event.target.elements.duration.value !== "" &&
      formatButton === 1 &&
      ((event.target.elements.videoMode.value === "third-party-video" &&
        event.target.elements.videoLink.value !== "") ||
        event.target.elements.videoMode.value === "in-app-video")
    ) {
      getFormData(event);
    }

    if (
      event.target.elements.scheduleDate.value !== "" &&
      event.target.elements.scheduleStartTime.value !== "" &&
      event.target.elements.duration.value !== "" &&
      formatButton === 3 &&
      event.target.elements.interviewAddress.value !== ""
    ) {
      getFormData(event);
    }

    if (
      event.target.elements.scheduleDate.value !== "" &&
      event.target.elements.scheduleStartTime.value !== "" &&
      event.target.elements.duration.value !== "" &&
      formatButton === 2
    ) {
      getFormData(event);
    }
  };
  const getFormData = (event) => {
    event.preventDefault();
    let scheduleDateUTC = moment(
      event.target.elements.scheduleDate.value +
        " " +
        event.target.elements.scheduleStartTime.value
    )
      .tz("Etc/UTC")
      .format("YYYY-MM-DD");
    let scheduleTimeUTC = moment(
      event.target.elements.scheduleDate.value +
        " " +
        event.target.elements.scheduleStartTime.value
    )
      .tz("Etc/UTC")
      .format("HH:mm:ss");
    let data = {
      scheduleinterviewid: 0,
      jobid: candidateData.jobid,
      candidateid: candidateData.candidateid,
      scheduledate: scheduleDateUTC,
      starttime: scheduleTimeUTC,
      durationid: Number(event.target.elements.duration.value),
      format:
        formatButton === 1
          ? "Video"
          : formatButton === 2
          ? "Phone"
          : "In-person",
      isappvideocall:
        formatButton === 1
          ? event.target.elements.videoMode.value === "third-party-video"
            ? false
            : true
          : false,
      videolink:
        formatButton === 1 &&
        event.target.elements.videoMode.value === "third-party-video"
          ? event.target.elements.videoLink.value
          : "",
      interviewAddress:
        formatButton === 3 ? event.target.elements.interviewAddress.value : "",
      messagetocandidate: event.target.elements.message.value,
      intervieweremailids: event.target.elements.hmEmails.value,
      textremaindernumbers: event.target.elements.phoneNo.value,
      isactive: true,
      currentUserId: Number(localStorage.getItem("userId")),
    };
    postData(data);
    onClose();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        fullscreen={"lg"}
        size="xl"
        backdrop={"static"}
        toggle={toggle}
        className="schedule-modal"
        onClosed={() => onClose()}
      >
        <ModalHeader toggle={() => onClose()}>Schedule interview</ModalHeader>
        <ModalBody className="pt-4">
          <Form onSubmit={(e) => getFormValidation(e)}>
            <Col md="12">
              <Row>
                <Col md={4}>
                  <div className="detail-padding">
                    <h6 className="mb-0 heading-custom">Candidate</h6>
                    <p className="mb-0 mt-1 mr-1">
                      {candidateData.candidatename === undefined
                        ? candidateData.firstname + " " + candidateData.lastname
                        : candidateData.candidatename}
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="detail-padding">
                    <h6 className="mb-0 heading-custom">Job title</h6>
                    <p className="mb-0 mt-1 mr-1">{candidateData.jobtitle}</p>
                  </div>
                </Col>
                <Col></Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="scheduleDate" className="fw-semi-bold">
                      Date <span className="required-star">*</span>
                    </Label>
                    <DatePicker
                      className="form-control"
                      selected={scheduledDate}
                      onChange={(date) => {
                        setScheduledDate(date);
                        setScheduleDateValidation(false);
                      }}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="Eg. mm/dd/yyyy"
                      name={"scheduleDate"}
                    />
                    {scheduleDateValidation === true && (
                      <FormText color="danger">Please enter date</FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="scheduleStartTime" className="fw-semi-bold">
                      Start time <span className="required-star">* </span>
                    </Label>
                    <Input
                      type="select"
                      name="scheduleStartTime"
                      id="scheduleStartTime"
                      invalid={scheduleTimeValidation}
                      onChange={() => setScheduleTimeValidation(false)}
                    >
                      <option key={0} value={""}>
                        Select start time
                      </option>
                      {timeOption.length > 0 &&
                        timeOption.map((options) => (
                          <option key={options} value={options}>
                            {options}{" "}
                          </option>
                        ))}
                    </Input>
                    {scheduleTimeValidation === true && (
                      <FormText color="danger">
                        Please select start time
                      </FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="duration" className="fw-semi-bold">
                      Duration <span className="required-star">* </span>
                    </Label>
                    <Input
                      type="select"
                      name="duration"
                      id="duration"
                      invalid={durationValidation}
                      onChange={() => setDurationValidation(false)}
                    >
                      <option key={0} value={""}>
                        Select duration
                      </option>
                      {durationOptions?.length > 0 &&
                        durationOptions.map((data) => {
                          return (
                            <option value={data.id} key={data.id}>
                              {data.name}
                            </option>
                          );
                        })}
                    </Input>
                    {durationValidation === true && (
                      <FormText color="danger">Please select duration</FormText>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="exampleAddress" className="fw-semi-bold">
                  Format <span className="required-star">* </span>
                </Label>
                <div>
                  <ButtonGroup>
                    <Button
                      name="format"
                      color={formatButton === 1 ? "success" : "primary"}
                      value={"Video"}
                      onClick={() => onRadioBtnClick(1)}
                      active={formatButton === 1}
                    >
                      Video
                    </Button>
                    <Button
                      name="format"
                      color={formatButton === 2 ? "success" : "primary"}
                      value={"Phone"}
                      onClick={() => onRadioBtnClick(2)}
                      active={formatButton === 2}
                    >
                      Phone
                    </Button>
                    <Button
                      name="format"
                      color={formatButton === 3 ? "success" : "primary"}
                      value={"In-person"}
                      onClick={() => onRadioBtnClick(3)}
                      active={formatButton === 3}
                    >
                      In-person
                    </Button>
                  </ButtonGroup>
                </div>
              </FormGroup>
              {formatButton === 1 && (
                <FormGroup>
                  <Row>
                    <Col md={6}>
                      <Input
                        type="radio"
                        name="videoMode"
                        id="appVideoCall"
                        value={"in-app-video"}
                        onClick={() => onVideoModeChange(0)}
                      />{" "}
                      <Label for="appVideoCall" className="fw-semi-bold">
                        App video call
                      </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Input
                        type="radio"
                        name="videoMode"
                        id="thirdPartyVideo"
                        value={"third-party-video"}
                        defaultChecked
                        onClick={() => onVideoModeChange(1)}
                        onChange={() => onVideoModeChange(1)}
                      />{" "}
                      <Label for="thirdPartyVideo" className="fw-semi-bold">
                        Third-party video conferencing
                      </Label>
                    </Col>
                  </Row>
                </FormGroup>
              )}
              {formatButton === 1 && videoModeCheck === 1 && (
                <FormGroup>
                  <Label for="videoLink" className="fw-semi-bold">
                    Paste video link <span className="required-star">* </span>
                  </Label>
                  <Input
                    type="text"
                    name="videoLink"
                    id="videoLink"
                    placeholder="Enter video link"
                    invalid={videoLinkValidation}
                    onChange={() => setVideoLinkValidation(false)}
                  />
                  {videoLinkValidation === true && (
                    <FormText color="danger">Please enter video link</FormText>
                  )}
                </FormGroup>
              )}
              {formatButton === 3 && (
                <FormGroup>
                  <Label for="interviewAddress" className="fw-semi-bold">
                    Interview address <span className="required-star">* </span>
                  </Label>
                  <Input
                    type="text"
                    name="interviewAddress"
                    id="interviewAddress"
                    placeholder="Enter interview address"
                    invalid={interviewAddressValidation}
                    onChange={() => setInterviewAddressValidation(false)}
                  />
                  {interviewAddressValidation === true && (
                    <FormText color="danger">
                      Please enter interview address
                    </FormText>
                  )}
                </FormGroup>
              )}
              <FormGroup>
                <Label for="message" className="fw-semi-bold">
                  Message to candidate
                </Label>
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  placeholder="Enter message to candidate"
                />
              </FormGroup>
              <FormGroup>
                <Label for="hmEmails" className="fw-semi-bold">
                  Add Interviewers
                </Label>
                <Input
                  type="textarea"
                  name="hmEmails"
                  id="hmEmails"
                  placeholder="Add hiring managers or other interviewers - enter emails seperated by comma"
                />
              </FormGroup>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label for="phoneNo" className="fw-semi-bold">
                      Get text reminder for interviews
                    </Label>
                    <InputMask
                      className="form-control"
                      mask="(999)-999-9999"
                      maskChar={null}
                      name="phoneNo"
                      id="phoneNo"
                      placeholder="Eg: (987)-654-3210"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <div className="divider" />
            <div className="d-block text-center">
              <Button size="lg" color="primary" type="submit">
                Send interview request
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
