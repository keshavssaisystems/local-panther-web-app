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
import ConfirmModal from "_components/modal/confirmModal";
import { set } from "lodash";
// import errorIcon from '_assets/images/error-icon.svg';
import atsintegrationIcon from '../../assets/utils/images/ats-integration.png';
export default function AtsUnified() {
    const navigate = useNavigate();
    const callUnifiedApp = (ats) => {
        if (ats?.connectionid) {
            navigate('/unified-candidates/' + ats?.connectionid);
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
    const [atsAuthorizationId, setAtsAuthorizationId] = useState(null);

    useEffect(() => {
        (async () => {
            await getATSList();
            console.log('atstypeList', atstypeList);
        })();
    }, [dispatch]);

    useEffect(() => {
        if (user && user.CompanyId) {
            (async () => {
                await getConfiguredAts();
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

    const getATSList = async () => {
        await dispatch(atsActions.getATSList());
    }

    const getConfiguredAts = async () => {
        if (user && user.CompanyId) {
            await dispatch(atsActions.getCompanyATS({ companyId: user.CompanyId }));
        }
    }

    const handleDeleteAts = async (id) => {
        setAtsAuthorizationId(id);
        setShowModal(true);
    };


    const handleConfirm = async (id) => {
        let res = await dispatch(atsActions.deleteAtsAuthorization(atsAuthorizationId));
        {
            getATSList();
            getConfiguredAts();
        }
        setAtsAuthorizationId(null);
        setShowModal(false);
    };
    const [showModal, setShowModal] = useState(false);

    const handleATSCandidateClick = (ats) => {
        if (ats?.connectionid) {
            navigate('/unified-candidates/' + ats?.connectionid);
            return;
        }

    }
    const handleATSJobClick = (ats) => {
        if (ats?.connectionid) {
            navigate('/unified-jobs/' + ats?.connectionid);
            return;
        }
    }

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
                                    <img alt={x.atstype}
                                        src={`https://api.unified.to/docs/images/${x.atstype}.png`}
                                        onError={(e) => (e.target.src = atsintegrationIcon)}
                                        class="unified_image"></img>
                                    <div class="unified_vendor_inner"><div class="unified_vendor_name" style={{ color: '#333', fontWeight: 'bold', textTransform: 'capitalize' }}>{x.atstype}</div>
                                        <div class="unified_vendor_cats1" onClick={() => handleATSCandidateClick(x)}><span>Candidates</span>

                                        </div>
                                        <div class="unified_vendor_cats1" onClick={() => handleATSJobClick(x)}><span>Jobs</span></div>
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
                                            <img alt={ats.atstype1} src={`https://api.unified.to/docs/images/${ats.atstype1}.png`} class="unified_image"></img>
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

                <ConfirmModal
                    isOpen={showModal}
                    title="Are you sure?"
                    message="You want to remove the ATS account configuration?"
                    icon={/*errorIcon*/ null}
                    confirmText="YES"
                    cancelText="NO"
                    onConfirm={handleConfirm}
                    zIndex={1050}
                    onCancel={() => { setShowModal(false); setAtsAuthorizationId(null); }}
                />
            </div>

        </div>
    );
}
