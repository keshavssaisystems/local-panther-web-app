import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Form,
  Col,
  Row,
  InputGroup,
  Input,
  Button,
} from "reactstrap";
import { BsSearch } from "react-icons/bs";
import { getHiringMangerList } from "_store";
export const CustJobFilter = (props) => {
  const dispatch = useDispatch();
  const hiringManagerDownList = useSelector((state) => state?.customerReportReducer?.hiringmangers);

  const getSelectData = (event) => {
    event.preventDefault();
    props.setSelectedOpt(event.target.value);
    props.setSearchText("");
    props.setHiringMangerId("");
    if (event.target.value === "JobTitle") {
      props.setPlaceHolder("Search job title");
    } else {
      props.setPlaceHolder("Search " + event.target.value.toLowerCase());
    }
  };
  const getFilterValue = (event) => {
    event.preventDefault();
    props.onSearchData();
  };
  const getJobStatusData = (event) => {
    props.onJobStatusChange(event);
  };
 const getJobHiringMangerData = (event) => {
    props.onJobHiringMangerChange(event);
  };
  useEffect(() => {
    let companyId = Number(localStorage.getItem("companyid"));
    dispatch(getHiringMangerList(companyId));
  }, [dispatch])

  return (
    <>
      <Col md="12">
        <Card className="main-card mb-3 card-filter">
          <CardBody>
            <Row>
              <Col xs={12} sm={8} lg={6} md={6} xl={4} xxl={3}>
                <Form onSubmit={(e) => getFilterValue(e)}>
                  <InputGroup>
                    <Input
                      name="searchType"
                      type="select"
                      className="fw-bold search-dropdown"
                      value={props.selectedOpt}
                      onChange={(e) => getSelectData(e)}
                    >
                      <option value={"JobTitle"}>Search</option>
                      <option value={"State"}>State</option>
                      <option value={"City"}>City</option>
                      <option value={"Skills"}>Skill</option>
                    </Input>
                    <Input
                      type="search"
                      placeholder={props.placeHolder}
                      value={props.searchText}
                      name="searchValue"
                      onChange={(e) => props.setSearchText(e.target.value)}
                    />
                    <Button
                      color={"primary"}
                      className="input-group-text"
                      type="submit"
                    >
                      <BsSearch />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col xs={0} sm={0} lg={2} md={1} xl={2} xxl={3}></Col>
              {/* <Col xs={12} sm={8} lg={6} md={6} xl={4} xxl={3}>
                <Input
                  name="jobStatus"
                  type="select"
                  defaultValue=""
                  onChange={(e) => getJobStatusData(e.target.value)}
                >
                  <option value={""}>All jobs</option>
                  <option value={"Publish"}>Publish jobs</option>
                  <option value={"Draft"}>Draft jobs</option>
                  <option value={"Closed"}>Closed jobs</option>
                </Input>
              </Col> */}
              <Col xs={12} sm={8} lg={6} md={6} xl={4} xxl={3}>
                <Input
                  type="select"
                  value={props.hiringManagerId}
                  name="hiringmanagerId"
                  id="hiringmanagerId"
                  placeholder="Hiring Manger"
                  onChange={(e) => {
                    props.setHiringMangerId(e.target.value);
                    getJobHiringMangerData(e.target.value);
                  }}
                >
                  <option value={""}>Select a Hiring Manger</option>
                  {hiringManagerDownList?.length > 0 ? (
                    hiringManagerDownList.map((data) => (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </Input>
              </Col>
              <Col xs={12} sm={8} lg={6} md={6} xl={4} xxl={3}>
                <Input
                  name="jobStatus"
                  type="select"
                  defaultValue=""
                  onChange={(e) => getJobStatusData(e.target.value)}
                >
                  <option value={""}>All jobs</option>
                  <option value={"Publish"}>Publish jobs</option>
                  <option value={"Draft"}>Draft jobs</option>
                  <option value={"Closed"}>Closed jobs</option>
                </Input>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};
