import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { userActions } from '_store';

export { Home };

function Home() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(userActions.getAll());

    }, []);

    return (
        <div>
            <p>You're logged in with Panther</p>
            <h3>Users from secure api end point:</h3>
           
        </div>
    );
}
