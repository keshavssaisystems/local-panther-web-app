import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";
import { get } from "lodash";

const initialState = {
  user: {
    data: [], // Initialize with an empty array
  },
  dropdownLists: {
    cityDropdown: [],
    stateDropDown: [],
    countryDropdown: [],
    genderDropDown: "",
    ethnicityDropdown: "",
    eligibilityDropDown: [
      {
        id: 1,
        name: "Authorized to work in the US",
      },
      {
        id: 2,
        name: "Sponsorship required",
      },
    ],

    selectedCity: [
      {
        value: 0,
        label: "",
      },
    ],
    selectedState: [
      {
        value: 0,
        label: "",
      },
    ],
    selectedCountry: [
      {
        value: 0,
        label: "",
      },
    ],
    selectedEthnicity: [
      {
        value: 0,
        label: "",
      },
    ],
    selectedGender: [
      {
        value: 0,
        label: "",
      },
    ],
    selectedPronoun: [
      {
        value: 0,
        label: "",
      },
    ],
  },

  pronounList: [],
  reasonList: [],
  distanceList: [],
  availabilityList: [],
  profileData: {
    personalInfo: {},
    resumeInfo: {},
    skillsInfo: [],
    qualificationsInfo: [],
    certificationsInfo: [],
    educationInfo: [],
    additionalInfo: [],
    jobPreferenceInfo: [],
  },

  error: null,
  loader: false,
  profileImage:
    localStorage.getItem("profileImage") === ""
      ? null
      : localStorage.getItem("profileImage"),
  candidateHistory: []
};

