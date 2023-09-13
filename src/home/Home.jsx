import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '_store';

export { Home };

function Home() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector(x => x.auth);
    const { users } = useSelector(x => x.users);

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
