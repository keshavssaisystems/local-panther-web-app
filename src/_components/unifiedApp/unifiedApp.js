import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment/moment";
import UnifiedDirectory from "@unified-api/react-directory";
import unifiedKeys from "./unifiedKeys.json";
export function createAuthLink(integrationType) {
    const UNIFIED_WORKSPACE_ID = unifiedKeys.UNIFIED_WORKSPACE_ID;
    const baseUrl = 'https://api.unified.to/unified/integration/auth';
    const params = new URLSearchParams({
        redirect: '1',
        //env: 'Sandbox',
        //success_redirect: integrationType === 'bullhorn' ? 'https://api.unified.to/oauth/code' : window.location.origin + `/success/${integrationType}`,
        success_redirect: window.location.origin + `/success/${integrationType}`,
        failure_redirect: window.location.href,
        scopes: 'ats_candidate_read',
        state: 'abc-123-def-456',
    });

    return `${baseUrl}/${UNIFIED_WORKSPACE_ID}/${integrationType}?${params.toString()}`;
}
