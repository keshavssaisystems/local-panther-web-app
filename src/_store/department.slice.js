import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

// create slice
const name = 'department';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const departmentActions = { ...slice.actions, ...extraActions };
export const departmentReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        department: []
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;

    return {
        getDepartment: getDepartment()
    };

    function getDepartment() {
        return createAsyncThunk(
            `${name}/getDepartment`,
            async () => await fetchWrapper.get(`${baseUrl}/Common/GetCommonDropdown?searchText=department`)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getDepartment();

        function getDepartment() {
            var { pending, fulfilled, rejected } = extraActions.getDepartment;
            builder
                .addCase(pending, (state) => {
                    state.department = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.department = action.payload.data;
                })
                .addCase(rejected, (state, action) => {
                    state.department = { error: action.error };
                });
        }
    };
}