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
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Atstype/filter-only?filterExpression=isactive=true&pageNumber=1&pageSize=100`;
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

export const fetchCustomerCandidates = createAsyncThunk(
    `${name}/fetchCustomerCandidates`,
    async (params) => {
        const isActiveFilter = params.status == 0 ? '' : 'AND t.isactive= ' + (params.status == 1 ? '1' : '0');

        // const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Report/GetReportBySP?storedProcedure=Fetch_GetPagedDataWithFKPMTableJson&parameter=%40EndPoint%20%3D%20%27Candidate%27%2C%40OrderByColumn%20%3D%20%27userid%27%2C%40OrderDirection%20%3D%20%27desc%27%2C%40PageNumber%20%3D%201%2C%40PageSize%20%3D%2010%2C%40PrimaryColumns%20%3D%20%27candidateid%2Cuserid%2Cfirstname%2Clastname%2Cphonenumber%2Cemail%2Ccountryid%2Caddress%2Ccityid%2Cstateid%2Czipcode%2Cdob%2Cethnicityid%2Cgenderid%2Cemploymenteligiblity%2Cisreadytoworkimmediately%2Csummary%2Cadditionalinformation%2Cjobprofile%2Cpronounid%2Cavailabilitytowork%2Cisexcludemycurrentemployer%2Csource%2Cstatus%2Cprofilenotificationdate%2Cjobmatchattemptcount%2Cjobmatchattemptdatetime%2Catsinfo%27%2C%40Filter%20%20%3D%20%27t.source%20%3D%20%27%27Bullhorn%27%27%20%27%2C%40SelectedFKTables%20%3D%20%27Usermaster%2CCity%2CStateCountry%27%2C%40SelectedChildTables%20%3D%20%27CandidateCertifications%2C%20CandidateJobPreference%2C%20CandidateQualifications%2C%20CandidateResumeCandidateSkills%2C%20CandidateEducation%2C%20CandidateAdditionalInformations%27`;
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Report/GetReportBySP?storedProcedure=Fetch_GetPagedDataWithFKPMTableJson&parameter=@EndPoint = 'Candidate',@OrderByColumn = 'userid',@OrderDirection = 'desc',@PageNumber = ${params.pageNumber},@PageSize = ${params.pageSize},@PrimaryColumns = 'candidateid,userid,firstname,lastname,phonenumber,email,countryid,address,cityid,stateid,zipcode,dob,ethnicityid,genderid,employmenteligiblity,isreadytoworkimmediately,summary,additionalinformation,jobprofile,pronounid,availabilitytowork,isexcludemycurrentemployer,source,status,profilenotificationdate,jobmatchattemptcount,jobmatchattemptdatetime',@Filter  = 't.source = ''Bullhorn'' ${isActiveFilter} AND (t.email like ''%${params.searchText}%'' OR t.firstname like ''%${params.searchText}%'' OR t.lastname like ''%${params.searchText}%'' )', @SelectedFKTables = 'Usermaster,City,State,Country',@SelectedChildTables = 'ATSCandidateDetail'`;
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

export const fetchATSCompanyList = createAsyncThunk(
    `${name}/fetchATSCompanyList`,
    async (params) => {

        const {SearchText = "",IsActive = null,currentpage = 1,PageSize = 10} = params;

        //parameter string as api
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

        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/Get_ATS_Company_List?parameter=${encodeURIComponent(parameter)}`;

        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);

