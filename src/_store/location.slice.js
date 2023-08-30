import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

// create slice
const name = 'location';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const locationActions = { ...slice.actions, ...extraActions };
export const locationReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        location: []
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;

    return {
        getLocation: getLocation()
    };

    function getLocation() {
        return createAsyncThunk(
            `${name}/getLocation`,
            async () => await fetchWrapper.get(`${baseUrl}/Common/GetLocation`)
        );
    }
}

function createExtraReducers() {
    return (builder) => {
        getLocation();

        function getLocation() {
            var { pending, fulfilled, rejected } = extraActions.getLocation;
            builder
                .addCase(pending, (state) => {
                    state.location = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.location.name = action.payload.data.location + ", " + action.payload.data.statename + ", " + action.payload.data.countryname;
                    state.location.id = action.payload.data.cityid;
                })
                .addCase(rejected, (state, action) => {
                    state.location = { error: action.error };
                });
        }
    };
}
