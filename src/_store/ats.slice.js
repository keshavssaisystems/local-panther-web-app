import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { history, fetchWrapper } from "_helpers";
import jwtDecode from "jwt-decode";
const name = "ats";

const initialState = {
    atsauthorizationList: [],
    atstypeList: [],
    error: null,
    loader: false,
};
// generate zoom token thunk
export const getCompanyATS = createAsyncThunk(
    `${name}/getCompanyATS`,
    async ({ companyId }) => {
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atsauthorization/filter-only?filterExpression=companyId=${companyId} and deleteddate=null and isactive=true&pageNumber=1&pageSize=100`;
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

export const postAtsAuthorization = createAsyncThunk(
    `${name}/postAtsAuthorization`,
    async (data) => {
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atsauthorization`;
        return await fetchWrapper.post(TOKEN_END_POINT, data);
    }
);

export const deleteAtsAuthorization = createAsyncThunk(
    `${name}/deleteAtsAuthorization`,
    async (id) => {
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atsauthorization/${id}`;
        return await fetchWrapper.delete(TOKEN_END_POINT);
    }
);

export const getATSList = createAsyncThunk(
    `${name}/getATSList`,
    async () => {
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atstype`;
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

// Create the slice
const atsSlice = createSlice({
    name,
    initialState: {
        // initialize state from local storage to enable user to stay logged in
        atsauthorizationList: [],
        atstypeList: [],
        error: null,
        loader: false,
    },
    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCompanyATS.pending, (state, { payload }) => { })
            .addCase(getCompanyATS.fulfilled, (state, action) => {
                console.log(action.payload);
                state.atsauthorizationList = action.payload?.data?.data || [];
                //state.atsauthorizationList = payload?.data?.data;
            })
            .addCase(getCompanyATS.rejected, (state, action) => { })
            .addCase(postAtsAuthorization.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(postAtsAuthorization.fulfilled, (state, { payload }) => {
                state.loader = false;
                //state.atsauthorizationList = [...state.atsauthorizationList, payload];
            })
            .addCase(postAtsAuthorization.rejected, (state, action) => {
                state.loader = false;
            })
            .addCase(getATSList.pending, (state, { payload }) => { })
            .addCase(getATSList.fulfilled, (state, action) => {
                console.log(action.payload);
                state.atstypeList = action?.payload?.data || [];
                //state.atsauthorizationList = payload?.data?.data;
            })
            .addCase(getATSList.rejected, (state, action) => { })
            .addCase(deleteAtsAuthorization.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(deleteAtsAuthorization.fulfilled, (state) => {
                state.loader = false;
            })
            .addCase(deleteAtsAuthorization.rejected, (state, action) => {
                state.loader = false;
            });
    },
});

// Export the actions and reducer
export const atsActions = {
    ...atsSlice.actions,
    getCompanyATS,
    postAtsAuthorization,
    getATSList,
    deleteAtsAuthorization,
};

export const atsReducer = atsSlice.reducer;