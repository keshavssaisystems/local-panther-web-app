import React, { useState } from "react";
import {
  ModalBody,
  Card,
  CardHeader,
  ModalHeader,
  Input,
  Modal,
  ListGroup,
  ListGroupItem,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
} from "reactstrap";
import "./dashboard.scss";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CreateToDo } from "./createToDo";
import todoIcon from "../../../assets/utils/images/to-do-list.svg";
import { candidateDashboardActions } from "_store";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import errorIcon from "../../../assets/utils/images/error_icon.png";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "_helpers/helper";
import { SuccessPopUp } from "_components/common/successPopUp";

export function TodoList(props) {
  const dispatch = useDispatch();

  const totalRecords = useSelector(
    (state) => state.candidateDashboard?.dashboardGraphData?.length
  );

  const toDoList = useSelector((state) => state.candidateDashboard?.toDoList);
  const [isOpenModal, setModal] = useState(false);
  const [selectedData, setSelectedData] = useState(false);
  const [check, setCheck] = useState("");
  const [success, setSuccess] = useState(false);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(0);

  const handlePageChange = () => {
    setDeleteConfirm(false);
    setSuccess(false);
    setError(false);
    setModal(false);
    props.onCallBack();
  };

  const close = function () {
    setModal(false);
  };
  const addNotes = function (mode, data, e) {
    e.preventDefault();
    setCheck(mode);
    if (mode == "edit") {
      setSelectedData(data);
    } else {
      setSelectedData(null);
    }
    setModal(true);
  };
  const deleteToDo = async function () {
    let id = deleteId;
    let response = await dispatch(candidateDashboardActions.deleteToDo({ id }));

    if (!response.payload) {
      setError(true);
      setMessage(response.error.message);
    } else {
      setSuccess(true);
      setMessage(response.payload.message);
    }
  };

  return (
    <>
      <Card className="card-hover-shadow-2x mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-md text-capitalize fw-bold">
            <img src={todoIcon} alt="todo-img" className="me-2" />
            To-do list
          </div>

          {/* <div className="card-header-title font-size-md text-capitalize fw-bold"> */}

          <div className="btn-actions-pane-right text-capitalize">
            <a
              href="javascript:void(0)"
              onClick={(e) => addNotes("add", "", e)}
              className="btn-lg btn btn-link add-label"
            >
              Add
            </a>
          </div>
        </CardHeader>
        <div className="scroll-area-md">
          <PerfectScrollbar>
            <div className="p-2">
              {toDoList ? (
                toDoList.map((item) => (
                  <ListGroup className="todo-list-wrapper" flush>
                    <ListGroupItem>
                      <div
                        className={
                          item.iscompleted
                            ? "todo-indicator bg-success"
                            : "todo-indicator bg-warning"
                        }
                      />
                      <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                          <div className="widget-content-left me-2 ms-2">
                            <Input
                              type="checkbox"
                              checked={item.iscompleted}
                              className="me-2 form-check-input-custom"
                              id="exampleCustomCheckbox12"
                              disabled
                              label="&nbsp;"
                            />
                          </div>
                          <div className="widget-content-left">
                            <div className="widget-heading">
                              {item.tododetail}
                            </div>
                            <div className="widget-subheading">
                              {formatDate(
                                item.modifieddate
                                  ? item.modifieddate
                                  : item.createddate
                              )}
                            </div>
                          </div>
                          <div className="widget-content-right widget-content-actions todo-icons">
                            <BsPencil
                              className="me-2"
                              onClick={(e) => addNotes("edit", item, e)}
                            />

                            <BsTrash3
                              onClick={() => [
                                setDeleteId(item.todoid),
                                setDeleteConfirm(true),
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                  </ListGroup>
                ))
              ) : (
                <></>
              )}
            </div>
          </PerfectScrollbar>
        </div>
        {totalRecords > 5 ? (
          <CardFooter className="mb-3 mt-1" style={{ border: "none" }}>
            &nbsp;
          </CardFooter>
        ) : (
          <></>
        )}
      </Card>
      <div>
        <Modal className="personal-information" size="md" isOpen={isOpenModal}>
          <ModalHeader toggle={() => close()} charCode="Y">
            <strong className="card-title-text">Add/Edit todo</strong>
          </ModalHeader>
          <ModalBody>
            <CreateToDo
              onCallToDo={() => handlePageChange()}
              selected={selectedData}
              check={check}
            />
          </ModalBody>
        </Modal>
      </div>

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
              want to delete the todo!!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => deleteToDo(false)}
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
      <Modal size="md" isOpen={success}>
        <SuccessPopUp
          icon={"success"}
          message={"Todo deleted"}
          callBack={() => [setSuccess(false), handlePageChange()]}
        />
      </Modal>

      <Modal size="md" isOpen={error}>
        <SuccessPopUp
          icon={"error"}
          message={"Something went wrong"}
          callBack={() => setError(false)}
        />
      </Modal>
    </>
  );
}
