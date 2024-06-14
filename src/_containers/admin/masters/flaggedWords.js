import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import PageTitle from "_components/common/pagetitle";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  ModalHeader,
  ModalBody,
  Modal,
  ButtonGroup,
} from "reactstrap";
import customerIcons from "assets/utils/images/customer";
import "_containers/admin/common/adminListing.scss";
import cx from "classnames";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  addFlaggedWords,
  updateFlaggedWords,
} from "_containers/admin/_redux/adminListing.slice";

import moment from "moment";
import { getTimezoneDateTime } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  getFlaggedWords,
  deleteFlaggedWords,
  getFlaggedWordList,
} from "_containers/admin/_redux/adminListing.slice";
import { analytics } from "../../../firebase/index";

export const FlaggedWord = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editData, setEditData] = useState({ skillname: "" });
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFlaggedWordList());
    getSkillsList();
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin flagged words",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [searchData, setSearchText] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [skillValidation, setskillValidation] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [save, setSave] = useState(false);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const { data } = useSelector((state) => state?.adminListing ?? {});
  const totalRecords = useSelector((state) => state.adminListing?.totalRecords);
  const flaggedWordList = useSelector(
    (state) => state.adminListing?.flaggedWordList
  );
  let title = "Flagged Words";
  let icon = companyLogo;
  let columns = [
    {
      name: "Word",
      id: "word",
      selector: (row) => row.word,
      sortable: true,
    },

    {
      name: "Status",
      id: "isactive",
      selector: (row) => (row.isactive ? "Active" : "In active"),
      sortable: true,
    },

    {
      name: "Created on",
      id: "createddate",
      selector: (row) =>
        getTimezoneDateTime(
          moment(row?.createddate).format("YYYY-MM-DD HH:MM:SS"),
          "MM/DD/YYYY"
        ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-block w-100 list-btn-group">
          <ButtonGroup>
            <Button
              // outline
              size="sm"
              title="Edit word"
              className=" btn-icon"
              // color="info"
              style={{ background: "#545cd8", border: "#545cd8" }}
              onClick={(evt) => handleRowClick(row, "edit")}
            >
              <img src={customerIcons?.list_edit} alt="list approve"></img>
            </Button>

            <Button
              // outline
              size="sm"
              title="delete word"
              className="btn-icon"
              color="danger"
              onClick={() => deleteConfirm(row, "user")}
            >
              <img src={customerIcons?.list_delete} alt="list approve"></img>
            </Button>
          </ButtonGroup>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "15px",
        fontWeight: "400",
      },
    },
  };
  const handlePageChange = async (page) => {
    setPageNo(page);
    setLoading(true);
    await dispatch(
      getFlaggedWords({
        pageSize: pageSize,
        isActive: true,
        pageNumber: page,
      })
    );
    setLoading(false);
  };

  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    setLoading(true);
    await dispatch(
      getFlaggedWords({
        pageSize: pagesize,
        isActive: true,
        pageNumber: pageNo,
      })
    );
    setLoading(false);
  };

  const handleRowClick = async (row, event) => {
    setIsAddMode(false);
    setSelectedRowData(row);
    setOpenModal(true);
    let obj = { ...editData };
    obj.word = row.word;
    setEditData(obj);
  };

  const deleteConfirm = (row, check) => {
    setSelectedRowData(row);
    setIsDelete(true);
  };

  const addModal = () => {
    let obj = { ...editData };
    obj.skillname = "";
    setIsAddMode(true);
    setEditData(obj);
    setOpenModal(true);
  };

  const getSkillsList = async function () {
    setLoading(true);
    let urlParams = {
      pageSize: pageSize,
      pageNumber: 1,
    };
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }

    if (status !== "All") {
      urlParams.skillStatusId = status;
    }

    await dispatch(getFlaggedWords(urlParams));
    setLoading(false);
  };

  const onStatusSelect = async (check) => {
    setLoading(true);
    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
    };
    if (check === "0") {
      setStatus("All");
    }
    if (check === "1") {
      urlParams.skillStatusId = 1;
      setStatus(1);
    }
    if (check === "2") {
      urlParams.skillStatusId = 0;
      setStatus(0);
    }

    if (check === "3") {
      urlParams.skillStatusId = 2;
      setStatus(2);
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    await dispatch(getFlaggedWords(urlParams));
    setLoading(false);
  };

  const onClearSearch = async function () {
    setLoading(true);
    setSearchText("");

    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
    };

    if (Number(status) === 1) {
      urlParams.skillStatusId = 1;
      setStatus(1);
    }
    if (Number(status) === 0) {
      urlParams.skillStatusId = 0;
      setStatus(0);
    }

    if (Number(status) === 2) {
      urlParams.skillStatusId = 2;
      setStatus(2);
    }

    await dispatch(getFlaggedWords(urlParams));
    setLoading(false);
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
  };
  const postData = async (payload, id) => {
    let res;
    if (isAddMode) {
      res = await dispatch(addFlaggedWords(payload));
    } else {
      res = await dispatch(updateFlaggedWords({ id, payload }));
    }

    setOpenModal(false);
    if (res.payload) {
      if (res.payload.statusCode === 204 || res.payload.statusCode === 201) {
        setSuccess(true);
        showSweetAlert({
          title: res.payload.message,
          type: "success",
        });
      } else {
        setError(true);
        showSweetAlert({
          title: res.payload.message,
          type: "error",
        });
      }
    } else {
      setError(true);
      showSweetAlert({
        title: res.error.message,
        type: "error",
      });
    }
    getSkillsList();
  };

  const deleteSkillData = async function () {
    let response;
    let id = selectedRowData.flaggedwordid;
    response = await dispatch(deleteFlaggedWords(id));
    if (response.payload) {
      setIsDelete(false);
      setSuccess(true);
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    } else {
      setError(false);
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    }
    getSkillsList();
  };

  const onClose = () => {
    setOpenModal(false);
    setSave(false);
    setSelectedRowData(null);
  };

  const handleInputChange = (event) => {
    let data = { ...editData };
    data.skillname = event;
    setEditData(data);
  };

  const getValidation = (event) => {
    event.preventDefault();
    setSave(true);
    event.target.elements.word.value === ""
      ? setskillValidation(true)
      : setskillValidation(false);

    if (event.target.elements.word.value !== "") {
      setSave(false);

      let payload = {
        flaggedwordid: isAddMode ? 0 : selectedRowData?.flaggedwordid,
        word: event.target.elements.word.value,
        isactive: true,
        currentUserId: Number(
          JSON.parse(localStorage.getItem("userDetails"))?.UserId
        ),
      };
      postData(payload, payload.flaggedwordid);
    }
  };

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading={title} icon={icon} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardBody>
              <Row>
                <Col md={12}>
                  <Row className="mb-3">
                    {/* <Col xxl={3} xl={3} md={12} lg={4} sm={12} xs={12}>
                      <FormGroup>
                        <Input
                          type="select"
                          name="status"
                          defaultValue="Active"
                          onChange={(e) => onStatusSelect(e.target.value)}
                        >
                          <option value={0}>All flagged words</option>

                          {flaggedWordList?.length > 0 &&
                            flaggedWordList?.map((options) => (
                              <option key={options.id} value={options.id}>
                                {options.name}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    </Col> */}
                    <Col xxl={12} xl={12} md={12} lg={12} sm={12} xs={12}>
                      <Button
                        style={{ background: "#2f479b" }}
                        color={"primary"}
                        className="input-group-text float-end mt-1"
                        type="submit"
                        onClick={(e) => addModal()}
                      >
                        Add Flagged Word
                      </Button>
                      <div
                        className={cx(
                          "candidate-search-wrapper search-wrapper candidate-seacrh-mt float-end",
                          {
                            active: true,
                          }
                        )}
                      >
                        <div className="input-holder float-end">
                          <input
                            type="text"
                            className="search-input search-placeholder"
                            id="search-input"
                            value={searchData}
                            onInput={(evt) => setSearchText(evt.target.value)}
                            placeholder="Search.."
                          />
                          <button
                            className="btn-close"
                            onClick={(evt) => onClearSearch()}
                          />
                          <button
                            onClick={(evt) => getSkillsList()}
                            className="search-icon"
                          >
                            <span />
                          </button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <DataTable
                data={data}
                columns={columns}
                fixedHeader
                progressPending={loading}
                pagination
                customStyles={customStyles}
                responsive
                paginationServer
                paginationTotalRows={totalRecords}
                onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                onChangePage={(e) => handlePageChange(e)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {openModal ? (
        <Modal
          isOpen={openModal}
          fullscreen={"md"}
          size="md"
          backdrop={"static"}
        >
          <ModalHeader toggle={() => onClose()} charCode="Y">
            {isAddMode ? "Add new flagged word" : "Edit flagged word"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Form onSubmit={(e) => getValidation(e)}>
                <Col>
                  <FormGroup>
                    <Label for="skill">
                      Word <span style={{ color: "red" }}>* </span>
                    </Label>
                    <input
                      type="text"
                      name="word"
                      defaultValue={editData?.word}
                      onInput={(e) => handleInputChange(e.target.value)}
                      placeholder="Enter flagged word"
                      className={`field-input placeholder-text form-control ${
                        save && skillValidation
                          ? "is-invalid error-text"
                          : "input-text"
                      }`}
                      maxLength={50}
                    />
                    <div className="invalid-feedback">
                      {save && skillValidation ? "Word is required" : ""}
                    </div>
                  </FormGroup>
                </Col>

                <Button
                  className="mt-3 float-end"
                  type="submit"
                  color="primary"
                >
                  {isAddMode ? "Submit" : "Update"}
                </Button>
              </Form>
            </Row>
          </ModalBody>
        </Modal>
      ) : (
        <></>
      )}

      {success && (
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
      )}

      {error && (
        <>
          {" "}
          <SweetAlert
            title={showAlert.title}
            show={showAlert.show}
            type={showAlert.type}
            onConfirm={() => setError(false)}
          />
          {showAlert.description}
        </>
      )}

      {isDelete && (
        <SweetAlert
          title={"Are you sure want to delete the flagged word!!"}
          type="warning"
          showConfirm={false}
        >
          <div>
            <Row>
              <Col className="d-flex justify-content-center">
                <Button
                  style={{ background: "#545CD8" }}
                  className="me-2 accept-modal-btn"
                  onClick={(evt) => deleteSkillData()}
                >
                  YES
                </Button>
                <Button
                  className="success-close-btn"
                  onClick={(evt) => setIsDelete(false)}
                >
                  NO
                </Button>
              </Col>
            </Row>
          </div>
        </SweetAlert>
      )}
    </>
  );
};
