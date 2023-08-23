import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

// create slice
const name = 'jobList';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const jobListActions = { ...slice.actions, ...extraActions };
export const jobListReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        jobList: []
    }
}

function createExtraActions() {
    const baseUrl = `http://172.16.14.120:8082/api`;

    return {
        getJobList: getJobList()
    };

    function getJobList() {
        return createAsyncThunk(
            `${name}/getJobList`,
            async ({ pageNo }) => await fetchWrapper.get(`${baseUrl}/job?isActive=true&jobId=&companyId=&pageSize=5&pageNumber=${pageNo}`)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getJobList();

        function getJobList() {
            var { pending, fulfilled, rejected } = extraActions.getJobList;
            builder
                .addCase(pending, (state) => {
                    state.jobList = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.jobList = action.payload.data.jobList;
                    state.totalRows = action.payload.data.totalRows;
                })
                .addCase(rejected, (state, action) => {
                    state.jobList = { error: action.error };
                });
        }
    };
}
