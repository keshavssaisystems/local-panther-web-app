import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import { useLocation, useNavigate } from 'react-router-dom';
import { createAuthLink } from "_components/unifiedApp/unifiedApp";
import UnifiedDirectory from '@unified-api/react-directory';
import './atsUnified.css';
import { toast } from "react-toastify";

export default function AtsUnified() {
    const navigate = useNavigate();
    const callUnifiedApp = (type) => {
        if (type === 'workable' && localStorage.getItem('unifiedConnectionId')) {
             navigate('/unified-candidates');
             return;
            //return toast.info("You have already connected with Workable");
        }
        const authUrl = createAuthLink(type);
        window.location.href = authUrl; // 
    }

    return (
        <div>
            {/* <h1>ATS</h1>         */}
            <div class="unified">
                <div class="unified_menu">
                    <button class="unified_button unified_button_ats active">ATS</button>
                </div>
                <div class="unified_vendors">
                    <a onClick={() => callUnifiedApp('bullhorn')} class="unified_vendor">
                        <img alt="Bullhorn" src="https://api.unified.to/docs/images/bullhorn.png" class="unified_image"></img>
                        <div class="unified_vendor_inner"><div class="unified_vendor_name">Bullhorn</div>
                            <div class="unified_vendor_cats"><span>ATS</span></div>
                        </div>
                    </a>
                    <a onClick={() => callUnifiedApp('workable')} class="unified_vendor">
                        <img alt="Bullhorn" src="https://api.unified.to/docs/images/workable.png" class="unified_image"></img>
                        <div class="unified_vendor_inner"><div class="unified_vendor_name">Workable</div>
                            <div class="unified_vendor_cats"><span>ATS</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

        </div>
    );
}
