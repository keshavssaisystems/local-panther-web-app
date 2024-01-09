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
  FormText,
} from "reactstrap";
import "./scheduledInterview.scss";
import moment from "moment-timezone";
import { getTimezoneDateTime } from "_helpers/helper";
import DatePicker from "react-datepicker";

export function UpdateScheduleInterviewModal({
  interviewData,
  durationOptions,
  postData,
  isOpen = false,
  onClose,
}) {
  const newdate = new Date(
    getTimezoneDateTime(
      moment(interviewData?.scheduledate),
      "YYYY-MM-DD HH:mm:ss"
    )
  );
  const [timeOption, setTimeOption] = useState([]);
  const [modal, setModal] = useState(false);
  const [scheduleDateValidation, setScheduleDateValidation] = useState(false);
  const [scheduleTimeValidation, setScheduleTimeValidation] = useState(false);
  const [durationValidation, setDurationValidation] = useState(false);
  const [videoLinkValidation, setVideoLinkValidation] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(newdate);

  const [dateChange, setDateChange] = useState(false);
  const toggle = () => {
    setModal(!modal);
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
    if (
      event.target.elements.scheduleDate.value !== "" &&
      event.target.elements.scheduleStartTime.value !== "" &&
      event.target.elements.duration.value !== ""
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
      scheduleinterviewid:
        interviewData?.scheduledInterviewDtos &&
        interviewData?.scheduledInterviewDtos?.length > 0
          ? interviewData?.scheduledInterviewDtos[0].scheduleinterviewid
          : interviewData?.scheduleinterviewid,
      jobid: interviewData?.jobid,
      candidateid: interviewData?.candidateid,
      scheduledate: scheduleDateUTC,
      starttime: scheduleTimeUTC,
      durationid: Number(event.target.elements.duration.value),
      format: interviewData?.format,
      isappvideocall: interviewData?.isappvideocall,
      videolink:
        event?.target?.elements?.videoLink?.value === undefined
          ? ""
          : event?.target?.elements?.videoLink?.value,
      interviewAddress: interviewData?.interviewaddress,
      messagetocandidate: interviewData?.messagetocandidate,
      intervieweremailids: interviewData?.intervieweremailids,
      textremaindernumbers: interviewData?.textremaindernumbers,
      isactive: true,
      currentUserId: Number(localStorage.getItem("userId")),
    };
    postData(data);
    onClose();
    setDateChange(false);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        fullscreen={"lg"}
        size="lg"
        backdrop={"static"}
        toggle={toggle}
        className="schedule-modal"
        onClosed={() => {
          onClose();
          setDateChange(false);
        }}
      >
        <ModalHeader
          toggle={() => {
            onClose();
            setDateChange(false);
          }}
        >
          {" "}
          Reschedule Interview
        </ModalHeader>
        <ModalBody className="pt-4">
          <Form onSubmit={(e) => getFormValidation(e)}>
            <Col md="12">
              <Row>
                <Col md={4}>
                  <div className="detail-padding">
                    <h6 className="mb-0 heading-custom">Candidate</h6>
                    <p className="mb-0 mt-1 mr-1">
                      {interviewData?.candidatename === undefined
                        ? interviewData?.firstname +
                          " " +
                          interviewData?.lastname
                        : interviewData?.candidatename}
                    </p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="detail-padding">
                    <h6 className="mb-0 heading-custom">Job title</h6>
                    <p className="mb-0 mt-1 mr-1">{interviewData?.jobtitle}</p>
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
                      selected={
                        dateChange === false
                          ? new Date(
                              getTimezoneDateTime(
                                moment(
                                  interviewData?.scheduledInterviewDtos &&
                                    interviewData?.scheduledInterviewDtos
                                      ?.length > 0
                                    ? interviewData?.scheduledInterviewDtos[0]
                                        .scheduledate
                                    : interviewData?.scheduledate
                                ),
                                "YYYY-MM-DD HH:mm:ss"
                              )
                            )
                          : scheduledDate
                      }
                      onChange={(date) => {
                        setScheduledDate(date);
                        setDateChange(true);
                        setScheduleDateValidation(false);
                      }}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="Eg. MM/DD/YYYY"
                      name={"scheduleDate"}
                      minDate={new Date()}
                    />
                    {/* <Input
                      type="date"
                      name="scheduleDate"
                      id="scheduleDate"
                      placeholder="Eg. MM/DD/YYYY"
                      invalid={scheduleDateValidation}
                      defaultValue={}
                      onChange={}
                    /> */}
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
                          <option
                            key={options}
                            value={options}
                            selected={
                              String(options) ===
                              String(
                                getTimezoneDateTime(
                                  moment(
                                    moment(
                                      interviewData?.scheduledInterviewDtos &&
                                        interviewData?.scheduledInterviewDtos
                                          ?.length > 0
                                        ? interviewData
                                            ?.scheduledInterviewDtos[0]
                                            .scheduledate
                                        : interviewData?.scheduledate
                                    ).format("YYYY-MM-DD") +
                                      " " +
                                      (interviewData?.scheduledInterviewDtos &&
                                      interviewData?.scheduledInterviewDtos
                                        ?.length > 0
                                        ? interviewData
                                            ?.scheduledInterviewDtos[0]
                                            .starttime
                                        : interviewData?.starttime)
                                  ).format("YYYY-MM-DD hh:mm A"),
                                  "hh:mm A"
                                )
                              )
                            }
                          >
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
                            <option
                              value={data.id}
                              key={data.id}
                              selected={
                                data.id ===
                                Number(
                                  interviewData?.scheduledInterviewDtos &&
                                    interviewData?.scheduledInterviewDtos
                                      ?.length > 0
                                    ? interviewData?.scheduledInterviewDtos[0]
                                        ?.durationid
                                    : interviewData?.durationid
                                )
                              }
                            >
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
              <div className="detail-padding">
                <h6 className="mb-0 heading-custom">Format</h6>
                <p className="mb-0 mt-1 mr-1">
                  {interviewData?.scheduledInterviewDtos &&
                  interviewData?.scheduledInterviewDtos?.length > 0 &&
                  interviewData?.scheduledInterviewDtos[0].format !== ""
                    ? interviewData?.scheduledInterviewDtos[0]?.format
                    : interviewData?.format === ""
                    ? "-"
                    : interviewData?.format}
                </p>
              </div>
              {interviewData?.format === "Video" && (
                <div className="detail-padding">
                  <h6 className="mb-0 heading-custom">Mode</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {interviewData?.scheduledInterviewDtos &&
                    interviewData?.scheduledInterviewDtos?.length > 0 &&
                    interviewData?.scheduledInterviewDtos[0]?.isappvideocall ===
                      true
                      ? "App video call"
                      : interviewData?.isappvideocall === true
                      ? "App video call"
                      : "Third-party video conferencing"}
                  </p>
                </div>
              )}
              {interviewData?.format === "Video" &&
                interviewData?.isappvideocall === false && (
                  <FormGroup>
                    <Label for="videoLink" className="fw-semi-bold">
                      Paste video link <span className="required-star">* </span>
                    </Label>
                    <Input
                      type="text"
                      name="videoLink"
                      id="videoLink"
                      placeholder="Enter video link"
                      defaultValue={
                        interviewData?.scheduledInterviewDtos &&
                        interviewData?.scheduledInterviewDtos?.length > 0
                          ? interviewData?.scheduledInterviewDtos[0]?.videolink
                          : interviewData?.videolink
                      }
                      invalid={videoLinkValidation}
                      onChange={() => setVideoLinkValidation(false)}
                    />
                    {videoLinkValidation === true && (
                      <FormText color="danger">
                        Please enter video link
                      </FormText>
                    )}
                  </FormGroup>
                )}
              {interviewData?.format === "In-person" && (
                <div className="detail-padding">
                  <h6 className="mb-0 heading-custom">Interview address</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {interviewData?.scheduledInterviewDtos &&
                    interviewData?.scheduledInterviewDtos?.length > 0 &&
                    interviewData?.scheduledInterviewDtos[0]
                      .interviewaddress !== ""
                      ? interviewData?.scheduledInterviewDtos[0]
                          .interviewaddress
                      : interviewData?.interviewaddress === ""
                      ? "-"
                      : interviewData?.interviewaddress}
                  </p>
                </div>
              )}
              <div className="detail-padding">
                <h6 className="mb-0 heading-custom">Message to candidate</h6>
                <p className="mb-0 mt-1 mr-1">
                  {interviewData?.scheduledInterviewDtos &&
                  interviewData?.scheduledInterviewDtos?.length > 0 &&
                  interviewData?.scheduledInterviewDtos[0]
                    .messagetocandidate !== ""
                    ? interviewData?.scheduledInterviewDtos[0]
                        .messagetocandidate
                    : interviewData?.messagetocandidate === ""
                    ? "-"
                    : interviewData?.messagetocandidate}
                </p>
              </div>
              <div className="detail-padding">
                <h6 className="mb-0 heading-custom">Interviewers</h6>
                <p className="mb-0 mt-1 mr-1">
                  {interviewData?.scheduledInterviewDtos &&
                  interviewData?.scheduledInterviewDtos?.length > 0 &&
                  interviewData?.scheduledInterviewDtos[0]
                    .intervieweremailids !== ""
                    ? interviewData?.scheduledInterviewDtos[0]
                        .intervieweremailids
                    : interviewData?.intervieweremailids === ""
                    ? "-"
                    : interviewData?.intervieweremailids}
                </p>
              </div>
              <div className="detail-padding">
                <h6 className="mb-0 heading-custom">
                  Get text reminder for interviews
                </h6>
                <p className="mb-0 mt-1 mr-1">
                  {interviewData?.scheduledInterviewDtos &&
                  interviewData?.scheduledInterviewDtos?.length > 0 &&
                  interviewData?.scheduledInterviewDtos[0]
                    .textremaindernumbers !== ""
                    ? interviewData?.scheduledInterviewDtos[0]
                        .textremaindernumbers
                    : interviewData?.textremaindernumbers === ""
                    ? "-"
                    : interviewData?.textremaindernumbers}
                </p>
              </div>
            </Col>
            <div className="divider" />
            <div className="d-block text-center">
              <Button size="lg" color="primary" type="submit">
                Update interview request
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
