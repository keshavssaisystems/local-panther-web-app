import { Title } from "chart.js";
import React, { useState, useEffect } from "react";
import {
    Table, Label, Input, Pagination,
    PaginationItem,
    PaginationLink, Card, CardBody, CardTitle
} from "reactstrap";
import {
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
// import Select from "react-select";
import { candidateActions } from '_store';
import { Row, Col, Button } from "reactstrap";
import cx from "classnames";
import { useSelector, useDispatch } from 'react-redux';
import { CandidateDetails } from './candidateDetails';


export function CandidateList() {
    const dispatch = useDispatch();
    const [data, setData] = useState()
    const columns = [
        {
            name: "First Name",
            selector: row => row.firstName,
            sortable: true,
        },
        {
            name: "Last Name",
            id: "lastName",
            selector: row => row.lastName,
            sortable: true,
        },

        {
            name: "Experience",
            selector: row => row.experienceyears,
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: row => row.phonenumber,
            sortable: true,
        },

        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
        },
    ];
    const [filteredExp, setfilteredExp] = useState({})
    const [selectedOption, setselectedOption] = useState()
    const [candidatesList, setCandidateList] = useState([])
    const [getCandidateList, setList] = useState([]);
    const [showCandidate, setshowCandidate] = useState(false);
    const [tempList, setTempList] = useState([]);
    const [selectedCandidate, setselectedCandidate] = useState();
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState()
    const [searchText, setSearchText] = useState('')
    let [minExperience, setMinExperience] = useState(0)
    let [maxExperience, setMaxExperience] = useState(0)
    let minExp = 0
    let maxExp = 0
    let searchData = ''

    const [expList, setExpList] = useState([
        {
            value: 1, label: "1"
        },
        {
            value: 2, label: "2"
        },
        {
            value: 1, label: "3"
        },
        {
            value: 2, label: "4"
        },
        {
            value: 1, label: "5"
        },
        {
            value: 2, label: "6"
        }])


    useEffect(() => {
        getCandidatesList()
    }, []);

    useEffect(() => {
        setCandidateList(getCandidateList)
    }, [getCandidateList]);



    const getCandidatesList = async function () {
        console.log(minExperience);
        debugger;
        let url = 'JobApplications/GetJobAppliedCandidatesList/' + 2 + '?pageSize=' + pageSize + '&pageNumber=' + pageIndex + '&isActive=true'
        if (searchData) {
            url += '&searchText=' + searchData
        }
        if (minExp) {
            url += '&minExperience=' + minExp
        }
        if (maxExp) {
            url += '&maxExperience=' + maxExp
        }


        let response = await dispatch(candidateActions.getCandidates({ url }));
        setList(response.payload.data.candidateList);
        setTotalRecords(response.payload.data.totalRecords);

    }

    const onchangePage = function (data) {
        setPageIndex(data.target.value)
        getCandidatesList()
    }

    const onHandleExpChange = function (check, event) {
        debugger;
        check == 'min' ? minExp = Number(event) : maxExp = Number(event)
        getCandidatesList()
    }

    const onSelectCandidate = function (data) {
        setselectedCandidate(data)
        setshowCandidate(true)

    }

    const onSearch = function (data) {
        searchData += data.target.value
        setSearchText(searchData)
        console.log(searchText);

    }
    const onClearSearch = function () {
        window.location.reload()
    }




    return (
        <div>

            {!showCandidate ?
                <Card>
                    <CardTitle className="mt-3 ml-3" style={{ fontSize: '21px', marginLeft: '20px' }}>Candidate List
                    </CardTitle>
                    <CardBody>
                        <div>
                            <Row>
                                <Col className="col-md-6">
                                    <Row>
                                        <Col className="col-md-2">
                                            <Label className="me-0">Min Exp</Label>
                                        </Col>
                                        <Col className="col-md-3 mb-3">
                                            <Input type="select" id="minExperience" name="minExperience" placeholder="Min Exp"
                                                onChange={(evt) => onHandleExpChange('min', evt.target.value)}>
                                                <option value=""></option>
                                                {expList.map((col) => (
                                                    <option value={col.value}>{col.label}</option>
                                                ))}
                                            </Input>
                                        </Col>

                                        <Col className="col-md-2">
                                            <Label>Max Exp</Label>
                                        </Col>
                                        <Col className="col-md-3 mb-3 ">
                                            <Input type="select" id="maxExperience" name="maxExperience" placeholder="Max Exp"
                                                onChange={(evt) => onHandleExpChange('max', evt.target.value)}>
                                                <option value=""></option>
                                                {expList.map((col) => (
                                                    <option value={col.label}>{col.label}</option>
                                                ))}
                                            </Input>
                                        </Col>



                                        <Col className="col-md-2">
                                            <Button style={{ backgroundColor: 'rgb(33 91 153)' }} className="col-md-5"
                                                onClick={(evt) => getCandidatesList()}>
                                                reset
                                            </Button>
                                        </Col>
                                    </Row>

                                </Col>

                                <Col className="col-md-6">
                                    <div
                                        className={cx("search-wrapper", {
                                            active: true,
                                        })} style={{ marginLeft: '75%' }}>
                                        <div className="input-holder">
                                            <input type="text" className="search-input" onChange={(evt) => onSearch(evt)} placeholder="Search by name/skill/location" />
                                            <button onClick={(evt) => getCandidatesList()}
                                                className="search-icon">
                                                <span />
                                            </button>
                                        </div>
                                        <button onClick={(evt) => onClearSearch()} style={{ left: '220px' }}
                                            className="btn-close" />
                                    </div>


                                </Col>

                            </Row>
                            <Row>
                                <Table striped className="mb-0 mt-2">
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Experience</th>
                                            <th>Mobile Number</th>
                                            <th>Email</th>

                                        </tr>
                                    </thead>

                                    {candidatesList.length > 0 ?
                                        <tbody>
                                            {candidatesList.map((col) => (
                                                <tr>
                                                    <th scope="row" onClick={(evt) => onSelectCandidate(col)}>{col.firstname}</th>
                                                    <td>{col.lastname}</td>
                                                    <td>{col.experienceyears}</td>
                                                    <td>{col.phonenumber}</td>
                                                    <td>{col.email}</td>
                                                </tr>
                                            ))
                                            }
                                        </tbody> : <></>}




                                </Table>
                            </Row>
                            {/* <Row className="mt-3 float-end">
                                <Pagination aria-label="Page navigation example">
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>                                    
                                </Pagination>
                            </Row> */}
                        </div>
                    </CardBody>
                </Card>
                : <div>

                    <CandidateDetails selectedData={selectedCandidate}></CandidateDetails>
                </div>}

        </div>
    );
}
