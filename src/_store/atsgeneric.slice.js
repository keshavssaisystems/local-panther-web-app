import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { history, fetchWrapper } from "_helpers";
import jwtDecode from "jwt-decode";

const name="atsgeneric"


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
export const setATSDefault = createAsyncThunk(
    `${name}/setATSDefault`,
    async ({ entityType, pkField, pkValue }) => {
        const parameter = `@entitytype=${entityType},@${pkField}=${pkValue}`;
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/Set_ATS_Default?parameter=${encodeURIComponent(parameter)}`;
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

export const fetchATSGenericList = createAsyncThunk(
    `${name}/fetchATSGenericList`,
        async ({ endpoint, params }) => {
            const {
                SearchText = "",
                IsActive,
                currentpage = 1,
                PageSize = 10
            } = params;
        
        let parameterParts = [];
      
        if (SearchText) {
            parameterParts.push(`@SearchText='${SearchText}'`);
        }

        if (IsActive !== null && IsActive !== undefined) {
            parameterParts.push(`@IsActive=${IsActive}`);
        }
        
        parameterParts.push(`@currentpage=${currentpage}`);
        parameterParts.push(`@PageSize=${PageSize}`);

        const parameter = parameterParts.join(",");
        
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/${endpoint}?parameter=${encodeURIComponent(parameter)}`;

        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

//create slice 
const atsgenericSlice = createSlice({
    name,
     initialState: {
        // initialize state from local storage to enable user to stay logged in
        atsauthorizationList: [],
        atsgenericList: [],
        error: null,
        loader: false,
        totalrows: 0,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
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
                    .addCase(fetchATSGenericList.pending, (state) => {
                        
                                    state.loader = true;
                                    state.atsgeneric = [];
                                    
                                })
                                
                    .addCase(fetchATSGenericList.fulfilled, (state, action) => {
                                   
                                    state.loader = false;
                                    // sp response
                                    //console.log(action.type);
                                    if (action?.payload?.data) {
                                       
                                        state.atsgeneric = action?.payload?.data?.data || [];
                                        state.header=action?.payload?.data?.header;
                                        state.totalrows = action?.payload?.data?.totalRows || 0;
                                    } else {
                                        
                                        state.atsgeneric = [];
                                        state.totalrows = 0;
                                    }
                                })
                                .addCase(fetchATSGenericList.rejected, (state) => {
                                  
                                    state.loader = false;
                                })
                                .addCase(setATSDefault.pending, (state) => {
                                    state.loader = true;
                                })
                                .addCase(setATSDefault.fulfilled, (state) => {
                                    state.loader = false;
                                })
                                .addCase(setATSDefault.rejected, (state) => {
                                    state.loader = false;
                                });
    }
});

export const atsGenericActions ={
    ...atsgenericSlice.actions,
    postAtsAuthorization,
    deleteAtsAuthorization,
    fetchATSGenericList,
    setATSDefault,
};

export const atsgenericReducer = atsgenericSlice.reducer;
