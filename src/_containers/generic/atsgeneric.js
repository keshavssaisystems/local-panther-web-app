import React, { useEffect, useState } from "react";
import PageTitle from "_components/common/pagetitle";
import { USPhoneNumber } from "_helpers/helper";
import DataTable from "react-data-table-component";
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input,
    Button

} from "reactstrap";

import { fetchATSGenericList, setATSDefault } from "_store/atsgeneric.slice";
import { clearDropdownCache } from "_helpers/fetch-wrapper";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import "./atsgeneric.css"; 
import Loader from "react-loaders";
import { useLocation } from "react-router-dom";
import AddClient from "_containers/customer/atscompanylist/addclient";

function ATSGenericList() {
    let isCompanyAdmin = true;

    const icon = "mdi mdi-account-multiple-outline";

    const dispatch = useDispatch();
    // read candidates and loading directly from redux so component re-renders when data arrives
    const data = useSelector((state) => state.atsgeneric.atsgeneric || []);
    const header = useSelector((state) => state.atsgeneric.header || {});
    const loading = useSelector((state) => state.atsgeneric?.loader || false);

    const location = useLocation(); 
    const path = location.pathname.toLowerCase();
    //for path
    const endpointMap = { "/ats/atscompany": "Get_ATS_Company_List", 
                         "/ats/atscontact": "Get_ATS_HiringManagerContact_List", 
                         "/ats/atsassignee": "Get_ATS_EmployeeAssignedUsers_List",
                        };
    const endpoint = endpointMap[path];
    //for title
    const titleMap = {
      "/ats/atscompany": "Client List",
      "/ats/atscontact": "Contact List",
      "/ats/atsassignee": "Assignee List",
    };
    const title =  titleMap[path] || "ATS";
    //for entity
    const entityMap = {
      "/ats/atscompany": "atscompany",
      "/ats/atscontact": "atscontact",
      "/ats/atsassignee": "atsassignee",
    };
    let entity = entityMap[path];

    // config for Set_ATS_Default endpoint per entity
    const defaultEntityConfig = {
      "/ats/atscompany":  { entityType: "ClientCompany", pkField: "pkatscompanyid",       rowField: "ID" },
      "/ats/atscontact":  { entityType: "Contact",       pkField: "hiringmanagercontactid", rowField: "hiringmanagercontactid" },
      "/ats/atsassignee": { entityType: "AssignedTo",    pkField: "employeeassignedusersid", rowField: "employeeassignedusersid" },
    };
    const entityConfig = defaultEntityConfig[path];

    //add user
    const [showAddClient, setShowAddClient] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    
    // pagination state
    const [currentPage, setCurrentPage] = useState(1); 
    const [perPage, setPerPage] = useState(10);
    const totalRows = useSelector((state) => state.atsgeneric?.totalrows || 0);
    const [searchData, setSearchData] = useState("");
    const [statusFilter, setStatusFilter] = useState(3);
    const setSearchText = (text) => {
        setSearchData(text);
    };
    const generateColumns = (rows, headerWidths = {}) => {
        if (!rows || rows.length === 0) return [];

        const sample = rows[0]; // take first row keys
        // Only render columns that BE explicitly declared in the header widths config.
        // This automatically hides PK fields (e.g. hiringmanagercontactid) and any
        // other internal fields that have no width entry.
        // 'is_default' is handled inline with a toggle cell renderer.

        return Object.keys(sample)
            .filter((key) => headerWidths.hasOwnProperty(key))
            .map((key) => {
                const width = headerWidths[key];

                if (key === "is_default") {
                    return {
                        name: "Is Default",
                        selector: (row) => row.is_default,
                        cell: (row) => {
                            const pkValue = row[entityConfig?.rowField];
                            const isActive = !!row.is_default;
                            const isToggling = togglingId === pkValue;
                            return (
                                <div
                                    onClick={() => !isToggling && handleToggleDefault(row)}
                                    title={isActive ? "Default" : "Set as Default"}
                                    style={{
                                        width: "40px",
                                        height: "20px",
                                        borderRadius: "10px",
                                        background: isActive ? "#2f479b" : "#ccc",
                                        position: "relative",
                                        cursor: isToggling ? "not-allowed" : "pointer",
                                        transition: "background 0.2s",
                                        opacity: isToggling ? 0.5 : 1,
                                        flexShrink: 0,
                                    }}
                                >
                                    <div style={{
                                        position: "absolute",
                                        top: "2px",
                                        left: isActive ? "22px" : "2px",
                                        width: "16px",
                                        height: "16px",
                                        borderRadius: "50%",
                                        background: "#fff",
                                        transition: "left 0.2s",
                                    }} />
                                </div>
                            );
                        },
                        wrap: false,
                        sortable: false,
                        width: width ? `${width}%` : "auto",
                        center: true,
                    };
                }

                return {
                    name: key.replace(/([A-Z])/g, "$1")       // convert camelCase
                        .replace(/_/g, " ")                   // convert snake_case
                        .replace(/\b\w/g, (c) => c.toUpperCase()), // capitalize words
                    selector: (row) => {
                        if (key === "isactive") {
                            return row[key] ? "Active" : "Inactive";
                        }
                        return row[key] ?? "-";
                    },
                    wrap: true,
                    sortable: true,
                    width: width ? `${width}%` : "auto",
                };
            });
    };

    // Maps ATS entityType → the GetCommonDropdown searchText key used on the job post page.
    // Only these three keys are cleared; all other dropdown caches remain intact.
    const entityTypeToDropdownKey = {
      ClientCompany: "ClientCompany",
      Contact: "ClientContact",
      AssignedTo: "AssignedTo",
    };

    const handleToggleDefault = async (row) => {
        if (!entityConfig) return;
        const { entityType, pkField, rowField } = entityConfig;
        const pkValue = row[rowField];
        if (pkValue === undefined || pkValue === null) return;
        setTogglingId(pkValue);
        try {
            await dispatch(setATSDefault({ entityType, pkField, pkValue }));
            // Bust the cache for the matching dropdown so the job post page
            // reflects the new default immediately instead of waiting for the
            // 5-minute TTL to expire.
            const dropdownKey = entityTypeToDropdownKey[entityType];
            if (dropdownKey) {
                clearDropdownCache(dropdownKey);
            }
            fetchData(currentPage, perPage, statusFilter, searchData);
        } catch (err) {
            // silent
        } finally {
            setTogglingId(null);
        }
    };

    const columns = generateColumns(data, header);
   // fetch helper - requests server with paging params and updates local totalRows
    const fetchData =async (page = 1, pageSize = perPage, statusFilter, searchText = "") => {
         try {
                 const params = {    
                SearchText: searchText || "",
                IsActive: statusFilter ?? 3,
                currentpage: page,
                PageSize: pageSize,
                };
                const result = await dispatch(fetchATSGenericList({endpoint,params}));
                
            } 
            catch (error) {
            }
};

    useEffect(() => {
         setSearchData("");
         setStatusFilter(3);
         setCurrentPage(1);
         fetchData(1, perPage);
    
    },[path]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchData(page, perPage, statusFilter, searchData);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
        fetchData(page, newPerPage, statusFilter, searchData);
    };

    const onStatusSelect = (status) => {
        const newStatus = Number(status);
        setStatusFilter(newStatus);
        fetchData(currentPage, perPage, newStatus, searchData);
    };

    const onClearSearch = () => {
        setSearchData("");
        fetchData(currentPage, perPage, statusFilter, "");
    };
    
    const customStyles = {
        headCells: {
            style: {
                color: "#2F479B",
                fontFamily: "Capitana",
                fontSize: "16px",
                fontWeight: "400",
            },
        },
        cells: {
            style: {
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
            },
        },
    };
    return (
        <div>
            <Row>
                <Col md="12">
                    <PageTitle
                        heading={entity === "roles" ? "Menu Mapping" : title}
                    // icon={icon}
                    />
                </Col>

                <Col md="12">
                    <Card className="mb-3">
                        <CardBody>
                            {loading && (
                                <div className="overlay-loader">
                                    <Loader
                                        type="line-scale-pulse-out-rapid"
                                        className="d-flex justify-content-center"
                                    />
                                </div>
                            )}
                            <Row className="mb-3">

                                <Col
                                    xxl={isCompanyAdmin ? 3 : 2}
                                    xl={isCompanyAdmin ? 3 : 2}
                                    md={isCompanyAdmin ? 4 : 3}
                                    lg={isCompanyAdmin ? 3 : 2}
                                    sm={12}
                                    xs={12}
                                >
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="status"
                                            value={statusFilter}
                                            onChange={(e) => onStatusSelect(e.target.value)}
                                        >
                                            <option value={3}>All status</option>
                                            <option value={1}>Active</option>
                                            <option value={0}>In-active</option>
                                        </Input>
                                     </FormGroup>
                                </Col>
                                <Col>
                                     {path == "/ats/atscompany" && ( 
                                        <Button 
                                        style={{
                                         background: "#2f479b",
                                         borderColor: "#545cd8",
                                        }}
                                        className="input-group-text float-end mt-1"
                                        color="primary" 
                                        onClick={() => setShowAddClient(true)}
                                        >
                                          Add Client
                                         </Button> )}
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
                                                onClick={(evt) => fetchData(currentPage, perPage, statusFilter, searchData)}
                                                className="search-icon"
                                            >
                                                <span />
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* wrap table to enable horizontal scrolling */}
                            <div className="table-scroll-wrapper">
                                <div className="table-inner">
                                    
                                    <DataTable
                                        data={data}
                                        columns={columns}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={totalRows}
                                        paginationPerPage={perPage}
                                        paginationDefaultPage={currentPage}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        progressPending={loading}
                                        fixedHeader
                                    />
                                    
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <AddClient 
                isOpen={showAddClient}
                onClose={() => setShowAddClient(false)}
                onSuccess={() => fetchData(currentPage, perPage, statusFilter, searchData)}
            />
        </div>
    );
};

export default ATSGenericList;