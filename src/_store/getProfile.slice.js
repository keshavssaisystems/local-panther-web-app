import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

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
        id: 0,
        name: "Authorized to work in the US",
      },
      {
        id: 1,
        name: "Sponsorship required",
      },
      {
        id: 2,
        name: "Not Specified",
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
  },

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
          ).name,
          readyToWork: filter_data.isreadytoworkimmediately ? "Yes" : "No",
          phonenumber: filter_data.phonenumber,
          email: filter_data.email,
          state: filter_data.statename,
          city: filter_data.cityname,
          country: filter_data.countryname,
          dob: filter_data.dob ? new Date(filter_data.dob) : "",
          gender: filter_data.gendername,
          race: filter_data.ethnicityname,

          candidateid: 0,
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
          isreadytoworkimmediately: filter_data.isreadytoworkimmediately,
          isactive: true,
          userid: 0,
          currentUserId: 0,
        };
        let new_data = { ...state.profileData };
        new_data.personalInfo = data;
        new_data.skillsInfo = filter_data.candidateSkillDtos;
        new_data.resumeInfo = filter_data.candidateResumeDto;
        new_data.qualificationsInfo = filter_data.candidateQualificationsDtos;
        new_data.educationInfo = filter_data.candidateEducationDtos;
        new_data.certificationsInfo = filter_data.candidateCertificationDtos;
        new_data.additionalInfo =
          filter_data.candidateAdditionalInformationDtos;
        new_data.jobPreferenceInfo = filter_data.candidateJobPreferenceDtos;
        state.profileData = new_data;

        let dropdown_selected = { ...state.dropdownLists };

        dropdown_selected.selectedCity = [
          {
            value: filter_data.cityid,
            label: filter_data.cityname,
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

        state.user.data = dropdown_selected;
      })
      .addCase(getCandidate.rejected, (state, action) => {
        state.loader = false;
        state.error = action.error;
      });
  },
});

// Export the actions and reducer
export const getProfileActions = {
  ...getProfileSlice.actions,
  getCandidate, // Export the async action
};
export const getProfileReducer = getProfileSlice.reducer;
