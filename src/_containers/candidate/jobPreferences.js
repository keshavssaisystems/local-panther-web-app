import React, { useState, useEffect } from "react";
import { Label, Input, ModalHeader, ModalBody } from "reactstrap";
import { jobPreferenceDetailsActions } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  FormGroup,
  Form,
  InputGroup,
  InputGroupText,
  CardHeader,
} from "reactstrap";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import successIcon from "../../assets/utils/images/success_icon.svg";

import errorIcon from "../../assets/utils/images/error_icon.png";
import "./profile.scss";
import { getLocationFilter } from "_store";
import Loader from "react-loaders";
import { NoDataFound } from "_components/common/nodatafound";
import InputMask from "react-input-mask";
import { getBasePayMask } from "_helpers/helper";

export function JobPreferences(props) {
  const dispatch = useDispatch();
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};

  const [jobTypes, setJobTypes] = useState([]);

  const [workType, setWorkType] = useState([]);
  const [workSchedules, setWorkSchedules] = useState([]);
  const [shifts, setShiftsData] = useState([]);
  const [jobTitleId, setJobTitleId] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState([]);
  const [selectedPayType, setSelectedPayType] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const [preferenceDetails, setDetails] = useState([]);
  const get_response = useSelector(
    (state) => state.getProfile?.profileData?.jobPreferenceInfo
  );

  const shiftsOption = useSelector((state) => state.shifts?.shift);
  const workTypeOption = useSelector(
    (state) => state.dropdown?.jobLocationType
  );
  const workScheduleOptions = useSelector(
    (state) => state.workSchedule?.workSchedule
  );
  const jobTypeOption = useSelector((state) => state.jobType?.jobType);
  const loader = useSelector((state) => state.getProfile?.loader);

  const [deleteConfirmation, setDeleteConfirm] = useState(false);

  let jobTitleList = useSelector((state) => state.getJobTitle?.user?.data);
  let payPeriodList = useSelector((state) => state.getPayPeriod?.user?.data);
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const experienceLevelOption = useSelector(
    (state) => state.dropdown?.experienceLevel
  );
  const [formDetails, setFormData] = useState({});

  const location = useSelector((state) => state.dropdown?.jobType);

  const [desiredJobType, setDesiredJobType] = useState([
    {
      id: 1,
      name: "Flexible",
    },
    {
      id: 2,
      name: "Specific Job Title",
    },
  ]);

  useEffect(() => {
    let data = [];
    if (!get_response) {
      setGetResponse([]);
      data.push({
        anywhereonlynear: 0,
        candidateDesiredWorkTypeDtos: [],
        candidateJobtitlesDtos: [],
        candidateLocationsDtos: [],
        candidateShiftsDtos: [],
        candidateWorkSchedulesDtos: [],
        candidateid: userDetails?.InternalUserId ?? 0,
        candidatejobpreferenceid: 0,
        desiredjobtitle: "",
        desiredjobtitleid: 0,
        desiredjobtypes: "",
        desiredjobtypestext: null,
        desiredworktypeids: "",
        isactive: true,
        jobtitlesids: null,
        jobtitlestext: null,
        locationids: "",
        locationstext: null,
        minimumbasepay: "",
        payperiodtype: null,
        payperiodtypeid: 0,
        shifts: "",
        shiftstext: null,
        willingtorelocate: false,
        workschedules: "",
        workschedulestext: null,
      });
      setDetails(data);
    } else {
      if (get_response.length > 0) {
        data.push({
          anywhereonlynear: get_response[0].anywhereonlynear,
          candidateDesiredWorkTypeDtos:
            get_response[0].candidateDesiredWorkTypeDtos,
          candidateJobtitlesDtos: get_response[0].candidateJobtitlesDtos,
          candidateLocationsDtos: get_response[0].candidateLocationsDtos,
          candidateShiftsDtos: get_response[0].candidateShiftsDtos,
          candidateWorkSchedulesDtos:
            get_response[0].candidateWorkSchedulesDtos,
          candidateid: userDetails?.InternalUserId ?? 0,
          candidatejobpreferenceid: get_response[0].candidatejobpreferenceid,
          desiredjobtitle: get_response[0].desiredjobtitle,
          desiredjobtitleid: get_response[0].desiredjobtitleid,
          desiredjobtypes: get_response[0].desiredjobtypes,
          desiredjobtypestext: get_response[0].desiredjobtypestext,
          desiredworktypeids: get_response[0].desiredworktypeids,
          isactive: get_response[0].isactive,
          jobtitlesids: get_response[0].jobtitlesids,
          jobtitlestext: get_response[0].jobtitlestext,
          locationids: get_response[0].locationids,
          locationstext: get_response[0].locationstext,
          minimumbasepay: get_response[0].minimumbasepay,
          payperiodtype: get_response[0].payperiodtype,
          payperiodtypeid: get_response[0].payperiodtypeid,
          shifts: get_response[0].shifts,
          shiftstext: get_response[0].shiftstext,
          willingtorelocate: get_response[0].willingtorelocate,
          workschedules: get_response[0].workschedules,
          workschedulestext: get_response[0].workschedulestext,
        });

        let new_data = data[0].candidateJobtitlesDtos?.filter(
          (x) => x.ischecked == true
        );

        const commonData = jobTitleList.filter((item1) => {
          return new_data.some(
            (item2) => item1.value === item2.desiredjobtitleid
          );
        });
        let select = [...selectedTitle];
        select = commonData;
        setSelectedTitle(select);

        let payType = payPeriodList.find(
          (x) => x.value == data[0].payperiodtypeid
        );

        let select1 = [...selectedPayType];
        select1.push(payType);
        setSelectedPayType(select1);

        let location = data[0].candidateLocationsDtos.map((rest) => {
          return {
            value: rest.locationid,
            label: rest.location,
          };
        });

        setSelectedLocation(location);
        let filtered_data = [...getData];
        filtered_data = get_response?.map((rest) => {
          return {
            candidatejobpreferenceid: rest.candidatejobpreferenceid,
            desiredJobTitle: desiredJobType?.find(
              (x) => x.id == rest.desiredjobtitleid
            )?.name,
            specificJobTitle: rest.candidateJobtitlesDtos
              ?.filter((item) => item.ischecked)
              .map((item) => item.desiredjobtitlename)
              .join(", "),
            desiredJobTypes: rest.candidateDesiredWorkTypeDtos
              ?.filter((item) => item.ischecked)
              .map((item) => item.desiredworktypename)
              .join(", "),
            desiredWorkTypes: rest.candidateDesiredJobTypesDtos
              ?.filter((item) => item.ischecked)
              .map((item) => item.joblocationtype)
              .join(", "),
            workSchedules: rest.candidateWorkSchedulesDtos
              ?.filter((item) => item.ischecked)
              .map((item) => item.workschedules)
              .join(", "),

            shifts: rest.candidateShiftsDtos
              ?.filter((item) => item.ischecked)
              .map((item) => item.shifts)
              .join(", "),
            pay:
              (rest.minimumbasepay && rest.payperiodtype) ||
              (rest.minimumbasepay != "" && rest.payperiodtype != "")
                ? rest.minimumbasepay + "  " + rest.payperiodtype
                : rest.minimumbasepay
                ? rest.minimumbasepay
                : rest.payperiodtype
                ? rest.payperiodtype
                : "",
            relocate: rest.willingtorelocate ? true : false,
            workType: "",
          };
        });

        setGetResponse(filtered_data);
      }
      setDetails(data);
    }
  }, [get_response]);

  useEffect(() => {
    if (get_response?.length > 0) {
      let new_data = get_response[0]?.candidateJobtitlesDtos.filter(
        (x) => x.ischecked == true
      );

      const commonData = jobTitleList.filter((item1) => {
        return new_data.some(
          (item2) => item1.value === item2.desiredjobtitleid
        );
      });

      let select = [...selectedTitle];
      select = commonData;
      setSelectedTitle(select);
    }
  }, [jobTitleList]);

  const [getData, setGetResponse] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = function () {
    let data = {
      candidatejobpreferenceid: 0,
      candidateid: userDetails?.InternalUserId ?? 0,
      desiredjobtitleid: 0,
      jobtitlesids: "",
      desiredjobtypes: "",
      workTypes: "",
      workschedules: "",
      shifts: "",
      payperiodtypeid: 0,
      minimumbasepay: "",
      willingtorelocate: "",
      anywhereonlynear: 0,
      locationids: "",
      desiredworktypeids: "",
      isactive: true,
      currentUserId: userDetails?.UserId ?? 0,
    };
    setFormData(data);
  };

  const loadOptions = async function (inputValue) {
    // if (inputValue.length > 2) {
    const { data = [] } = await getLocationFilter(inputValue);

    return data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location + ", " + rest.statename}`,
      };
    });
  };

  const onHandleInputChange = function (check, data, status) {
    let new_data = [...preferenceDetails];
    if (check === "desiredJobType") {
      new_data[0].desiredjobtitleid = data;
    } else if (check === "jobTitle") {
      let title_data = data.map((item) => item.value).join(", ");

      let select = [...selectedTitle];
      select = data;
      setSelectedTitle(select);
      new_data[0].jobtitlesids = title_data;
    } else if (check === "jobType") {
      let type_data = [...jobTypes];
      type_data =
        new_data[0].desiredworktypeids !== ""
          ? new_data[0].desiredworktypeids.split(",")
          : [];
      let i = type_data.indexOf(data);

      if (i == -1) {
        type_data.push(data);
      } else {
        const i = type_data.indexOf(data);
        type_data.splice(i, 1);
      }

      setJobTypes(type_data);

      new_data[0].desiredworktypeids = type_data.join(",");
      if (new_data[0].desiredworktypeids === "") {
        new_data[0].error = true;
      } else {
        new_data[0].error = false;
      }
    } else if (check === "workType") {
      let type_data = [...workType];
      type_data =
        new_data[0].desiredjobtypes != ""
          ? new_data[0].desiredjobtypes.split(",")
          : [];
      let i = type_data.indexOf(data);

      if (i == -1) {
        type_data.push(data);
      } else {
        const i = type_data.indexOf(data);
        type_data.splice(i, 1);
      }

      setWorkType(type_data);

      new_data[0].desiredjobtypes = type_data.join(",");
    } else if (check === "schedules") {
      let schedule_data = [...workSchedules];
      schedule_data =
        new_data[0].workschedules !== ""
          ? new_data[0].workschedules.split(",")
          : [];
      let i = schedule_data.indexOf(data);

      if (i == -1) {
        schedule_data.push(data);
      } else {
        const i = schedule_data.indexOf(data);
        schedule_data.splice(i, 1);
      }
      setWorkSchedules(schedule_data);

      new_data[0].workschedules = schedule_data.join(",");
    } else if (check === "shifts") {
      let shift_data = [...shifts];
      shift_data =
        new_data[0].shifts !== "" ? new_data[0].shifts.split(",") : [];
      let i = shift_data.indexOf(data);
      if (i == -1) {
        shift_data.push(data);
      } else {
        const i = shift_data.indexOf(data);
        shift_data.splice(i, 1);
      }
      setShiftsData(shift_data);
      new_data[0].shifts = shift_data.join(",");
    } else if (check === "payType") {
      let payType = [...selectedPayType];
      let new_array = [];
      new_array.push(data);
      payType = new_array;
      setSelectedPayType(payType);

      new_data[0].payperiodtypeid = data.value;
    } else if (check === "basePay") {
      new_data[0].minimumbasepay = new Intl.NumberFormat("en-US").format(
        data.replace(/,/g, "")
      );
    } else if (check === "relocate") {
      new_data[0].willingtorelocate = !new_data[0].willingtorelocate;
    } else if (check === "anyWhere") {
      new_data[0].anywhereonlynear = 1;
    } else if (check === "near") {
      new_data[0].anywhereonlynear = 2;
    } else if (check === "location") {
      let new_array = [...selectedLocation];
      new_array = data;
      setSelectedLocation(new_array);
      new_data[0].locationids = data.map((obj) => obj.value).join(",");
    }

    setFormData(new_data);
  };

  const closeModal = function () {
    setSuccess(false);
    setError(false);
    setPersonalModal(false);
    props.onCallBack();
    let select = [...selectedTitle];
    select = [];
    setSelectedTitle(select);
    let new_array = [...selectedLocation];
    new_array = [];
    setSelectedLocation(new_array);

    let payType = [...selectedPayType];
    payType = [];
    setSelectedPayType(payType);

    let data = [];
    data.push({
      anywhereonlynear: 0,
      candidateDesiredWorkTypeDtos: [],
      candidateJobtitlesDtos: [],
      candidateLocationsDtos: [],
      candidateShiftsDtos: [],
      candidateWorkSchedulesDtos: [],
      candidateid: userDetails?.InternalUserId ?? 0,
      candidatejobpreferenceid: 0,
      desiredjobtitle: "",
      desiredjobtitleid: 0,
      desiredjobtypes: "",
      desiredjobtypestext: null,
      desiredworktypeids: "",
      isactive: true,
      jobtitlesids: null,
      jobtitlestext: null,
      locationids: "",
      locationstext: null,
      minimumbasepay: "",
      payperiodtype: null,
      payperiodtypeid: 0,
      shifts: "",
      shiftstext: null,
      willingtorelocate: false,
      workschedules: "",
      workschedulestext: null,
    });
    setDetails(data);
  };

  function checkIdExists(idsString, idToCheck) {
    // Split the comma-separated string into an array of values
    const idsArray = idsString.split(",");

    // Check if the ID exists in the array

    if (idsArray.includes(String(idToCheck))) {
      return true;
    } else {
      return false;
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const keyToCheck = "desiredworktypeids";
    let new_data = [...preferenceDetails];
    const emptyKeyIndexes = preferenceDetails
      .map((item, index) => (item[keyToCheck] === "" ? index : null))
      .filter((index) => index !== null);

    if (emptyKeyIndexes.length > 0) {
      for (let i = 0; i < emptyKeyIndexes.length; i++) {
        new_data[emptyKeyIndexes[i]].error = true;
      }

      setDetails(new_data);
      return;
    }
    if (
      new_data[0].anywhereonlynear === 2 &&
      (!new_data[0].locationids || new_data[0].locationids === "")
    ) {
      return;
    }
    let response;

    let data = preferenceDetails.map((rest) => {
      return {
        candidatejobpreferenceid: rest.candidatejobpreferenceid,
        candidateid: parseInt(userDetails?.InternalUserId ?? 0),
        desiredjobtitleid: parseInt(rest.desiredjobtitleid),
        jobtitlesids: rest.jobtitlesids,
        desiredjobtypes: rest.desiredjobtypes,
        workschedules: rest.workschedules,
        shifts: rest.shifts,
        payperiodtypeid: parseInt(rest.payperiodtypeid),
        minimumbasepay: rest.minimumbasepay,
        willingtorelocate: rest.willingtorelocate,
        anywhereonlynear: parseInt(rest.anywhereonlynear),
        locationids: rest.locationids,
        desiredworktypeids: rest.desiredworktypeids,
        isactive: rest.isactive,
        currentUserId: parseInt(userDetails?.UserId ?? 0),
      };
    });

    let formDetails = data[0];
    let id = preferenceDetails[0].candidatejobpreferenceid;
    if (preferenceDetails[0].candidatejobpreferenceid == 0) {
      response = await dispatch(
        jobPreferenceDetailsActions.addjobPreferenceThunk(formDetails)
      );
    } else {
      response = await dispatch(
        jobPreferenceDetailsActions.updatejobPreferenceThunk({
          id,
          formDetails,
        })
      );
    }
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  }

  const deleteJobPreference = async function () {
    let deleteId = getData[0].candidatejobpreferenceid;
    let response = await dispatch(
      jobPreferenceDetailsActions.deletejobPreferenceThunk(deleteId)
    );
    setDeleteConfirm(false);
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  };

  const deleteModal = function (id) {
    setDeleteConfirm(true);
  };
  const close = function () {
    setPersonalModal(false);
  };
  const [basePayValue, setBasePayValue] = useState("");
  return (
    <div>
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <CardHeader className="card-title-text  text-capitalize ">
            Job preferences
            <div className="float-end me-2 ms-auto">
              <BsPencil
                className="icons me-2"
                onClick={() => setPersonalModal(true)}
              />
              {getData?.length > 0 ? (
                <BsTrash3
                  className="me-2 icons"
                  onClick={() => deleteModal()}
                />
              ) : (
                ""
              )}
            </div>
          </CardHeader>
          <CardBody>
            {!loader ? (
              <div>
                {getData?.length > 0 ? (
                  <div>
                    {getData.map((item, index) => (
                      <Row>
                        <Col>
                          <Row>
                            <strong>Desired job titles</strong>
                            <div>
                              {item.desiredJobTitle !== "" &&
                              item.desiredJobTitle
                                ? item.desiredJobTitle
                                : "-"}
                            </div>
                          </Row>
                          <hr />
                          <Row>
                            <strong>Specific job title</strong>
                            <div>
                              {item.specificJobTitle !== ""
                                ? item.specificJobTitle
                                : "-"}
                            </div>
                          </Row>
                          <hr />
                          <Row>
                            <strong>Desired job types</strong>
                            <div>
                              {item.desiredJobTypes !== ""
                                ? item.desiredJobTypes
                                : "-"}
                            </div>
                          </Row>
                          <hr />
                          <Row>
                            <strong>Work schedules</strong>
                            <div>
                              {item.workSchedules !== ""
                                ? item.workSchedules
                                : "-"}
                            </div>
                          </Row>
                          <hr />
                          <Row>
                            <strong>Shifts</strong>
                            <div>{item.shifts !== "" ? item.shifts : "-"}</div>
                          </Row>
                          <hr />
                        </Col>

                        <Col>
                          <Row>
                            <strong>Desired minimum pay</strong>

                            <div>{item.pay !== "" ? "$" + item.pay : "-"}</div>
                          </Row>
                          <hr />
                          <Row>
                            <strong>Willing to relocate</strong>
                            <div>{item.relocate ? "Yes" : "No"}</div>
                          </Row>
                          <hr />
                          <Row>
                            <strong>Work type</strong>
                            <div>
                              {item.desiredWorkTypes !== ""
                                ? item.desiredWorkTypes
                                : "-"}
                            </div>
                          </Row>
                          <hr />
                        </Col>
                      </Row>
                    ))}
                  </div>
                ) : (
                  <Row style={{ textAlign: "center" }}>
                    <Col>
                      {" "}
                      <NoDataFound imageSize={"25px"} />
                    </Col>
                  </Row>
                )}
              </div>
            ) : (
              <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
                <Loader active={loader} type="line-scale-pulse-out-rapid" />
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {isPersonalModal ? (
        <div>
          <Modal
            className="personal-information profile-view"
            size="lg"
            isOpen={isPersonalModal}
          >
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Job preferences
              </strong>
            </ModalHeader>
            <ModalBody>
              {preferenceDetails?.map((parentItem, index) => (
                <Form onSubmit={(e) => onSubmit(e)}>
                  <Row>
                    <div className="mb-1 fw-bold">Desired job titles</div>
                    <hr />
                  </Row>
                  <Row>
                    {desiredJobType.map((item, index) => (
                      <Col>
                        <FormGroup check>
                          <Input
                            name="desiredJobType"
                            type="radio"
                            onChange={(evt) =>
                              onHandleInputChange("desiredJobType", item.id)
                            }
                            value={parentItem.desiredjobtitleid}
                            checked={parentItem.desiredjobtitleid == item.id}
                          />{" "}
                          <Label check className="fw-semi-bold">
                            {item.name}
                          </Label>
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>

                  <Row className="mt-3">
                    <div className="mb-1 fw-bold">Add job title</div>
                    <hr />
                  </Row>
                  <Row>
                    <Col md={5}>
                      <FormGroup>
                        <Label for="zipCode" className="fw-semi-bold">
                          Job Title
                        </Label>
                        <AsyncSelect
                          name="jobTitle"
                          placeholder="Select"
                          defaultOptions={jobTitleList}
                          // className={mustHaveValidation ? "is-invalid" : ""}
                          isMulti={true}
                          value={selectedTitle}
                          onChange={(evt) =>
                            onHandleInputChange("jobTitle", evt)
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <div className="mb-1 fw-bold">Desired job types</div>
                    <hr />
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="fw-semi-bold">
                          Job type<span style={{ color: "red" }}> *</span>
                        </Label>
                        {jobTypeOption?.length > 0 &&
                          jobTypeOption?.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"jobType"}
                                id={"jobType_" + options.id}
                                value={options.id}
                                onInput={(evt) =>
                                  onHandleInputChange(
                                    "jobType",
                                    evt.target.value
                                  )
                                }
                                style={{
                                  borderColor: parentItem.error
                                    ? "#ff0000"
                                    : "",
                                }}
                                checked={checkIdExists(
                                  parentItem.desiredworktypeids,
                                  options.id
                                )}
                              />{" "}
                              {"  "}
                              <Label check for={"jobType_" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                        <div className="filter-info-text filter-error-msg">
                          {parentItem.error ? "Job type is required" : ""}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="workSchedule" className="fw-semi-bold">
                          Work schedules
                        </Label>
                        {workScheduleOptions?.length > 0 &&
                          workScheduleOptions?.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"workSchedule"}
                                id={"workSchedule_" + options.id}
                                value={options.id}
                                onInput={(evt) =>
                                  onHandleInputChange(
                                    "schedules",
                                    evt.target.value
                                  )
                                }
                                checked={checkIdExists(
                                  parentItem.workschedules,
                                  options.id
                                )}
                              />{" "}
                              {"  "}
                              <Label check for={"workSchedule_" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label for="shifts" className="fw-semi-bold">
                          Shifts
                        </Label>
                        {shiftsOption?.length > 0 &&
                          shiftsOption?.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"shifts"}
                                id={"shifts_" + options.id}
                                value={options.id}
                                onInput={(evt) =>
                                  onHandleInputChange(
                                    "shifts",
                                    evt.target.value
                                  )
                                }
                                checked={checkIdExists(
                                  parentItem.shifts,
                                  options.id
                                )}
                              />{" "}
                              {"  "}
                              <Label check for={"shifts_" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                      </FormGroup>
                    </Col>

                    <Col>
                      <FormGroup>
                        <Label for="shifts" className="fw-semi-bold">
                          Work Type
                        </Label>
                        {workTypeOption?.length > 0 &&
                          workTypeOption?.map((options) => (
                            <div className="form-group-custom">
                              <Input
                                key={options.id}
                                type="checkbox"
                                name={"shifts"}
                                id={"shifts_" + options.id}
                                value={options.id}
                                onInput={(evt) =>
                                  onHandleInputChange(
                                    "workType",
                                    evt.target.value
                                  )
                                }
                                checked={checkIdExists(
                                  parentItem.desiredjobtypes,
                                  options.id
                                )}
                              />{" "}
                              {"  "}
                              <Label check for={"workType" + options.id}>
                                {options.name}
                              </Label>
                            </div>
                          ))}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <div className="mb-1 fw-bold">Desired minimum pay</div>
                    <hr />
                  </Row>

                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="zipCode" className="fw-semi-bold">
                          Pay period type
                        </Label>
                        <AsyncSelect
                          name="jobTitle"
                          placeholder="Select"
                          defaultOptions={payPeriodList}
                          // className={mustHaveValidation ? "is-invalid" : ""}
                          isMulti={false}
                          value={selectedPayType}
                          onChange={(evt) =>
                            onHandleInputChange("payType", evt)
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="zipCode" className="fw-semi-bold">
                          Minimum base pay
                        </Label>

                        <InputGroup>
                          <InputGroupText>$</InputGroupText>
                          <InputMask
                            className="field-input placeholder-text form-control input-text"
                            mask={getBasePayMask(
                              basePayValue === ""
                                ? parentItem.minimumbasepay
                                : basePayValue
                            )}
                            maskChar={null}
                            name="minPay"
                            id="minPay"
                            placeholder="Enter base pay"
                            onInput={(evt) => {
                              onHandleInputChange("basePay", evt.target.value);
                              setBasePayValue(evt.target.value);
                            }}
                            value={parentItem.minimumbasepay}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <div className="mb-1 fw-bold">Location</div>
                    <hr />
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup check>
                        <Input
                          name="relocate"
                          id="relocate"
                          onInput={(evt) =>
                            onHandleInputChange(
                              "relocate",
                              !parentItem.willingtorelocate
                            )
                          }
                          type="checkbox"
                          checked={parentItem.willingtorelocate}
                        />{" "}
                        <Label check className="fw-semi-bold">
                          Willing to Relocate
                        </Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup check>
                          <Input
                            name="anyWhere"
                            type="radio"
                            onChange={(evt) =>
                              onHandleInputChange("anyWhere", evt.target.value)
                            }
                            checked={parentItem.anywhereonlynear == 1}
                          />{" "}
                          <Label check className="fw-semi-bold">
                            Anywhere
                          </Label>
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup check>
                          <Input
                            name="onlyNear"
                            type="radio"
                            onChange={(evt) =>
                              onHandleInputChange("near", evt.target.value)
                            }
                            checked={parentItem.anywhereonlynear == 2}
                          />{" "}
                          <Label check className="fw-semi-bold">
                            Only near
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="city" className="fw-semi-bold">
                          Location
                          {parentItem.anywhereonlynear == 2 ? (
                            <span className="required-icon"> *</span>
                          ) : (
                            ""
                          )}
                        </Label>
                        <AsyncSelect
                          name="location"
                          placeholder="Search to select"
                          loadOptions={loadOptions}
                          isMulti={true}
                          value={selectedLocation}
                          onChange={(evt) =>
                            onHandleInputChange("location", evt)
                          }
                          className={`placeholder-name ${
                            parentItem.anywhereonlynear == 2 &&
                            selectedLocation.length === 0
                              ? "async-border-red"
                              : ""
                          }`}
                        />

                        <div className="async-error-text">
                          {parentItem.anywhereonlynear == 2 &&
                          selectedLocation.length === 0
                            ? "Location is required"
                            : ""}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="float-end">
                    <Button className="me-2 save-btn" type="submit">
                      Save
                    </Button>
                    <Button
                      type="button"
                      className="close-btn"
                      onClick={() => closeModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Form>
              ))}
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}

      <Modal
        className="modal-reject-align profile-view"
        isOpen={deleteConfirmation}
      >
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Are you sure
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              want to delete the Job Preferences!!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => deleteJobPreference()}
                  >
                    YES
                  </Button>
                  <Button
                    className="success-close-btn"
                    onClick={(evt) => setDeleteConfirm(false)}
                  >
                    NO
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={success}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              {message}
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => closeModal()}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={error}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Something went wrong
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Please try again later
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setError(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
}
