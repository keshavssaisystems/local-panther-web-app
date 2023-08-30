import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { history, fetchWrapper } from "_helpers";

// create slice
const name = "candidate";
const initialState = createInitialState();
const extraActions = createExtraActions();
const actions = createActions();
const extraReducers = createExtraReducers();
const reducers = createReducers();
const slice = createSlice({ name, initialState, extraReducers, reducers });



// exports
export const candidateActions = { ...slice.actions, ...extraActions, ...actions };
export const candidateReducer = slice.reducer;

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        candidateList: {},
        error: null,
        candidateDetails: null
    };
}


function createActions() {
    const baseUrl = `https://jobservice-api-dev.azurewebsites.net/api`;

    return {
        getCandidateDetails: getCandidateDetails()
    };

    function getCandidateDetails() {
        debugger;
        return createAsyncThunk(
            `${name}/getCandidateDetails`,
            async () =>
                await fetchWrapper.get(`https://candidateservice-api-dev.azurewebsites.net/api/Candidate/GetCandidateById/8`)
        );
    }

}


function createExtraActions() {
    const baseUrl = `https://jobservice-api-dev.azurewebsites.net/api`;

    return {
        getCandidates: getCandidates()
    };

    function getCandidates() {
        return createAsyncThunk(

            `${name}/getCandidates`,

            async ({ url }) =>
                await fetchWrapper.get(`${baseUrl}/${url}`)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getCandidates();

        function getCandidates() {
            var { pending, fulfilled, rejected } = extraActions.getCandidates;
            builder
                .addCase(pending, (state) => {
                    state.error = null;
                })
                .addCase(fulfilled, (state, action) => {
                    const user = action.payload;
                    debugger;

                    return user.data;


                })
                .addCase(rejected, (state, action) => {
                    state.error = action.error;

                });
        }
    };
}


function createReducers() {
    return (builder) => {
        getCandidateDetails();

        function getCandidateDetails() {
            var { pending, fulfilled, rejected } = extraActions.getCandidates;
            builder
                .addCase(pending, (state) => {
                    state.error = null;
                })
                .addCase(fulfilled, (state, action) => {
                    const candidateDetails = action.payload;
                    return candidateDetails.data;
                })
                .addCase(rejected, (state, action) => {
                    state.error = action.error;
                });
        }


    };
}
