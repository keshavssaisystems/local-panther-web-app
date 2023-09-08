import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from '_helpers';

// create slice
const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        menuList:JSON.parse(localStorage.getItem('menuList')), //temp fix
        token: localStorage.getItem('token'),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.user = {}
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToekn');
        localStorage.removeItem('menuList');

        history.navigate('/login');
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_USER_API_URL}`;
    debugger;
    return {
        login: login()
    };

    function login() {
        console.log(baseUrl)
        return createAsyncThunk(
            `${name}/login`,
            async ({ email, password }) => await fetchWrapper.post(`${baseUrl}/Login`, { email, password })
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        login();

        function login() {
            var { pending, fulfilled, rejected } = extraActions.login;
            builder
                .addCase(pending, (state) => {
                    state.error = null;
                })
                .addCase(fulfilled, (state, { payload: { data = {} } = {} }) => {
                    const { token, refreshToken, menuDtoList = [] } = data;
                    state.menuList = menuDtoList;
                    state.user = data;
                    state.token = token;
                    localStorage.setItem('menuList', JSON.stringify(menuDtoList));  //temp fix
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', refreshToken);

                    // get return url from location state or default to home page
                    const { from } = history.location.state || { from: { pathname: '/' } };
                    history.navigate(from);
                })
                .addCase(rejected, (state, action) => {
                    state.error = action.error;
                });
        }
    };
}
