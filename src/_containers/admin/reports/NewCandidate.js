import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, FormGroup, Label, InputGroup, Button } from "reactstrap";
import { Table } from "_widgets";
import { SelectFormGroup } from "_components/formComponents/SelectFormGroup";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faFileExcel, faFilePdf, faSearch } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import { newCandidateThunk } from "../_redux/report.slice";

const columns = [
  {
      name: 'Candidate',
      selector: row => row.name,
      sortable: true,
  },
  {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
  },
  {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
  },
  {
      name: 'Skills',
      selector: row => row.skills,
      sortable: true,
  },
];


export function NewCandidate() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(newCandidateThunk())
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { newCandidate: data = [] } = useSelector((state) => state?.adminReportReducer ?? {});

  return (
    <>
      <PageTitle heading="New Candidate" icon={titlelogo} />
      <Row>
        <Col lg="2" md="2" sm="12" sx="12">
          <SelectFormGroup 
            label="Skills"
            id="skills"
            name="skills"
            defaultOption="Select Skills"
          />
        </Col>
        <Col lg="2" md="2" sm="12" sx="12">
          <SelectFormGroup 
            label="Location"
            id="location"
            name="location"
            defaultOption="Select Location"
          />
        </Col>
        <Col lg="2" md="2" sm="12" sx="12">
          <FormGroup>
            <Label for="fromDate" className="input-label">
              From
            </Label>
            <InputGroup>
              <div className="input-group-text">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <DatePicker
                name="fromDate"
                id="fromDate"
                placeholderText="DD/MM/YYYY"
                className="form-control"
                // selected={item.startdate}
                // onChange={(evt) =>
                //   handleInputChange("fromDate", index, evt)
                // }
              />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col lg="2" md="2" sm="12" sx="12">
        <FormGroup>
            <Label for="fromDate" className="input-label">
              To
            </Label>
            <InputGroup>
              <div className="input-group-text">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <DatePicker
                name="fromDate"
                id="fromDate"
                placeholderText="DD/MM/YYYY"
                className="form-control"
                // selected={item.startdate}
                // onChange={(evt) =>
                //   handleInputChange("fromDate", index, evt)
                // }
              />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col lg="2" md="2" sm="12" sx="12">
          <FormGroup>
            <Label for="fromDate" className="input-label">
              .
            </Label>
            <InputGroup>
              <Button
                className="btn-square btn btn-primary"
                type="button"
                // onClick={() => onSubmit()}
              >
              <FontAwesomeIcon icon={faSearch} />  Search
              </Button>
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>

      <Row style={{flexDirection: "row-reverse", paddingBottom: '10px' }}>
        <Col lg="1" md="1" sm="12" sx="12">
          <Button
            className="mb-2 mr-2 btn-square btn btn-primary"
            type="button"
            // onClick={() => onSubmit()}
          >
          <FontAwesomeIcon icon={faFileExcel} /> Excel
          </Button>
        </Col>
        <Col lg="1" md="1" sm="12" sx="12">
          <Button
            className="mb-2 mr-2 btn-square btn btn-primary"
            type="button"
            // onClick={() => onSubmit()}
          >
            <FontAwesomeIcon icon={faFilePdf} /> {""}  PDF
          </Button> 
        </Col>
      </Row>

      <Row>
        <Col lg="12" md="12" sm="12" sx="12">
          <Table 
            columns={columns}
            data={data}
          />
        </Col>
      </Row>
    </>
  );
}
