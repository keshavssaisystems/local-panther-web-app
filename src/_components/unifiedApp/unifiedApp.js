import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import UnifiedDirectory from "@unified-api/react-directory";

// export default function UnifiedApp() {


export function createAuthLink(integrationType) {
    const UNIFIED_WORKSPACE_ID = '68dbc51bc83fc0f2def390b7';
    const baseUrl = 'https://api.unified.to/unified/integration/auth';
    const params = new URLSearchParams({
        redirect: '1',
        env: 'Sandbox',
        success_redirect: window.location.href+'success',
        failure_redirect: window.location.href,
        scopes: 'ats_candidate_read',
        state: 'abc-123-def-456',
    });

    return `${baseUrl}/${UNIFIED_WORKSPACE_ID}/${integrationType}?${params.toString()}`;
}

// function handleAuthCallback(connectionId) {
//     localStorage.setItem('unifiedConnectionId', connectionId);
//     // Clear the URL parameters
//     window.history.replaceState({}, document.title, window.location.pathname);
// }
// return (
//     <UnifiedDirectory workspace_id={"68dbc51bc83fc0f2def390b7"} success_redirect={"https://pantherportal-prod.azurewebsites.net/scheduled-interview"}  scopes={['ats_job_read', 'calendar_calendar_read']} environment={"Sandbox"} />
// );
// }