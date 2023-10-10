import React, { useState } from "react";
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
} from "reactstrap";
import "./scheduledInterview.scss";
import { BsFillPlusCircleFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { ImBin } from "react-icons/im";

export function UpdateAvailabilityModal({ isOpen = false, onClose }) {
  const [modal, setModal] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const weekdayArray = [
    {
      id: 1,
      name: "Monday",
    },
    {
      id: 2,
      name: "Tuesday",
    },
    {
      id: 3,
      name: "Wednesday",
    },
    {
      id: 4,
      name: "Thursday",
    },
    {
      id: 5,
      name: "Friday",
    },
    {
      id: 6,
      name: "Saturday",
    },
    {
      id: 7,
      name: "Sunday",
    },
  ];
  const toggle = () => {
    setModal(!modal);
  };
  const inputArr = [{ id: 1, type: "text" }];
  const [availablilityFormInput, setAvailablilityFormInput] =
    useState(inputArr);
  const addAvailability = () => {
    setAvailablilityFormInput((s) => {
      return [
        ...s,
        {
          type: "text",
        },
      ];
    });
  };
  const getFormData = (event) => {
    event.preventDefault();
    console.log(event);
  };
  return (
    <>
      <Modal
        isOpen={modal}
        fullscreen={"lg"}
        size="xl"
        backdrop={"static"}
        toggle={toggle}
        className="update-availability"
      >
        <ModalHeader toggle={toggle}>Update availability</ModalHeader>
        <ModalBody className="pt-3">
          <Form onSubmit={(e) => getFormData(e)}>
            <Row>
              <Col md="5">
                <Label for="notes" className="fw-semi-bold">
                  Weekday
                </Label>
              </Col>
              <Col md="3">
                <Label for="notes" className="fw-semi-bold">
                  Start time
                </Label>
              </Col>
              <Col md="3">
                <Label for="notes" className="fw-semi-bold">
                  End time
                </Label>
              </Col>
              <Col md="1">
                <Label for="notes" className="d-block text-center">
                  <BsFillPlusCircleFill
                    className="icon-color-blue"
                    onClick={addAvailability}
                  />
                </Label>
              </Col>
            </Row>
            {availablilityFormInput.map((item, i) => {
              return (
                <Row key={i}>
                  <Col md="5">
                    <FormGroup>
                      <Input
                        type="select"
                        name={"weekday_" + i}
                        id="weekday"
                        placeholder="Enter notes"
                      >
                        <option key={0} value={0}>
                          Select weekday
                        </option>
                        {weekdayArray.length > 0 &&
                          weekdayArray?.map((weekdayData) => (
                            <>
                              <option
                                key={weekdayData.id}
                                value={weekdayData.id}
                              >
                                {weekdayData.name}
                              </option>
                            </>
                          ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <DatePicker
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        name={"starttime_" + i}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3">
                    <FormGroup>
                      <DatePicker
                        selected={endTime}
                        onChange={(date) => setEndTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        className="form-control"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        name={"endtime_" + i}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="1">
                    <Label for="notes" className="d-block text-center mt-1">
                      <ImBin className="icon-color-red" />
                    </Label>
                  </Col>
                </Row>
              );
            })}

            <div className="divider" />
            <div className="float-end">
              <Button color="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
