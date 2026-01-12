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
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { customerCandidateListsActions } from "_store";
import { use } from "react";
import { getTimezoneDateTime } from "_helpers/helper";
export function OfflineInterviewModal({
  candidateData,
  durationOptions,
  postData,
  isOpen = false,
  onClose,
  type,
  loading
}) {
  const [videoModeCheck, setVideoModeCheck] = useState(0);
  const [timeOption, setTimeOption] = useState([]);
  const [formatButton, setFormatButton] = useState(1);
  const [modal, setModal] = useState(false);
  const [scheduleDateValidation, setScheduleDateValidation] = useState(false);
  const [scheduleTimeValidation, setScheduleTimeValidation] = useState(false);
  const [interviewStatusValidation, setInterviewStatusValidation] = useState(false);
  const [scheduledDate, setScheduledDate] = useState();
  const [slotDurationOptions, setSlotDurationOptions] = useState([]);
  const [slotTime, setSlotTime] = useState("");
  const interviewStatus = useSelector((state) => state.scheduleInterview.interviewStatus);
  const dispatch = useDispatch();
 
  useEffect(() => {
    let newdate = new Date(
      getTimezoneDateTime(
        moment(moment().format("YYYY-MM-DD") +
          " " +
          moment().format("HH:mm:ss")
        ).format("YYYY-MM-DD HH:mm:ss"),
        "YYYY-MM-DD HH:mm:ss"
      )

    );
    onScheduleDateChange(newdate);
  }, [dispatch]);

  useEffect(() => {
    if (isOpen && candidateData?.scheduledInterviewDtos && candidateData?.scheduledInterviewDtos?.length > 0) {
      let date = new Date(getTimezoneDateTime(candidateData?.scheduledInterviewDtos[0].scheduledate.slice(0, 11) + candidateData?.scheduledInterviewDtos[0]?.starttime,
        "YYYY-MM-DD HH:mm:ss"));

      let t = getTimezoneDateTime(
        moment(moment(candidateData?.scheduledInterviewDtos[0].scheduledate).format("YYYY-MM-DD") +
          " " +
          (candidateData?.scheduledInterviewDtos[0].starttime)
        ).format("YYYY-MM-DD hh:mm A"),
        "HH:mm:ss"
      );
      setSlotTime(t);
      setScheduledDate(date);
    }
  }, [isOpen]);

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
    // getTimeArray();
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
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hourStr, minute, second] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const onScheduleDateChange = async (date) => {
    let data = {
      scheduleDateUTC: moment(date).format("YYYY-MM-DD"),
      scheduleInterviewId: 0
    }
    let res = await dispatch(
      customerCandidateListsActions.getInterviewSlots(data)
    );
    setTimeOption(res?.payload?.data);
  };

  const getSlotDuration = (e) => {
    let time = 0;
    for (let i = 0; i < timeOption.length; i++) {
      // if (timeOption[i].slottime >= e.target.value) {
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
    event.target.elements.scheduleDate.value === "" ? setScheduleDateValidation(true) : setScheduleDateValidation(false);
    event.target.elements.scheduleStartTime.value === "" ? setScheduleTimeValidation(true) : setScheduleTimeValidation(false);
    if (type === "Interview Completed") event.target.elements.interviewStatusId.value === "" || event.target.elements.interviewStatusId.value === null ? setInterviewStatusValidation(true) : setInterviewStatusValidation(false);

    if (event.target.elements.scheduleDate.value !== "" && event.target.elements.scheduleStartTime.value !== ""
      && (type !== "Interview Completed" || (type === "Interview Completed" && (event.target.elements.interviewStatusId.value !== "" && event.target.elements.interviewStatusId.value !== null)))
    ) {
      getFormData(event);
    }
  };

  const getFormData = (event) => {
    event.preventDefault();
    let scheduleDateUTC = moment(event.target.elements.scheduleDate.value + " " + event.target.elements.scheduleStartTime.value).tz("Etc/UTC").format("YYYY-MM-DD");
    let scheduleTimeUTC = moment(event.target.elements.scheduleDate.value + " " + event.target.elements.scheduleStartTime.value).tz("Etc/UTC").format("HH:mm:ss");
    let data = {
      scheduleinterviewid: candidateData.scheduledInterviewDtos && candidateData.scheduledInterviewDtos.length > 0 ? candidateData.scheduledInterviewDtos[0].scheduleinterviewid : 0,
      jobid: candidateData.jobid,
      candidateid: candidateData.candidateid,
      scheduledate: scheduleDateUTC,
      starttime: scheduleTimeUTC,
      durationid: 60,
      isaccepted: type === "Interview Completed" ? true : false,
      interviewfeedback: type === "Interview Completed" ? event.target.elements.interviewFeedbacktext.value : "",
      interviewstatusid: type === "Interview Completed" ? Number(event.target.elements.interviewStatusId.value) : 0,
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
        size="md"
        backdrop={"static"}
        toggle={toggle}
        className="schedule-modal"
        onClosed={() => onClose()}
      >
        <ModalHeader toggle={() => onClose()}>{type === "Interview Completed" ? "Interview Completed" : "Schedule Interview"}</ModalHeader>
        <ModalBody className="pt-4">
          <Form onSubmit={(e) => getFormValidation(e)}>
            <Col md="12">
              <Row>

                <Col md={12}>
                  <FormGroup>
                    <Label for="scheduleDate" className="fw-semi-bold">
                      Interview {type === "Interview Completed" ? "Completed" : "Scheduled"} Date <span className="required-star">*</span>
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
                      minDate={new Date()}
                    />
                    {scheduleDateValidation === true && (
                      <FormText color="danger">Please enter date</FormText>
                    )}
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="scheduleStartTime" className="fw-semi-bold">
                      Interview Time <span className="required-star">* </span>
                    </Label>
                    <Input
                      type="select"
                      name="scheduleStartTime"
                      id="scheduleStartTime"
                      invalid={scheduleTimeValidation}
                      onChange={(time) => { setScheduleTimeValidation(false); getSlotDuration(time); setSlotTime(time) }}
                    >
                      <option key={0} value={""}>
                        Select start time
                      </option>
                      {timeOption.length > 0 &&
                        timeOption.map((options) => (
                          <option key={options.slottime} value={options.slottime}
                            selected={
                              String(convertTo12Hour(options.slottime)) ===
                              String(
                                getTimezoneDateTime(
                                  moment(
                                    moment(
                                      candidateData?.scheduledInterviewDtos &&
                                        candidateData?.scheduledInterviewDtos
                                          ?.length > 0
                                        ? candidateData
                                          ?.scheduledInterviewDtos[0]
                                          .scheduledate
                                        : candidateData?.scheduledate?.slice(
                                          0,
                                          11
                                        ) + candidateData?.starttime
                                    ).format("YYYY-MM-DD") +
                                    " " +
                                    (candidateData?.scheduledInterviewDtos &&
                                      candidateData?.scheduledInterviewDtos
                                        ?.length > 0
                                      ? candidateData
                                        ?.scheduledInterviewDtos[0]
                                        .starttime
                                      : candidateData?.starttime)
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
                {type === "Interview Completed" && (
                  <Col md={12}>
                    <FormGroup>
                      <Label for="interviewFeedback" className="fw-semi-bold">
                        Select Interview feedback <span className="required-star">* </span>
                      </Label>
                      <Input type="select" name="interviewStatusId">
                        <option key={0} value={""}>Select interview feedback</option>
                        {interviewStatus?.length > 0 &&
                          interviewStatus.map((data) => {
                            return (
                              <option value={data.id} key={data.id}>
                                {data.name}
                              </option>
                            );
                          })}
                      </Input>
                      {interviewStatusValidation === true && (
                        <FormText color="danger">
                          Please select interview feedback
                        </FormText>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Input
                        type="textarea"
                        name="interviewFeedbacktext"
                        id="interviewFeedback"
                        placeholder="Enter interview feedback"
                        rows="5"
                      />
                    </FormGroup>
                  </Col>)}
              </Row>
            </Col>
            <div className="divider" />
            <div className="d-block text-end">
              <Button size="lg" color="danger" type="button" onClick={() => onClose()}>
                Close
              </Button>{" "}
              <Button size="lg" color="primary" type="submit" disabled={loading}>
                Save
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
