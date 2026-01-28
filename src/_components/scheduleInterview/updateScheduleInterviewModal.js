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
  ButtonGroup
} from "reactstrap";
import "./scheduledInterview.scss";
import moment from "moment-timezone";
import { getTimezoneDateTime } from "_helpers/helper";
import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { customerCandidateListsActions } from "_store";

import InputMask from "react-input-mask";
export function UpdateScheduleInterviewModal({
  interviewData,
  durationOptions,
  postData,
  isOpen = false,
  onClose,
}) {
  console.log(interviewData?.scheduledate)
  const newdate = new Date(
    getTimezoneDateTime(
      moment(interviewData?.scheduledate),
      "YYYY-MM-DD HH:mm:ss"
    )

  );
  // const slotStartTime = interviewData?.scheduledInterviewDtos?.length > 0 ? interviewData?.scheduledInterviewDtos[0].starttime : interviewData?.starttime;



  const [timeOption, setTimeOption] = useState([]);
  const [modal, setModal] = useState(false);
  const [scheduleDateValidation, setScheduleDateValidation] = useState(false);
  const [scheduleTimeValidation, setScheduleTimeValidation] = useState(false);
  const [durationValidation, setDurationValidation] = useState(false);
  const [videoLinkValidation, setVideoLinkValidation] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(newdate);
  const [dateChange, setDateChange] = useState(false);
  const [slotDurationOptions, setSlotDurationOptions] = useState([]);
  const [slotTime, setSlotTime] = useState();

  const [formatButton, setFormatButton] = useState();
  const dispatch = useDispatch();

  const toggle = () => {
    setModal(!modal);
  };
  useEffect(() => {
    if (isOpen) {
      setFormatButton(interviewData?.format === "Video" ? 1 : interviewData?.format === "Phone" ? 2 : interviewData?.format === "In-person" ? 3 : 1);
      setHmEmails(interviewData?.intervieweremailids);
      setMessage(interviewData?.messagetocandidate);
      setPhoneNo(interviewData?.textremaindernumbers);
      setVideoLink(interviewData?.videolink);
      setInterviewAddress(interviewData?.textremaindernumbers);
      setVideoMode(interviewData?.isappvideocall);
      setVideoModeCheck(interviewData?.isappvideocall === true ? 0 : 1);
      getTimeArray();
      let date = new Date(
        getTimezoneDateTime(
          interviewData?.scheduledInterviewDtos &&
            interviewData?.scheduledInterviewDtos
              ?.length > 0
            ? interviewData?.scheduledInterviewDtos[0].scheduledate.slice(
              0,
              11
            ) +
            interviewData?.scheduledInterviewDtos[0]
              ?.starttime
            : interviewData?.scheduledate?.slice(0, 11) +
            interviewData?.starttime,
          "YYYY-MM-DD HH:mm:ss"
        )
      );


      let t = getTimezoneDateTime(
        moment(
          moment(interviewData?.scheduledInterviewDtos && interviewData?.scheduledInterviewDtos?.length > 0
            ? interviewData?.scheduledInterviewDtos[0].scheduledate : interviewData?.scheduledate?.slice(0, 11) + interviewData?.starttime).format("YYYY-MM-DD") +
          " " +
          (interviewData?.scheduledInterviewDtos && interviewData?.scheduledInterviewDtos?.length > 0 ? interviewData?.scheduledInterviewDtos[0].starttime : interviewData?.starttime)
        ).format("YYYY-MM-DD hh:mm A"),
        "HH:mm:ss"
      );
      setSlotTime(t);
      console.log(t);
      let event = {
        target: {
          value: slotTime// or any valid time string
        }
      };

      date = date == undefined ? newdate : date;

      onScheduleDateChange(date);
      // onScheduleDateChange(date).then(() => {
      //   getSlotDuration(event);
      // });
    }
  }, [isOpen]);
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

  // const onScheduleDateChangeDuration = async () => {
  //   let slotSeletedTime = slotTime;
  //   let event = {
  //     target: {
  //       value: interviewData?.scheduledInterviewDtos?.length > 0 ? interviewData?.scheduledInterviewDtos[0].starttime : interviewData?.starttime // or any valid time string
  //     }
  //   };
  //   getSlotDuration(event);
  // }


  const onScheduleDateChange = async (date) => {
    let data = {
      scheduleDateUTC: moment(date).format("YYYY-MM-DD"),
      scheduleInterviewId: interviewData?.scheduledInterviewDtos && interviewData?.scheduledInterviewDtos?.length > 0 ? interviewData?.scheduledInterviewDtos[0].scheduleinterviewid : interviewData?.scheduleinterviewid
    }
    let res = await dispatch(
      customerCandidateListsActions.getInterviewSlots(data)
    );
    const updatedSlots = res?.payload?.data ?? [];
    setTimeOption(updatedSlots);
    console.log(updatedSlots);
    let event = {
      target: {
        value: slotTime// or any valid time string
      }
    };
    getUpdatedSlotDuration(event, updatedSlots);
  };

  const convertTo12Hour = (time24) => {
    if (time24 == undefined)
      return;
    const [hourStr, minute, second] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const getSlotDuration = (e) => {
    let time = 0;
    for (let i = 0; i < timeOption.length; i++) {
      if (moment(timeOption[i].slottime, "HH:mm:ss").toDate() >= moment(e.target.value, "HH:mm:ss").toDate()) {
        if (!timeOption[i].isavailable) {
          time = timeOption[i].slottime;
          break;
        }
      }
    }
    let diff = time != 0 ? subtractTimes(time, e.target.value) : 120;
    let durations = durationOptions.filter(v => v.name.replaceAll(' min', '') <= diff);
    setSlotDurationOptions(durations);
  }

  const getUpdatedSlotDuration = (e, updatedSlots) => {
    let time = 0;
    for (let i = 0; i < updatedSlots.length; i++) {
      if (moment(updatedSlots[i].slottime, "HH:mm:ss").toDate() >= moment(e.target.value, "HH:mm:ss").toDate()) {
        if (!updatedSlots[i].isavailable) {
          time = updatedSlots[i].slottime;
          break;
        }
      }
    }
    let diff = time !== 0 ? subtractTimes(time, e.target.value) : 120;
    let durations = durationOptions.filter(v => v.name.replaceAll(' min', '') <= diff);
    setSlotDurationOptions(durations);
  }

  const subtractTimes = (t1, t2) => {
    const [h1, m1, s1] = t1.split(":").map(Number);
    const [h2, m2, s2] = t2.split(":").map(Number);
    const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
    const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;
    const diff = totalSeconds1 - totalSeconds2;
    const minutes = Math.floor((diff) / 60);

    return minutes;
  }

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
      format: formatButton === 1 ? "Video" : formatButton === 2 ? "Phone" : "In-person",
      isappvideocall: formatButton === 1 ? event.target.elements.videoMode.value === "third-party-video" ? false : true : false,
      videolink: formatButton === 1 && event.target.elements.videoMode.value === "third-party-video" ? event.target.elements.videoLink.value : "",
      interviewAddress: formatButton === 3 ? event.target.elements.interviewAddress.value : "",
      messagetocandidate: event.target.elements.message.value,
      intervieweremailids: event.target.elements.hmEmails.value,
      textremaindernumbers: event.target.elements.phoneNo.value,
      // format: interviewData?.format,
      //isappvideocall: interviewData?.isappvideocall,
      //videolink: event?.target?.elements?.videoLink?.value === undefined ? "" : event?.target?.elements?.videoLink?.value,
      //interviewAddress: interviewData?.interviewaddress,
      //messagetocandidate: interviewData?.messagetocandidate,
      //intervieweremailids: interviewData?.intervieweremailids,
      //textremaindernumbers: interviewData?.textremaindernumbers,
      isactive: true,
      currentUserId: Number(localStorage.getItem("userId")),
    };
    postData(data);
    onClose();
    setDateChange(false);
  };
  console.log(interviewData);



  const [interviewAddressValidation, setInterviewAddressValidation] = useState(false);
  const [videoModeCheck, setVideoModeCheck] = useState(0);
  const [hmEmails, setHmEmails] = useState('');
  const [phoneNo, setPhoneNo] = useState();
  const [message, setMessage] = useState();
  const [interviewAddress, setInterviewAddress] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoMode, setVideoMode] = useState();
  const onRadioBtnClick = (term) => {
    setFormatButton(term);
  };
  const onVideoModeChange = (term) => {
    setVideoModeCheck(term);
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
                              interviewData?.scheduledInterviewDtos &&
                                interviewData?.scheduledInterviewDtos
                                  ?.length > 0
                                ? interviewData?.scheduledInterviewDtos[0].scheduledate.slice(
                                  0,
                                  11
                                ) +
                                interviewData?.scheduledInterviewDtos[0]
                                  ?.starttime
                                : interviewData?.scheduledate?.slice(0, 11) +
                                interviewData?.starttime,
                              "YYYY-MM-DD HH:mm:ss"
                            )
                          )
                          : scheduledDate
                      }
                      onChange={(date) => {
                        setScheduledDate(date);
                        setDateChange(true);
                        setScheduleDateValidation(false);
                        onScheduleDateChange(date);
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
                      onChange={(time) => { setScheduleTimeValidation(false); getSlotDuration(time); setSlotTime(time.target.value) }}
                    >
                      <option key={0} value={""}>
                        Select start time
                      </option>
                      {timeOption.length > 0 &&
                        timeOption.map((options) => (
                          <option
                            key={options.slottime}
                            value={options.slottime} disabled={!options.isavailable}
                            selected={
                              String(convertTo12Hour(options.slottime)) ===
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
                                        : interviewData?.scheduledate?.slice(
                                          0,
                                          11
                                        ) + interviewData?.starttime
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
                            {convertTo12Hour(options.slottime)}{" "}
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
                      {slotDurationOptions?.length > 0 &&
                        slotDurationOptions.map((data) => {
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

                <Col md={12}>
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
                            defaultChecked
                            value={"in-app-video"}
                            checked={videoMode === true}
                            onClick={() => { onVideoModeChange(0); setVideoMode(true) }}
                          />{" "}
                          <Label for="appVideoCall" className="fw-semi-bold">
                            Built In app
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
                            checked={videoMode === false}
                            onClick={() => { onVideoModeChange(1); setVideoMode(false) }}
                            onChange={() => { onVideoModeChange(1); setVideoMode(false) }}
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
                        value={videoLink}
                        onChange={(e) => { setVideoLinkValidation(false); setVideoLink(e.target.value) }}
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
                        value={interviewAddress}
                        onChange={(e) => { setInterviewAddressValidation(false); setInterviewAddress(e.target.value) }}
                      />
                      {interviewAddressValidation === true && (
                        <FormText color="danger">
                          Please enter interview address
                        </FormText>
                      )}
                    </FormGroup>
                  )}
                </Col>
                <Col >
                  <FormGroup>
                    <Label for="message" className="fw-semi-bold">
                      Message to candidate
                    </Label>
                    <Input
                      type="textarea"
                      name="message"
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
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
                      value={hmEmails}
                      onChange={(e) => setHmEmails(e.target.value)}
                      placeholder="Add hiring managers or other interviewers - enter emails seperated by comma"
                    />
                  </FormGroup>
                  <FormGroup  style={{ display: 'none' }}>
                    <Label for="phoneNo" className="fw-semi-bold">
                      Get text reminder for interviews
                    </Label>
                    <InputMask
                      className="form-control"
                      mask="(999)-999-9999"
                      maskChar={null}
                      name="phoneNo"
                      id="phoneNo"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      placeholder="Eg: (987)-654-3210"
                    />
                  </FormGroup>
                </Col>
              </Row>
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
