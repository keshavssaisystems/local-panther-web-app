import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Button,
  Modal,
  Input,
} from "reactstrap";
import "./dashboard.scss";
import { candidateDashboardActions } from "_store";
import { useDispatch } from "react-redux";
import { SuccessPopUp } from "_components/common/successPopUp";
import SweetAlert from "react-bootstrap-sweetalert";

export function CreateToDo(props) {
  const dispatch = useDispatch();
  let id = JSON.parse(localStorage.getItem("userDetails")).UserId;
  const [success, setSuccess] = useState(false);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const [todoData, setData] = useState({
    tododetail: "",
    iscompleted: false,
    userid: id,
    isactive: true,
    currentUserId: id,
  });
  useEffect(() => {
    loadData();
  }, []);

  const loadData = function () {
    let data = { ...todoData };

    if (!props.selected) {
    } else {
      let obj = {
        tododetail: props.selected.tododetail,
        iscompleted: props.selected.iscompleted,
        userid: id,
        isactive: true,
        currentUserId: id,
      };
      data = obj;
    }
    setData(data);
  };

  const onHandleInputChange = function (check, value) {
    let data = { ...todoData };

    if (check === "notes") {
      data.tododetail = value;
      if (value === "") {
        data.error = true;
      } else {
        data.error = false;
      }
    } else {
      data.iscompleted = !data.iscompleted;
    }

    setData(data);
  };
  const onSubmit = async function () {
    let data = { ...todoData };
    if (data.tododetail === "") {
      data.error = true;
      setData(data);
      return;
    }
    let response;
    if (props.check === "add") {
      response = await dispatch(candidateDashboardActions.createToDo({ data }));
    } else {
      let id = props.selected.todoid;
      response = await dispatch(
        candidateDashboardActions.updateToDo({ id, data })
      );
    }

    if (!response.payload) {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    } else {
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    }
  };
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    props.onCallToDo();
  };
  return (
    <>
      <div className="profile-view react-date-picker-profile">
        {todoData ? (
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="todo" className="fw-semi-bold">
                    {props?.check === "add" ? "Add task" : "Edit task"}{" "}
                    <span className="required-icon"> *</span>
                  </Label>
                  <Input
                    placeholder="Enter task"
                    name="todo"
                    type="textarea"
                    id="todo"
                    maxLength={250}
                    style={{ height: "200px" }}
                    value={todoData.tododetail}
                    onInput={(evt) =>
                      onHandleInputChange("notes", evt.target.value)
                    }
                    className={`form-control ${
                      todoData.tododetail ? "required-error-input" : ""
                    }`}
                  />
                  <span className="dropdown-placeholder float-end">
                    {todoData.tododetail ? todoData.tododetail.length : 0}/250
                  </span>
                  <div className="required-error-text">
                    {todoData.error ? "Todo is required" : ""}
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup check>
                  <Input
                    name="iscompleted"
                    type="checkbox"
                    checked={todoData.iscompleted}
                    onChange={(evt) =>
                      onHandleInputChange("check", evt.target.value)
                    }
                  />{" "}
                  <Label className="fw-semi-bold">Is Completed</Label>
                </FormGroup>
              </Col>
            </Row>

            <div className="float-end mt-2">
              <Button
                className="me-2 save-btn"
                type="button"
                onClick={() => onSubmit()}
              >
                Save
              </Button>
            </div>
          </Form>
        ) : (
          <></>
        )}
      </div>

      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
    </>
  );
}
