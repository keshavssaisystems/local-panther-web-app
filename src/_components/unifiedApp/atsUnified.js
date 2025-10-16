import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import { useLocation, useNavigate } from 'react-router-dom';
import { createAuthLink } from "_components/unifiedApp/unifiedApp";
import UnifiedDirectory from '@unified-api/react-directory';
import './atsUnified.css';
import { toast } from "react-toastify";
import { atsActions } from "_store/ats.slice";
import { use } from "react";
export default function AtsUnified() {
    const navigate = useNavigate();
    const callUnifiedApp = (ats) => {
        if (ats?.connectionId) {
            navigate('/unified-candidates');
            return;
            //return toast.info("You have already connected with Workable");
        }
        const authUrl = createAuthLink(ats.atstype1?.toLowerCase());
        window.location.href = authUrl; // 
    }

    const dispatch = useDispatch();
    const configuredAtsList = useSelector((state) => state.ats.atsauthorizationList);
    const atstypeList = useSelector((state) => state.ats.atstypeList);
    const user = JSON.parse(localStorage.getItem("userDetails"));
    const [availableAts, setAvailableAts] = useState([]);
    // const allAtsVendors = atstypeList?.map(x => ({
    //     type: x.atstype?.toLowerCase(),
    //     name: x.atstype,
    //     img: `https://api.unified.to/docs/images/${x.atstype?.toLowerCase()}.png`
    // })) || [];

    useEffect(() => {
        (async () => {
            await dispatch(atsActions.getATSList());
            console.log('atstypeList', atstypeList);
        })();
    }, [dispatch]);

    useEffect(() => {
        if (user && user.CompanyId) {
            (async () => {
                await dispatch(atsActions.getCompanyATS({ companyId: user.CompanyId }));
                console.log('configuredAtsList', configuredAtsList);
            })();
        }

    }, [dispatch]);

    useEffect(() => {
        console.log('atstypeList', atstypeList);
        const availableAtsList = atstypeList.filter(
            (type) =>
                !configuredAtsList.some(
                    (auth) => auth.atstype.toLowerCase() === type.atstype1.toLowerCase()
                )
        );

        setAvailableAts(availableAtsList);
    }, [atstypeList, configuredAtsList, dispatch]);


    const handleDeleteAts = (id) => {
        if (window.confirm("Are you sure you want to delete this ATS configuration?")) {
            dispatch(atsActions.deleteAtsAuthorization(id));
        }
    };

    return (
        <div>
            {/* <h1>ATS</h1>         */}
            <div class="unified">
                <div class="unified_menu">
                    <button class="unified_button unified_button_ats active">ATS</button>
                </div>
                {configuredAtsList?.length > 0 &&
                    <div>
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            Configured your ATS account.
                        </div>
                        <div class="unified_vendors">
                            {configuredAtsList?.map(x => (
                                <a class="unified_vendor">
                                    <img alt={x.atstype} src={`https://api.unified.to/docs/images/${x.atstype}.png`} class="unified_image"></img>
                                    <div class="unified_vendor_inner"><div class="unified_vendor_name">{x.atstype}</div>
                                        <div class="unified_vendor_cats"><span>ATS</span>
                                        </div>
                                        <button
                                            className="removeBtn"
                                            title="Delete"
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleDeleteAts(x.atsauthorizationid);
                                                // Call your delete logic here, e.g.:
                                                // dispatch(atsActions.deleteCompanyATS({ atstype: x.atstype, companyId: user.CompanyId }));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                }
                {availableAts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        All available ATS integrations have been configured.
                    </div>
                )}
                {availableAts.length > 0 && (
                    <>
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            Click on an ATS to connect your account.
                        </div>
                        <div class="unified_vendors">
                            {availableAts.map((ats) => (
                                <div>
                                    {ats.atstype1 === 'Bullhorn' &&
                                        <a onClick={() => callUnifiedApp(ats)} class="unified_vendor">
                                            <img alt="Bullhorn" src="https://api.unified.to/docs/images/bullhorn.png" class="unified_image"></img>
                                            <div class="unified_vendor_inner"><div class="unified_vendor_name">Bullhorn</div>
                                                <div class="unified_vendor_cats"><span>ATS</span></div>
                                            </div>
                                        </a>
                                    }
                                    {ats.atstype1 === 'Workable' &&
                                        <a onClick={() => callUnifiedApp(ats)} class="unified_vendor">
                                            <img alt="Workable" src="https://api.unified.to/docs/images/workable.png" class="unified_image"></img>
                                            <div class="unified_vendor_inner"><div class="unified_vendor_name">Workable</div>
                                                <div class="unified_vendor_cats"><span>ATS</span></div>
                                            </div>
                                        </a>
                                    }
                                    {ats.atstype1 !== 'Workable' && ats.atstype1 !== 'Bullhorn' &&
                                        <a onClick={() => callUnifiedApp(ats)} class="unified_vendor">
                                            <img alt="Greenhouse" src={`https://api.unified.to/docs/images/${ats.atstype1}.png`} class="unified_image"></img>
                                            <div class="unified_vendor_inner"><div class="unified_vendor_name">{ats.atstype1}</div>
                                                <div class="unified_vendor_cats"><span>ATS</span></div>
                                            </div>
                                        </a>
                                    }
                                </div>
                            ))}
                        </div>
                    </>
                )}


            </div>

        </div>
    );
}
