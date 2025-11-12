import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "../../../_helpers";

let name = "customerCandidates";

const initialState = {
  candidates: [],
  loading: false,
  error: null,
};

const baseUrl = `${process.env.REACT_APP_NEW_API_URL}`;

export const fetchCustomerCandidates = createAsyncThunk(
  `${name}/fetchCustomerCandidates`,
  async () => {
    const TOKEN_END_POINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Report/GetReportBySP?storedProcedure=Fetch_GetPagedDataWithFKPMTableJson&parameter=%40EndPoint%20%3D%20%27Candidate%27%2C%40OrderByColumn%20%3D%20%27userid%27%2C%40OrderDirection%20%3D%20%27desc%27%2C%40PageNumber%20%3D%201%2C%40PageSize%20%3D%2010%2C%40PrimaryColumns%20%3D%20%27candidateid%2Cuserid%2Cfirstname%2Clastname%2Cphonenumber%2Cemail%2Ccountryid%2Caddress%2Ccityid%2Cstateid%2Czipcode%2Cdob%2Cethnicityid%2Cgenderid%2Cemploymenteligiblity%2Cisreadytoworkimmediately%2Csummary%2Cadditionalinformation%2Cjobprofile%2Cpronounid%2Cavailabilitytowork%2Cisexcludemycurrentemployer%2Csource%2Cstatus%2Cprofilenotificationdate%2Cjobmatchattemptcount%2Cjobmatchattemptdatetime%2Catsinfo%27%2C%40Filter%20%20%3D%20%27t.source%20%3D%20%27%27Bullhorn%27%27%20%27%2C%40SelectedFKTables%20%3D%20%27Usermaster%2CCity%2CStateCountry%27%2C%40SelectedChildTables%20%3D%20%27CandidateCertifications%2C%20CandidateJobPreference%2C%20CandidateQualifications%2C%20CandidateResumeCandidateSkills%2C%20CandidateEducation%2C%20CandidateAdditionalInformations%27`;
    return await fetchWrapper.get(TOKEN_END_POINT);
  }
);

const customerCandidateListSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    candidates: [],
    error: null,
    loader: false,
  },
  reducers: {
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerCandidates.pending, (state, { payload }) => {
        state.loader = true;
        state.candidates = [];
      })
      .addCase(fetchCustomerCandidates.fulfilled, (state, action) => {
        console.log(action.payload);
        state.candidates = action.payload?.data || [];
        //state.atsauthorizationList = payload?.data?.data;
      })
      .addCase(fetchCustomerCandidates.rejected, (state, action) => { })

      // .addCase(fetchCustomerCandidates.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchCustomerCandidates.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.candidates = action.payload;
      // })
      // .addCase(fetchCustomerCandidates.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // });
  },
});

export const atsCustomerCandidateActions = {
  ...customerCandidateListSlice.actions,
  fetchCustomerCandidates,
};

// replace the broken line with a direct default export of the reducer
export default customerCandidateListSlice.reducer;
