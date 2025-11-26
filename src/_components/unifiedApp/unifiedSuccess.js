// pages/SuccessPage.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import unifiedKeys from './unifiedKeys.json';
import { postAtsAuthorization } from '_store/ats.slice';
import { useDispatch } from 'react-redux';
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
export default function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [type, setType] = useState('');
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const id = params.get('id');
        const type = params.get('type');
        setType(type);
        if (code) {
            fetch('https://api.unified.to/unified/integration/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${unifiedKeys.UNIFIED_API_SECRET}`, // replace with your actual secret key
                },
                body: JSON.stringify({
                    code,
                    workspace_id: unifiedKeys.UNIFIED_WORKSPACE_ID, // match your workspace ID
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const connectionId = data.connection_id;
                    handleAuthCallback(connectionId);
                    navigate('/dashboard'); // redirect after storing connection
                })
                .catch((err) => {
                    console.error('Token exchange failed:', err);
                    navigate('/failure');
                });
        }
        if (id) {
            handleAuthCallback(id, type);
            navigate(`/ats`);
            dispatch(showSnackbar({
                message: type + ' connected successfully!',
                type: SNACKBAR_TYPES.SUCCESS, position: SNACKBAR_POSITION.TOP_CENTER, 
                autoClose: true, autoCloseDelay: 2000, maxWidth: 500,
            }));
            // navigate(`/unified-candidates/${id}`); // redirect after storing connection
        }

    }, [location, navigate]);

    const handleAuthCallback = (connectionId, type) => {
        localStorage.setItem('unifiedConnectionId', connectionId);
        var obj = {
            "companyid": JSON.parse(localStorage.getItem("userDetails"))?.CompanyId || 0,
            "integrationtype": "unified",
            "atstype": type,
            "connectionid": connectionId,
            "accesstoken": null,
            "refreshtoken": null,
            "isactive": true
        }

        dispatch(postAtsAuthorization(obj));
        window.history.replaceState({}, document.title, window.location.pathname);
    }


    return <h2>Authenticating with {type}...</h2>;
}