// New API for getting authorized ATS list
export const getAuthorizedATSList = createAsyncThunk(
    `${name}/getAuthorizedATSList`,
    async (params = {}) => {
        const { pagesize = 12, currentpage = 1 } = params;
        const parameter = `@pagesize=${pagesize},@currentpage=${currentpage}`;
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/V2/Get_Authorized_ATS_List?parameter=${encodeURIComponent(parameter)}`;
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);
export const getAtsCandidateAssignedDetail = createAsyncThunk(
    `${name}/getAtsCandidateAssignedDetail`,
    async (atscandidateid) => {
        const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ATSCandidateDetail/GetAtsCandidateDetail/${atscandidateid}`;
        console.log("API Endpoint:", TOKEN_END_POINT); 
        return await fetchWrapper.get(TOKEN_END_POINT);
    }
);
    export  const updateAtsCandidateDetails = createAsyncThunk(
        `${name}/updateAtsCandidateDetails`,
        async (payload) => {
            debugger
            console.log("Payload for Update:", payload);
            const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/ATSCandidateDetail/UpdateAtsCandidateDetails/`;
            return await fetchWrapper.put(TOKEN_END_POINT, payload);
        }
    );
// Create the slice
const atsSlice = createSlice({
    name,
    initialState: {
        // initialize state from local storage to enable user to stay logged in
        atsauthorizationList: [],
        atstypeList: [],
        getAtsCandidateAssignedDetail: [],
        AtsCandidateAssignedDetail: [],
        error: null,
        loader: false,
        totalrows: 0,
    },
    reducers: {
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCompanyATS.pending, (state, { payload }) => {
                state.loader = true;
                state.atsauthorizationList = [];
            })
            .addCase(getCompanyATS.fulfilled, (state, action) => {
                console.log(action.payload);
                state.atsauthorizationList = action.payload?.data?.data || [];
                //state.atsauthorizationList = payload?.data?.data;
                state.loader = false;
            })
            .addCase(getCompanyATS.rejected, (state, action) => { state.loader = false; })
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
            .addCase(getATSList.pending, (state, { payload }) => {
                state.loader = true;
                state.atstypeList = [];
            })
            .addCase(getATSList.fulfilled, (state, action) => {
                console.log(action.payload);
                state.atstypeList = action?.payload?.data?.data || [];
                state.loader = false;
                //state.atsauthorizationList = payload?.data?.data;
            })
            .addCase(getATSList.rejected, (state, action) => { state.loader = false; })
            .addCase(deleteAtsAuthorization.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(deleteAtsAuthorization.fulfilled, (state) => {
                state.loader = false;
            })
            .addCase(deleteAtsAuthorization.rejected, (state, action) => {
                state.loader = false;
            }).addCase(fetchCustomerCandidates.pending, (state, { payload }) => {
                state.loader = true;
                state.candidates = [];
            })
            .addCase(fetchCustomerCandidates.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loader = false;
                if (action.payload?.data[0]?.data?.length > 0)
                    state.candidates = JSON.parse(action.payload?.data[0]?.data || []);
                state.totalrows = action.payload?.data[0]?.totalrecord || 0;

            })
            .addCase(fetchCustomerCandidates.rejected, (state, action) => {
                state.loader = false;
            })
            .addCase(fetchATSCompanyList.pending, (state) => {
                state.loader = true;
                state.companyList = [];
            })
            .addCase(fetchATSCompanyList.fulfilled, (state, action) => {
                state.loader = false;
                // sp response
                if (action?.payload?.data?.data) {
                    state.companyList = action?.payload?.data?.data;
                    state.totalrows = action.payload.data?.totalRows || 0;
                } else {
                    state.companyList = [];
                    state.totalrows = 0;
                }
            })
            .addCase(fetchATSCompanyList.rejected, (state) => {
                state.loader = false;
            })
            .addCase(getAuthorizedATSList.pending, (state) => {
                state.loader = true;
                state.atsauthorizationList = [];
            })
            .addCase(getAuthorizedATSList.fulfilled, (state, action) => {
                console.log(action.payload);
                state.atsauthorizationList = action.payload?.data?.data || [];
                state.loader = false;
            })
            .addCase(getAuthorizedATSList.rejected, (state, action) => {
                state.loader = false;
            })
            .addCase(getAtsCandidateAssignedDetail.pending, (state) => {
                state.loader = true;
                state.AtsCandidateAssignedDetail = [];
            })
            .addCase(getAtsCandidateAssignedDetail.fulfilled, (state, action) => {
                state.loader = false;
                // sp response
                if (action?.payload?.data?.data) {
                    state.AtsCandidateAssignedDetail = action?.payload?.data?.data;
                    state.totalrows = action.payload.data?.totalRows || 0;
                } else {
                    state.AtsCandidateAssignedDetail = [];
                    state.totalrows = 0;
                }
            })
            .addCase(getAtsCandidateAssignedDetail.rejected, (state) => {
                state.loader = false;
            })
            .addCase(updateAtsCandidateDetails.pending, (state) => {
                state.AtsCandidateAssignedDetail = [];
                state.loader = true;

            })
            .addCase(updateAtsCandidateDetails.fulfilled, (state, action) => {
                    state.loader = false;
                    state.AtsCandidateAssignedDetail = action.payload?.data || [];
                 
            })
            .addCase(updateAtsCandidateDetails.rejected, (state) => {
                state.loader = false;
            });
    },
});

// Export the actions and reducer
export const atsActions = {
    ...atsSlice.actions,
    getCompanyATS,
    getAuthorizedATSList,
    postAtsAuthorization,
    getATSList,
    deleteAtsAuthorization,
    fetchCustomerCandidates,
    fetchATSCompanyList,
    getAtsCandidateAssignedDetail,
    updateAtsCandidateDetails,

};

export const atsReducer = atsSlice.reducer;