// Define the async action
export const getCandidate = createAsyncThunk(
  "candidate/getCandidate",
  async (candidateid) => {
    const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Candidate/GetCandidateById/${candidateid}`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const getPronoun = createAsyncThunk(
  "candidate/getPronoun",
  async (inputValue) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=pronounsname`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const getReasonList = createAsyncThunk(
  "user/getReasonList",
  async (input) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=${input}`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const getDistanceDetails = createAsyncThunk(
  "user/getDistanceDetails",
  async (input) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=${input}`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const getAvailability = createAsyncThunk(
  "user/getAvailability",
  async (input) => {
    const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Common/GetCommonDropdown?searchText=availabilitytowork`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

export const updateProfileImage = createAsyncThunk(
  "candidate/getCandidate",
  async (candidateid) => {
    const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Candidate/GetCandidateById/${candidateid}`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);

// updateEmploymentEligibilityThunk thunk
export const updateEmploymentEligibilityThunk = createAsyncThunk(
  `candidate/updateEmploymentEligibilityThunk`,
  async ({ candidateId, payload }) => {
    const CANDIDATE_PUT_ENDPOINT = `${process.env.REACT_APP_MAIN_API_URL}/api/Candidate/candidateEmploymentEligibility?candidateId=${candidateId}`;
    return await fetchWrapper.put(CANDIDATE_PUT_ENDPOINT, payload);
  }
);


export const getCandidateHistory = createAsyncThunk(
  `candidate/getCandidateHistory`,

  async (candidateId) => {
    const baseUrl = `${process.env.REACT_APP_PANTHER_URL}/api`;
    const response = await fetchWrapper.get(
      `${baseUrl}/Report/GetReportBySP?storedProcedure=Report_CandidateRecommendedJob_Event_History&parameter=${candidateId}`
    );

    return response.data; // Assuming your API response has a "data" property
  }
);
// Create the slice
const getProfileSlice = createSlice({
  name: "getProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCandidate.pending, (state) => {
        state.error = null;
        state.loader = true;
      })
      .addCase(getCandidate.fulfilled, (state, action) => {
        // state.user.data = action.payload; // Update the state properly
        state.loader = false;
        let filter_data = action.payload;
        let organization = filter_data.candidateQualificationsDtos.filter(
          (x) => x.iscurrentlyworking == true
        );

        let data = {
          position: organization?.length > 0 ? organization[0].jobtitle : "",
          organization:
            organization.length > 0 ? organization[0].company : "Not Working",
          eligibility: state.dropdownLists.eligibilityDropDown.find(
            (x) => x.id == filter_data.employmenteligiblity
          )?.name,
          readyToWork: filter_data.isreadytoworkimmediately ? "Yes" : "No",
          phonenumber: filter_data.phonenumber,
          email: filter_data.email,
          state: filter_data.statename,
          city: filter_data.cityname,
          country: filter_data.countryname,
          dob: filter_data.dob ? filter_data.dob : null,
          gender: filter_data.gendername,
          race: filter_data.ethnicityname,
          summary: filter_data.summary,
          additionalinformation: filter_data.additionalinformation,

          candidateid: 0,
          jobprofile: filter_data.jobprofile,
          firstname: filter_data.firstname,
          lastname: filter_data.lastname,
          genderid: filter_data.genderid,
          cityid: filter_data.cityid,
          stateid: filter_data.stateid,
          countryid: filter_data.countryid,
          zipcode: filter_data.zipcode,
          ethnicityid: filter_data.ethnicityid,
          ethnicity: filter_data.ethnicity,
          employmenteligiblity: filter_data.employmenteligiblity,
          address: filter_data.address,
          isreadytoworkimmediately: filter_data.isreadytoworkimmediately,
          isexcludemycurrentemployer: filter_data.isexcludemycurrentemployer,
          isactive: true,
          userid: 0,
          currentUserId: 0,
          pronounname: filter_data.pronounname,
          pronounid: filter_data.pronounid,
          availabilitytowork: filter_data.availabilitytowork,
        };
        let new_data = { ...state.profileData };
        new_data.personalInfo = data;
        new_data.skillsInfo = filter_data.candidateSkillDtos;
        new_data.resumeInfo = filter_data.candidateResumeDto;
        new_data.qualificationsInfo = filter_data.candidateQualificationsDtos;
        new_data.educationInfo = filter_data.candidateEducationDtos;
        new_data.certificationsInfo = filter_data.candidateCertificationDtos;
        new_data.additionalInfo =
          filter_data.candidateAdditionalInfoDetailsDtos;
        new_data.jobPreferenceInfo = filter_data.candidateJobPreferenceDtos;
        state.profileData = new_data;

        let dropdown_selected = { ...state.dropdownLists };

        dropdown_selected.selectedCity = [
          {
            value: filter_data.cityid,
            label: `${filter_data.cityname + ", " + filter_data.statename}`,
          },
        ];
        dropdown_selected.selectedState = [
          {
            value: filter_data.stateid,
            label: filter_data.statename,
          },
        ];
        dropdown_selected.selectedCountry = [
          {
            value: filter_data.countryid,
            label: filter_data.countryname,
          },
        ];
        dropdown_selected.selectedGender = [
          {
            value: filter_data.genderid,
            label: filter_data.gendername,
          },
        ];
        dropdown_selected.selectedEthnicity = [
          {
            value: filter_data.ethnicityid,
            label: filter_data.ethnicity,
          },
        ];
        dropdown_selected.selectedPronoun = [
          {
            value: filter_data.pronounid,
            label: filter_data.pronounname,
          },
        ];
        dropdown_selected.selectedAvailability = filter_data.availabilitytowork;

        state.dropdownLists = dropdown_selected;
        state.profileImage = localStorage.getItem("profileImage");
      })
      .addCase(getCandidate.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error;
      })

      .addCase(getPronoun.pending, (state) => {
        state.error = null;
      })
      .addCase(getPronoun.fulfilled, (state, action) => {
        state.pronounList = action.payload.map(({ id: value, ...rest }) => {
          return {
            value,
            label: `${rest.name}`,
          };
        });
      })
      .addCase(getPronoun.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(getReasonList.pending, (state) => {
        state.error = null;
      })
      .addCase(getReasonList.fulfilled, (state, action) => {
        state.reasonList = action.payload;
      })
      .addCase(getReasonList.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(getDistanceDetails.pending, (state) => {
        state.error = null;
      })
      .addCase(getDistanceDetails.fulfilled, (state, action) => {
        let data = action.payload;

        state.distanceList = data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: rest.name,
          };
        });
      })
      .addCase(getDistanceDetails.rejected, (state, action) => {
        state.error = action.error;
      })

      .addCase(getAvailability.pending, (state) => {
        state.error = null;
      })
      .addCase(getAvailability.fulfilled, (state, action) => {
        let data = action.payload;

        state.availabilityList = data.map(({ id: value, ...rest }) => {
          return {
            value,
            label: rest.name,
          };
        });
      })
      .addCase(getAvailability.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(updateEmploymentEligibilityThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(updateEmploymentEligibilityThunk.fulfilled, (state, action) => {
        state.updateJob = action.payload.data;
        state.loading = false;
      })
      .addCase(updateEmploymentEligibilityThunk.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(getCandidateHistory.pending, (state) => { })
      .addCase(getCandidateHistory.fulfilled, (state, action) => { 
        state.candidateHistory = get(action, 'payload.data', []);
      })
      .addCase(getCandidateHistory.rejected, (state, action) => { })

      ;
  },
});

// Export the actions and reducer
export const getProfileActions = {
  ...getProfileSlice.actions,
  getCandidate, // Export the async action
  getPronoun,
  getReasonList,
  getDistanceDetails,
  getAvailability,
  updateEmploymentEligibilityThunk,
  getCandidateHistory
};
export const getProfileReducer = getProfileSlice.reducer;
