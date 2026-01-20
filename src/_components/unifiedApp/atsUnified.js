import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import { useLocation, useNavigate } from 'react-router-dom';
import { createAuthLink } from "_components/unifiedApp/unifiedApp";
import './atsUnified.css';
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import { atsActions } from "_store/ats.slice";
import ConfirmModal from "_components/modal/confirmModal";
import atsintegrationIcon from '../../assets/utils/images/ats-integration.png';
import { FaCheck, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import {
  BsBoxArrowRight
} from "react-icons/bs";

// ATS descriptions mapping
const ATS_DESCRIPTIONS = {
    'Bullhorn': 'Connect your Bullhorn CRM to sync jobs, candidates in real-time.',
    'Greenhouse': 'Optimize your hiring process with structured interviews and data.',
    'Workday': 'Enterprise-level talent management and recruiting suite.',
    'Lever': 'The modern ATS + CRM for collaborative hiring teams.',
    'Workable': 'Streamline your hiring process with Workable integration.',
};

export default function AtsUnified() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const configuredAtsList = useSelector((state) => state.ats.atsauthorizationList);
    const atstypeList = useSelector((state) => state.ats.atstypeList);
    const user = JSON.parse(localStorage.getItem("userDetails"));
    const [availableAts, setAvailableAts] = useState([]);
    const [atsAuthorizationId, setAtsAuthorizationId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            await getATSList();
        })();
    }, [dispatch]);

    useEffect(() => {
        if (user && user.CompanyId) {
            (async () => {
                await getConfiguredAts();
            })();
        }
    }, [dispatch]);

    useEffect(() => {
        // Check if API response already has isconnected property (new API structure)
        // If configuredAtsList has items with isconnected, use it directly
        // Otherwise, merge with atstypeList (old logic)
        if (configuredAtsList && configuredAtsList.length > 0 && configuredAtsList[0].hasOwnProperty('isconnected')) {
            // New API structure - use directly
            setAvailableAts(configuredAtsList);
        } else if (configuredAtsList && configuredAtsList.length > 0 && configuredAtsList[0].hasOwnProperty('isConnected')) {
            // Handle camelCase variant
            setAvailableAts(configuredAtsList);
        } else {
            // Old logic - combine atstypeList with configuredAtsList
            const allAtsWithStatus = atstypeList.map(atsType => {
                const configured = configuredAtsList.find(
                    auth => auth.atstype?.toLowerCase() === atsType.atstype1?.toLowerCase()
                );
                return {
                    ...atsType,
                    ...configured,
                    isconnected: configured ? (configured.isconnected !== undefined ? configured.isconnected : true) : false
                };
            });
            setAvailableAts(allAtsWithStatus);
        }
    }, [atstypeList, configuredAtsList]);

    const getATSList = async () => {
        await dispatch(atsActions.getATSList());
    }

    const getConfiguredAts = async () => {
        // Using new API: /api/V2/Get_Authorized_ATS_List
        await dispatch(atsActions.getAuthorizedATSList({ pagesize: 12, currentpage: 1 }));
        
        // Old API kept for reference (commented out):
        // if (user && user.CompanyId) {
        //     await dispatch(atsActions.getCompanyATS({ companyId: user.CompanyId }));
        // }
    }

    const callUnifiedApp = (ats) => {
        if (ats?.connectionid) {
            return;
        }
        if (configuredAtsList.length > 0) {
            dispatch(showSnackbar({
                message: 'You can configure only one ATS at a time.',
                type: SNACKBAR_TYPES.INFO, position: SNACKBAR_POSITION.TOP_CENTER, autoClose: true, autoCloseDelay: 2000, maxWidth: 500,
            }));
            return;
        }
        const authUrl = createAuthLink(ats.atstype1?.toLowerCase());
        window.location.href = authUrl;
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

    const formatCreatedDate = (createdDate) => {
        // Handle null, undefined, 0, empty string, and invalid dates
        if (!createdDate || createdDate === 0 || createdDate === '0' || createdDate === '') return null;
        const momentDate = moment(createdDate);
        if (!momentDate.isValid()) return null;
        return momentDate.format('MM/DD/YYYY');
    }

    const getAtsDescription = (atsName, apiDescription) => {
        // Use API description if available, otherwise fallback to mapping
        return apiDescription || ATS_DESCRIPTIONS[atsName] || `Connect your ${atsName} account to sync candidate data and job postings.`;
    }

    const getCreatedDate = (connectionData) => {
        if (!connectionData) return null;
        const date = connectionData.createddate || 
                     connectionData.createdDate ||
                     connectionData.createddatetime ||
                     connectionData.createdDateTime ||
                     null;
        // Handle 0, null, undefined, empty string cases
        if (!date || date === 0 || date === '0' || date === '') return null;
        return date;
    }

    return (
        <div className="ats-unified-container">
            {/* Header Section */}
            <div className="ats-header">
                <h2 className="ats-title">Applicant Tracking Systems</h2>
                <p className="ats-description">
                    Connect your favorite ATS to automatically sync candidate data and job postings. 
                    We use secure OAuth2 to ensure your data stays protected.
                </p>
            </div>

            {/* ATS Cards Grid - All ATS with dynamic button based on isconnected */}
            <div className="ats-grid">
                {availableAts.map((ats) => {
                    // Use API properties directly
                    const atsName = ats.atstype || 'Unknown';
                    const logoUrl = ats.logourl || `https://api.unified.to/docs/images/${atsName.toLowerCase()}.png`;
                    const description = ats.description || getAtsDescription(atsName, null);
                    
                    // Check isconnected property - handle 1/0 values (1 = true, 0 = false)
                    const isConnected = ats.isconnected === 1 || ats.isconnected === true;
                    
                    // Use createddate directly from API
                    const formattedCreatedDate = (ats.createddate && ats.createddate !== '0' && ats.createddate !== 0) 
                        ? formatCreatedDate(ats.createddate) 
                        : null;
                    
                    // Determine button properties based on isconnected
                    const buttonText = isConnected ? 'Disconnect Account' : 'Connect Account';
                    const buttonClass = isConnected ? 'disconnect' : 'connect';
                    const ButtonIcon = isConnected ? BsBoxArrowRight : FaExternalLinkAlt;
                    const buttonClickHandler = isConnected 
                        ? (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteAts(ats.atsauthorizationid);
                          }
                        : () => callUnifiedApp(ats);

                    // Get first letter of ATS name for fallback
                    const atsInitial = atsName && atsName.length > 0 ? atsName.charAt(0).toUpperCase() : 'A';

                    return (
                        <div key={ats.atsauthorizationid || ats.atstypeid || atsName} className="ats-card">
                            {/* Logo and Status Badge/Created Date Row */}
                            <div className="ats-card-top-row">
                                <div className="ats-card-logo">
                                    <img
                                        alt={atsName.toLowerCase()}
                                        src={logoUrl}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const fallback = e.target.nextElementSibling;
                                            if (fallback) {
                                                fallback.style.display = 'flex';
                                            }
                                        }}
                                        className="ats-logo-image"
                                    />
                                    <div className="ats-logo-fallback" style={{ display: 'none' }}>
                                        {atsInitial}
                                    </div>
                                </div>
                                <div className="ats-card-right-info">
                                    <span className={`ats-status-badge ${isConnected ? 'connected' : 'not-setup'}`}>
                                        {isConnected && (
                                            <span className="status-check-circle">
                                                <FaCheck className="status-icon" />
                                            </span>
                                        )}
                                        {isConnected ? 'Connected' : 'Not Setup'}
                                    </span>
                                    {/* Created Date (only for connected, shown on right side) */}
                                    {isConnected && formattedCreatedDate && (
                                        <div className="ats-created-date">
                                            Created Date: {formattedCreatedDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="ats-card-content">
                                <h3 className="ats-card-name">{atsName}</h3>

                                {/* Description */}
                                <p className="ats-card-description">
                                    {description}
                                </p>

                                {/* Action Button - Dynamic based on isconnected */}
                                <button
                                    className={`ats-action-button ${buttonClass}`}
                                    onClick={buttonClickHandler}
                                >
                                    {buttonText}
                                    <ButtonIcon className="button-icon" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showModal}
                title="Are you sure?"
                message="You want to remove the ATS account configuration?"
                icon={null}
                confirmText="YES"
                cancelText="NO"
                onConfirm={handleConfirm}
                zIndex={1050}
                onCancel={() => { setShowModal(false); setAtsAuthorizationId(null); }}
            />
        </div>
    );
}
