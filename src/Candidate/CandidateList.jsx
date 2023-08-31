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

    let jobId = 2;
    const [candidatesList, setCandidateList] = useState([])
    const [getCandidateList, setList] = useState([]);
    const [showCandidate, setshowCandidate] = useState(false);
    const [selectedCandidate, setselectedCandidate] = useState();
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState()
    let isExpError = false
    let expError = false
    const [searchText, setSearchText] = useState('')
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
        debugger;
        console.log(searchText);
        if (isExpError) {
            return
        }
        let url = 'JobApplications/GetJobAppliedCandidatesList/' + 2 + '?pageSize=' + pageSize + '&pageNumber=' + pageIndex + '&isActive=true'
        if (searchText) {
            url += '&searchText=' + searchText
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
        if (minExp && maxExp) {
            if (minExp > maxExp) {
                isExpError = true
                return
            }
        }
        else{
            isExpError = false
        }
       
    }

    const onSelectCandidate = function (data) {
        setselectedCandidate(data)
        setshowCandidate(true)

    }

    const onSearch = function (data) {
        debugger;
        searchData = data
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
                    <CardTitle className="mt-3 ml-3" style={{ fontSize: '21px', marginLeft: '20px' }}>Candidate List{isExpError}
                    </CardTitle>
                    <CardBody>
                        <div>
                            <Row>
                                <Col className="col-md-5">
                                    <Row>
                                       
                                        <Col className="col-md-3 mb-3">
                                            <Input type="text" id="minExperience" name="minExperience" placeholder="Min Exp"
                                                onInput={(evt) => onHandleExpChange('min', evt.target.value)}>
                                            </Input>


                                        </Col>
                                        {isExpError ? <h6 style={{ color: 'warn' }}>Minimum experience should be less than Max Experience</h6> : ""}

                                        <Col className="col-md-3 mb-3">

                                            <Input type="text" id="maxExperience" name="maxExperience" placeholder="Max Exp"
                                                onInput={(evt) => onHandleExpChange('max', evt.target.value)}>
                                            </Input>
                                        </Col>

                                        <Col className="col-md-6">
                                            <Button style={{ backgroundColor: 'rgb(33 91 153)' }} className="col-md-3 me-2"
                                                onClick={(evt) => getCandidatesList()}>
                                                submit
                                            </Button>
                                            <Button style={{ backgroundColor: 'rgb(33 91 153)' }} className="col-md-3"
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
                                            <input type="text" className="search-input" onInput={(evt) => onSearch(evt.target.value)} placeholder="Search by name/skill/location" />
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
                                                    <th style={{ cursor: 'pointer' }} scope="row" onClick={(evt) => onSelectCandidate(col)}>{col.firstname}</th>
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

                        </div>
                    </CardBody>
                </Card>
                : <div>

                    <CandidateDetails selectedData={selectedCandidate} jobId={jobId}></CandidateDetails>
                </div>}

        </div>
    );
}
