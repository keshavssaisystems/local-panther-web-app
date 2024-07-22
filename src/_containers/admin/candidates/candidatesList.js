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
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { FaEnvelopeOpenText, FaEnvelope } from "react-icons/fa";
import customerIcons from "assets/utils/images/customer";
import DataTable from "react-data-table-component";
import { adminListingActions, getLocation } from "_store";
import { USPhoneNumber } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";
import AsyncSelect from "react-select/async";

export const AdmCandidateList = () => {
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState({
    value: "",
    label: "Search city or zip code",
  });
  const [searchData, setSearchText] = useState("");
  const candidateList = useSelector(
    (state) => state.adminListing?.candidateList
  );
  const candTotalRecords = useSelector(
    (state) => state.adminListing?.candTotalRecords
  );
  useEffect(() => {
    getCandidateListData(pageNo, pageSize, searchData);
  }, []);

  let title = "Candidates";
  let icon = companyLogo;
  let columns = [
    {
      name: "Name",
      id: "name",
      selector: (row) => row.firstname + " " + row.lastname,

      sortable: true,
    },

    {
      name: "Email",
      id: "cityname",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Phone",
      id: "phone",
      selector: (row) =>
        row.phonenumber ? USPhoneNumber(row.phonenumber) : "",
      sortable: true,
    },
    {
      name: "City & State",
      id: "city",
      selector: (row) =>
        (row.cityname ? row.cityname : "") +
        " " +
        (row.statename ? "," + row.statename : ""),
      sortable: true,
    },
    {
      name: "Source",
      id: "source",
      selector: (row) => row.source,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <ButtonGroup>
            {row.status === 0 ? (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Edit candidate"
                  className="btn-icon"
                  color="warning"
                  disabled
                  onClick={(e) => {}}
                >
                  <img src={customerIcons?.list_edit} alt="list approve"></img>
                </Button>

                <Button
                  // outline
                  size="sm"
                  title="Send Invitation"
                  className="btn-icon"
                  color="info"
                  onClick={(e) => {
                    sendEmailInvitation(row.candidateid);
                  }}
                >
                  <FaEnvelope style={{ fontSize: "18px" }} />
                </Button>
              </>
            ) : row.status === 1 ? (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Edit candidate"
                  className="btn-icon"
                  color="warning"
                  disabled
                  onClick={(e) => {}}
                >
                  <img src={customerIcons?.list_edit} alt="list approve"></img>
                </Button>

                <Button
                  // outline
                  size="sm"
                  title="Re-Send Invitation"
                  className="btn-icon"
                  color="info"
                  onClick={(e) => {
                    sendEmailInvitation(row.candidateid);
                  }}
                >
                  <FaEnvelopeOpenText style={{ fontSize: "18px" }} />
                </Button>
              </>
            ) : (
              <></>
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

  const sendEmailInvitation = async (candidateid) => {
    let res = await dispatch(
      adminListingActions.sendEmailInvitation(candidateid)
    );

    if (res?.payload?.statusCode === 201) {
      getCandidateListData(pageNo, pageSize, searchData);
      showSweetAlert({
        title: res?.payload?.message
          ? res.payload.message
          : "Email Invitation sent successfully.",
        type: "success",
      });
    } else {
      showSweetAlert({
        title: res?.error?.message
          ? res?.error?.message
          : "Error while sending invitation",
        type: "error",
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
    setStateData({ value: "", label: "Search city or zip code" });
    setSearchText("");
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
                      <Col md={8} lg={5} sm={12} style={{ zIndex: "9999" }}>
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
                    disabled
                    // onClick={(e) => addModal()}
                  >
                    New Candidate
                  </Button>
                </Col>
              </Row>
              <DataTable
                data={candidateList}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
                progressPending={loading}
                responsive
                paginationServer
                paginationTotalRows={candTotalRecords}
                onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                onChangePage={(e) => handlePageChange(e)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
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
};
