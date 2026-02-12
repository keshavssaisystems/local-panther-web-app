import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { history, fetchWrapper } from "_helpers";


const name="genericreports"

export const fetchReportList = createAsyncThunk(
    `${name}/fetchReportList`,
        async ({ endpoint, params }) => {
            const {
                SearchText = "",
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
          
        if (startDate) {
            parameterParts.push(`@startdate='${startDate}'`);
        }
        if (endDate) {
            parameterParts.push(`@enddate='${endDate}'`);
        }
        if (subsidiaryid) { 
            parameterParts.push(`@subsidiaryid=${subsidiaryid}`);
        }
        if (candidateid) {
            parameterParts.push(`@candidateid=${candidateid}`);
        }
        if (jobid) {
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
