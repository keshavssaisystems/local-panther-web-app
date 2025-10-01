// pages/SuccessPage.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import unifiedKeys from './unifiedKeys.json';
function handleAuthCallback(connectionId) {
    localStorage.setItem('unifiedConnectionId', connectionId);
    window.history.replaceState({}, document.title, window.location.pathname);
}

export default function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const id = params.get('id');
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
            handleAuthCallback(id);
            navigate('/unified-candidates'); // redirect after storing connection
        }

    }, [location, navigate]);

    return <h2>Authenticating with Bullhorn...</h2>;
}
