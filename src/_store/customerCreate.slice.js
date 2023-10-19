import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";

// create slice name
const name = "customer";

export const updatecustomerThunk = createAsyncThunk(
    `${name}/updatecustomerThunk`,
    async ({ id, customer_data }) => {
        const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Company/${id}`;
        return await fetchWrapper.put(LOGIN_END_POINT, customer_data);
    }
);

export const addcustomerThunk = createAsyncThunk(
    `${name}/addcustomerThunk`,
    async (customer_data) => {

        const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Company`;
        return await fetchWrapper.post(LOGIN_END_POINT, customer_data);
    }
);

export const deletecustomerThunk = createAsyncThunk(
    `${name}/deletecustomerThunk`,
    async (deleteId) => {
        const LOGIN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Company/${deleteId}`;
        return await fetchWrapper.delete(LOGIN_END_POINT);
    }
);

const customerDataSlice = createSlice({
    name,
    initialState: {
        customer_data_profile: [],
    },
    reducers: {},

    extraReducers: {
        [updatecustomerThunk.pending]: (state, { payload }) => {
            state.error = null;
        },
        [updatecustomerThunk.fulfilled]: (state, payload) => { },
        [updatecustomerThunk.rejected]: (state, action) => {
            state.error = action.error;
        },

        [addcustomerThunk.pending]: (state, { payload }) => {
            state.error = null;
        },
        [addcustomerThunk.fulfilled]: (state, payload) => { },
        [addcustomerThunk.rejected]: (state, action) => {
            state.error = action.error;
        },
        [deletecustomerThunk.pending]: (state, { payload }) => {
            state.error = null;
        },
        [deletecustomerThunk.fulfilled]: (state, payload) => { },
        [deletecustomerThunk.rejected]: (state, action) => {
            state.error = action.error;
        },
    },
});

export const customerDetailsActions = {
    ...customerDataSlice.actions,
    addcustomerThunk,
    updatecustomerThunk,
    deletecustomerThunk,
};

export const customerDataReducer = customerDetailsActions.reducer;
