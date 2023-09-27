import React, { useState } from "react";
import { Row, Col, Table, Input, FormGroup, Form, Button } from "reactstrap";
import cx from "classnames";
import "./createJob.scss";
import { BsEye } from "react-icons/bs";
import { CardPagination } from "_components/Common/cardpagination";

export default function SearchPreviousJob() {
  const dummy = [
    {
      jobId: "1",
      jobTitle: "Java Developer",
      dateCreated: "Sept 02, 2023",
      location: "Graysville, Connecticut, USA",
    },
    {
      jobId: "2",
      jobTitle: "React Developer",
      dateCreated: "Sept 05, 2023",
      location: "Graysville, Connecticut, USA",
    },
    {
      jobId: "3",
      jobTitle: "Angular Developer",
      dateCreated: "Sept 13, 2023",
      location: "Graysville, Connecticut, USA",
    },
    {
      jobId: "4",
      jobTitle: "IOS Developer",
      dateCreated: "Sept 20, 2023",
      location: "Triana, Alaska, USA",
    },
  ];
  const [showButton, setShowButton] = useState(false);
  const getSearchValue = (event) => {
    event.preventDefault();
    console.log(event.target.elements.search.value);
  };
  const removeSearchValue = (event) => {
    event.preventDefault();
    event.target.form[0].value = "";
    console.log("");
    setShowButton(false);
  };

  const onSearch = (event) => {
    if (event.target.value.length > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };
  const handlePageChange = () => {};
  return (
    <>
      <Row className="mt-4">
        <Col md={4}>
          <Form onSubmit={getSearchValue}>
            <FormGroup>
              <div className={cx("search-wrapper", { active: true })}>
                <div className="input-holder">
                  <input
                    type="text"
                    className="search-input"
                    id="search"
                    name="search"
                    placeholder={"Search by job title, location"}
                    onChange={(e) => onSearch(e)}
                  />
                  <button className="search-icon">
                    <span />
                  </button>
                </div>
                {showButton === true && (
                  <button
                    style={{ left: "220px", padding: "0px" }}
                    className="btn-close close-button"
                    onClick={(e) => removeSearchValue(e)}
                  />
                )}
              </div>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={11} style={{ marginLeft: "15px" }}>
          <Table className="mb-0" striped bordered>
            <thead>
              <tr>
                <th width={"4%"}> </th>
                <th className="table-header-custom">Job</th>
                <th className="table-header-custom">Date posted</th>
                <th className="table-header-custom">Locations</th>
                <th className="table-header-custom">Action</th>
              </tr>
            </thead>
            <tbody>
              {dummy.length > 0 &&
                dummy.map((job) => (
                  <tr key={job.jobId}>
                    <td align="center">
                      <Input
                        type="radio"
                        name="jobs"
                        id="jobRows"
                        value={job.jobId}
                      />
                    </td>
                    <td>{job.jobTitle}</td>
                    <td>{job.dateCreated}</td>
                    <td>{job.location}</td>
                    <td>
                      <Button color="primary" className="action-button">
                        <BsEye className="action-icon" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={11}>
          <div className="float-end custom-pagination-div">
            <CardPagination
              totalPages={1}
              pageIndex={1}
              onCallBack={handlePageChange}
            ></CardPagination>
          </div>
        </Col>
      </Row>
    </>
  );
}
