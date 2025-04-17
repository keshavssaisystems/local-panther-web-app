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
  Button,
  ButtonGroup,
  Input,
  Badge,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import customerIcons from "assets/utils/images/customer";
import DataTable from "react-data-table-component";
import {
  adminListingActions,
  getLocation,
  authActions,
  getProfileActions,
} from "_store";
import { USPhoneNumber } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";
import AsyncSelect from "react-select/async";
import { CandidateProfile } from "_containers/candidate/candidateProfile";
import { NoDataFound } from "_components/common/nodatafound";
import Loader from "react-loaders";
import { NewCandidateModal } from "./newCandidateModal";
import { BuildCVModal } from "_components/modal/buildcvmodal";
export const AdmCandidateList = () => {
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddCandMod, setShowAddCandMod] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const [stateData, setStateData] = useState({
    value: "",
    label: "Search city/state",
  });
  const [searchData, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const candidateList = useSelector(
    (state) => state.adminListing?.candidateList
  );
  const candTotalRecords = useSelector(
    (state) => state.adminListing?.candTotalRecords
  );
  const candListLoading = useSelector(
    (state) => state.adminListing?.candListLoading
  );

  useEffect(() => {
    getCandidateListData(pageNo, pageSize, searchData);
    return () => {
      localStorage.removeItem("admcandid");
    };
  }, []);

  let title = "Candidates";
  let icon = companyLogo;
  let columns = [
    {
      name: "Name",
      id: "name",
      selector: (row) => row.firstname + " " + row.lastname,
      width: "15%",
      sortable: true,
    },

    {
      name: "Email",
      id: "cityname",
      selector: (row) => row.email,
      sortable: true,
      width: "20%",
    },

    {
      name: "Phone",
      id: "phone",
      selector: (row) =>
        row.phonenumber ? USPhoneNumber(row.phonenumber) : "",
      sortable: true,
      width: "15%",
    },
    {
      name: "City & State",
      id: "city",
      selector: (row) =>
        (row.cityname
          ? row.statename
            ? row.cityname + ","
            : row.cityname
          : "") +
        " " +
        (row.statename ? row.statename : ""),
      sortable: true,
      width: "15%",
    },
    {
      name: "Source",
      id: "source",
      selector: (row) => row.source,
      sortable: true,
      width: "10%",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          {row.status === 0 && row?.source?.toLowerCase() === "admin" ? (
            <Badge color="warning">Inactive</Badge>
          ) : row.status === 1 && row?.source?.toLowerCase() === "admin" ? (
            <Badge color="warning">Inactive</Badge>
          ) : (
            <Badge color="success">Active</Badge>
          )}
        </div>
      ),
      sortable: true,
      selector: (row) => row.status,
      width: "15%",
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <ButtonGroup>
            {row.status === 0 && row?.source?.toLowerCase() === "admin" ? (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Edit candidate"
                  className="btn-icon"
                  color="warning"
                  // disabled
                  onClick={(e) => {
                    showCandidateProfile(row.candidateid);
                  }}
                >
                  <img
                    src={customerIcons?.list_edit}
                    alt="Edit candidate"
                  ></img>
                </Button>

                {/* <Button
                  // outline
                  size="sm"
                  title="Send Invitation"
                  className="btn-icon"
                  color="info"
                  onClick={(e) => {
                    sendEmailInvitation(row.candidateid, 1);
                  }}
                >
                  <FaEnvelope style={{ fontSize: "18px" }} />
                </Button> */}
                <Button
                  // outline
                  size="sm"
                  title="View Profile"
                  className="btn-icon"
                  color="danger"
                  onClick={(e) => {
                    onCandidateClick(row.candidateid);
                  }}
                >
                  <FaEye style={{ fontSize: "18px" }} />
                </Button>
              </>
            ) : row.status === 1 && row?.source?.toLowerCase() === "admin" ? (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Edit candidate"
                  className="btn-icon"
                  color="warning"
                  // disabled
                  onClick={(e) => {
                    showCandidateProfile(row.candidateid);
                  }}
                >
                  <img
                    src={customerIcons?.list_edit}
                    alt="Edit candidate"
                  ></img>
                </Button>
                {/* 
                <Button
                  // outline
                  size="sm"
                  title="Re-Send Invitation"
                  className="btn-icon"
                  color="info"
                  onClick={(e) => {
                    sendEmailInvitation(row.candidateid, 2);
                  }}
                >
                  <FaEnvelopeOpenText style={{ fontSize: "18px" }} />
                </Button> */}
                <Button
                  // outline
                  size="sm"
                  title="View Profile"
                  className="btn-icon"
                  color="danger"
                  onClick={(e) => {
                    onCandidateClick(row.candidateid);
                  }}
                >
                  <FaEye style={{ fontSize: "18px" }} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  // outline
                  size="sm"
                  title="View Profile"
                  className="btn-icon"
                  color="danger"
                  onClick={(e) => {
                    onCandidateClick(row.candidateid);
                  }}
                >
                  <FaEye style={{ fontSize: "18px" }} />
                </Button>
              </>
            )}
          </ButtonGroup>
        </div>
      ),
      sortable: false,
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

  const getCandidateListData = (
    pageNo,
    pageSize,
    searchData,
    fromClear = false
  ) => {
    let cityId = 0;
    let stateId = 0;
    if (stateData?.value) {
      cityId = stateData.value.split(",")[0];
      stateId = stateData.value.split(",")[1];
    }
    dispatch(
      adminListingActions.getAdmCandidateList({
        isActive: true,
        pageSize: pageSize,
        pageNumber: pageNo,
        searchText: fromClear ? "" : searchData,
        cityId: fromClear ? 0 : cityId,
        stateId: fromClear ? 0 : stateId,
        source: fromClear ? "" : source,
        status: fromClear ? "" : status,
      })
    );
  };
  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getCandidateListData(pageNo, pagesize, searchData);
  };
  const handlePageChange = async (page) => {
    setPageNo(page);
    getCandidateListData(page, pageSize, searchData);
  };

  // const sendEmailInvitation = async (candidateid, type) => {
  //   let res1 = await dispatch(
  //     authActions.postAddAuditLogs({
  //       useractivityid: 0,
  //       userid: localStorage.getItem("userId")
  //         ? localStorage.getItem("userId")
  //         : 0,
  //       datasource:
  //         type === 1 ? "send email invitation" : "re-send email invitation",
  //       ipaddress: localStorage.getItem("publicip")
  //         ? localStorage.getItem("publicip")
  //         : "Web",
  //       resource: type === 1 ? "email invitation" : "re-send email invitation",
  //       functionname:
  //         type === 1 ? "sendemailinvitation" : "resendemailinvitation",
  //       pagename: "candidates",
  //       createddate: new Date().toISOString(),
  //     })
  //   );
  //   let res = await dispatch(
  //     adminListingActions.sendEmailInvitation(candidateid)
  //   );

  //   if (res?.payload?.statusCode === 201) {
  //     getCandidateListData(pageNo, pageSize, searchData);
  //     showSweetAlert({
  //       title:
  //         type === 1
  //           ? "Email Invitation sent successfully."
  //           : "Email Invitation re-send successfully.",
  //       type: "success",
  //     });
  //   } else {
  //     showSweetAlert({
  //       title: res?.error?.message
  //         ? res?.error?.message
  //         : "Error while sending invitation",
  //       type: "error",
  //     });
  //   }
  // };

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

  const loadOptions = async (inputValue) => {
    if (inputValue.length > 0) {
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
          label: `${rest.location}, ${rest.statename}`,
        };
      });
    }
  };

  const getFormValues = () => {};
  const applyFilter = async () => {
    setPageNo(1);
    getCandidateListData(1, pageSize, searchData);
  };

  const clearFilter = async () => {
    setPageNo(1);
    setStateData({ value: "", label: "Search city/state" });
    setSearchText("");
    setSource("");
    setStatus("");
    getCandidateListData(1, pageSize, "", true);
  };

  const getLocationDetails = (event) => {
    let locationSplit = event.value.split(", ");

    setStateData({
      value:
        locationSplit[0] +
        ", " +
        locationSplit[1] +
        ", " +
        locationSplit[2] +
        ", " +
        locationSplit[3],
      label: locationSplit[2] + ", " + locationSplit[3],
    });
  };

  const showCandidateProfile = async (id) => {
    let res1 = await dispatch(
      authActions.postAddAuditLogs({
        useractivityid: 0,
        userid: localStorage.getItem("userId")
          ? localStorage.getItem("userId")
          : 0,
        datasource: "edit candidate",
        ipaddress: localStorage.getItem("publicip")
          ? localStorage.getItem("publicip")
          : "Web",
        resource: "admin",
        functionname: "editCandidate",
        pagename: "editcandidateprofile",
        createddate: new Date().toISOString(),
      })
    );
    setShowProfile(true);
    localStorage.setItem("admcandid", id);
  };

  const backToList = () => {
    clearFilter();
    setShowProfile(false);
    localStorage.removeItem("admcandid");
  };

  const onSaveClose = () => {
    clearFilter();
    setShowAddCandMod(false);
  };

  const onSaveCloseNext = (id) => {
    setShowAddCandMod(false);
    localStorage.setItem("admcandid", id);
    setShowProfile(true);
  };

  const onCandidateClick = async (candidateId) => {
    const response = await dispatch(
      getProfileActions.getCandidate(candidateId)
    );
    if (response?.payload) {
      setShowProfileModal(true);
    }
  };
  return (
    <>
      {" "}
      {!showProfile ? (
        <Row>
          <Col md="12">
            <PageTitle heading={title} icon={icon} />
          </Col>
          <Col md="12">
            <Card className="mb-3">
              <CardBody>
                <Row>
                  <Col md={8} lg={8} sm={12} style={{ paddingBottom: "1rem" }}>
                    <Form onSubmit={(e) => getFormValues(e)}>
                      <Row>
                        <Col md={6} lg={3} sm={12}>
                          <FormGroup>
                            <Input
                              id={"search"}
                              name={"serach"}
                              type={"text"}
                              value={searchData}
                              onChange={(e) => {
                                setSearchText(e.target.value);
                              }}
                              placeholder="Search name, email"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6} lg={3} sm={12} style={{ zIndex: "9999" }}>
                          <FormGroup>
                            <AsyncSelect
                              name={"city"}
                              placeholder="Search city or zipcode"
                              loadOptions={loadOptions}
                              isMulti={false}
                              styles={customStyles}
                              value={stateData}
                              onChange={(e) => getLocationDetails(e)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6} lg={3} sm={12}>
                          <FormGroup>
                            <Input
                              type="select"
                              name="source"
                              value={source}
                              onChange={(e) => setSource(e.target.value)}
                            >
                              <option value={""}>All Source</option>
                              <option value={"Admin"}>Admin</option>
                              <option value={"Registration"}>
                                Registration
                              </option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={6} lg={3} sm={12}>
                          <FormGroup>
                            <Input
                              type="select"
                              name="status"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value={""}>All Status</option>
                              <option value={"0"}>Email not sent</option>
                              <option value={"1"}>Email send</option>
                              <option value={"2"}>Active</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4" md="6" sm="12">
                          <Button
                            style={{ background: "rgb(47 71 155)" }}
                            color="primary"
                            type="button"
                            onClick={() => applyFilter()}
                          >
                            {" "}
                            Search
                          </Button>
                          <Button
                            color="link"
                            type="button"
                            style={{ marginLeft: "1rem" }}
                            onClick={() => clearFilter()}
                          >
                            {" "}
                            Clear
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col md={4} lg={4} sm={12} style={{ paddingBottom: "1rem" }}>
                    <Button
                      style={{ background: "#2f479b" }}
                      color={"primary"}
                      className="input-group-text float-end mt-1"
                      type="submit"
                      onClick={(e) => setShowAddCandMod(true)}
                    >
                      New Candidate
                    </Button>
                  </Col>
                </Row>
                {candListLoading ? (
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                ) : (
                  <>
                    {candidateList.length > 0 ? (
                      <Row>
                        <DataTable
                          data={candidateList}
                          columns={columns}
                          pagination
                          fixedHeader
                          customStyles={customStyles}
                          // progressPending={candListLoading}
                          responsive
                          paginationServer
                          paginationDefaultPage={pageNo}
                          paginationTotalRows={candTotalRecords}
                          onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                          onChangePage={(e) => handlePageChange(e)}
                        />
                      </Row>
                    ) : (
                      <Row className="center-align ">
                        <NoDataFound></NoDataFound>
                      </Row>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={12} lg={12} sm={12}>
            <Button
              style={{ background: "#2f479b", marginBottom: "1rem" }}
              color={"primary"}
              className="input-group-text float-end mt-1"
              type="submit"
              onClick={(e) => backToList()}
            >
              Back to list
            </Button>
          </Col>
          <Col md={12} lg={12} sm={12}>
            <CandidateProfile></CandidateProfile>
          </Col>
        </Row>
      )}
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
      <>
        {showAddCandMod ? (
          <>
            <NewCandidateModal
              isOpen={showAddCandMod}
              onClose={() => setShowAddCandMod(false)}
              onSaveClose={() => onSaveClose()}
              onSaveCloseNext={(id) => onSaveCloseNext(id)}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
};
