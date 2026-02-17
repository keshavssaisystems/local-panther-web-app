import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { fetchWrapper } from "_helpers";


const name="genericreports"

export const fetchReportList = createAsyncThunk(
    `${name}/fetchReportList`,
        async ({ endpoint, params }) => {
        
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/${endpoint}?parameter=${encodeURIComponent(params)}`;
        
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

//create slice 
const reportsSlice = createSlice({
    name,
     initialState: {
        reportsList: [],
        filters:{},
        error: null,
        loader: false,
        totalrows: 0,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
                    
                    .addCase(fetchReportList.pending, (state) => {
                                    state.loader = true;
                    })     
                    .addCase(fetchReportList.fulfilled, (state, action) => {
                                   
                                    state.loader = false;
                                    if (action?.payload?.data) {
                                        state.reportsdata = action?.payload?.data?.data|| [];
                                        state.header=action?.payload?.data?.columnMetadata;
                                        state.pagetitle=action?.payload?.data?.pageTitle;
                                        state.filters=action?.payload?.data?.search || {};
                                        
                                        state.totalrows = action?.payload?.data?.totalRows || 0;
                                    } else {
                                        
                                        state.reportsdata = [];
                                        state.totalrows = 0;
                                    }
                                })
                                .addCase(fetchReportList.rejected, (state) => {
                                  
                                    state.loader = false;
                                });
    }
});

export const reportsActions ={
    ...reportsSlice.actions,
    fetchReportList,

};

export const reportsReducer = reportsSlice.reducer;
