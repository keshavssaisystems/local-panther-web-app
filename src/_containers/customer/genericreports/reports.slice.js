import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import { history, fetchWrapper } from "_helpers";
import jwtDecode from "jwt-decode";

const name="genericreports"


// export const postAtsAuthorization = createAsyncThunk(
//     `${name}/postAtsAuthorization`,
//     async (data) => {
//         const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atsauthorization`;
//         return await fetchWrapper.post(TOKEN_END_POINT, data);
//     }
// );

// export const deleteAtsAuthorization = createAsyncThunk(
//     `${name}/deleteAtsAuthorization`,
//     async (id) => {
//         const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atsauthorization/${id}`;
//         return await fetchWrapper.delete(TOKEN_END_POINT);
//     }
// );
export const fetchReportList = createAsyncThunk(
    `${name}/fetchReportList`,
        async ({ endpoint, params }) => {
            const {
                SearchText = "",
              //  IsActive,
                currentpage = 1,
                PageSize = 10,
                startdate,
                enddate,
                subsidiaryid,
                candidateid,
                jobid,
            } = params;

        let parameterParts = [];
      
        if (SearchText) {
            parameterParts.push(`@SearchText='${SearchText}'`);
        }

        // if (IsActive !== null && IsActive !== undefined) {
        //     parameterParts.push(`@IsActive=${IsActive}`);
        // }

        // add optional report filters if supplied (use lowercase param names to match existing reports)
      //  if (startdate) {
           // parameterParts.push(`@startdate='${startdate}'`);
           parameterParts.push(`@startdate=''`);
       // }
        if (enddate) {
            parameterParts.push(`@enddate='${enddate}'`);
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
        error: null,
        loader: false,
        totalrows: 0,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
                    // .addCase(postAtsAuthorization.pending, (state, { payload }) => {
                    //     state.loader = true;
                    // })
                    // .addCase(postAtsAuthorization.fulfilled, (state, { payload }) => {
                    //     state.loader = false;
                    //     //state.atsauthorizationList = [...state.atsauthorizationList, payload];
                    // })
                    // .addCase(postAtsAuthorization.rejected, (state, action) => {
                    //     state.loader = false;
                    // })
                    .addCase(fetchReportList.pending, (state) => {
                        
                                    state.loader = true;
                                    state.reportsdata = [];
                                    state.header=[];
                                    
                    })     
                    .addCase(fetchReportList.fulfilled, (state, action) => {
                                   
                                    state.loader = false;
                                    // sp response
                                   // console.log('Report payload:', action?.payload);
                                    if (action?.payload?.data) {
                                        state.reportsdata = action?.payload?.data?.data|| [];

                                     //   console.log('Report data:', state.reportsdata); //here data is coming 
                                        state.header=action?.payload?.data?.columnMetadata;
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
   // postAtsAuthorization,
   // deleteAtsAuthorization,
    fetchReportList,

};

export const reportsReducer = reportsSlice.reducer;
