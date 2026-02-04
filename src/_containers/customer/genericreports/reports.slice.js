import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { history, fetchWrapper } from "_helpers";
import jwtDecode from "jwt-decode";

const name="genericreports"


export const fetchReportList = createAsyncThunk(
    `${name}/fetchReportList`,
        async ({ endpoint, params }) => {
            const {
                SearchText = "",
                IsActive,
                currentpage = 1,
                PageSize = 10,
                startDate,
                endDate,
                subsidiaryid,
                candidateid,
                jobid,
            } = params;
        console.log("slicestartdate",startDate)
        console.log("sliceendDate",endDate)
        let parameterParts = [];
      
        if (SearchText) {
            parameterParts.push(`@SearchText='${SearchText}'`);
        }
            console.log("IsActive",IsActive)
         if (IsActive !== null && IsActive !== undefined && IsActive !== 3) {
              parameterParts.push(`@IsActive=${IsActive}`);
         }

        if (startDate) {
            parameterParts.push(`@startdate='${startDate}'`);
        }
        if (endDate) {
            parameterParts.push(`@enddate='${endDate}'`);
        }
        if (subsidiaryid) { 
            // numeric or string subsidiary id
            parameterParts.push(`@subsidiaryid=${subsidiaryid}`);
        }
        if (candidateid) {
            // numeric or string candidate id
            parameterParts.push(`@candidateid=${candidateid}`);
        }
        if (jobid) {
            // numeric or string job id
            parameterParts.push(`@jobid=${jobid}`);
        }
        
        parameterParts.push(`@currentpage=${currentpage}`);
        parameterParts.push(`@PageSize=${PageSize}`);

        const parameter = parameterParts.join(",");

        console.log('Report parameters:', parameter);
        
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/${endpoint}?parameter=${encodeURIComponent(parameter)}`;
        
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

//create slice 
const reportsSlice = createSlice({
    name,
     initialState: {
        // initialize state from local storage to enable user to stay logged in
       // atsauthorizationList: [],
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
                                   // state.reportsdata = [];
                                  //  state.header=[];
                                  //  state.pageTitle="";
                                    
                    })     
                    .addCase(fetchReportList.fulfilled, (state, action) => {
                                   
                                    state.loader = false;
                                    
                                   // console.log('Report payload:', action?.payload);
                                    if (action?.payload?.data) {
                                        state.reportsdata = action?.payload?.data?.data|| [];

                                     //   console.log('Report data:', state.reportsdata); 
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
