import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice name
const name = 'adminDashboard';
const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}/api`;
const timeIntervalDefault = 'month';
const todaysDate = new Date().toLocaleDateString('fr-CA');
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-CA')

const cardStats= {
      activecompanycount: 0, 
      activecustomercount: 0, 
      activecandidatecount: 0, 
      newcandidateregistrationcount: 0,
      totalCandidates: 150,
      todaysinterviewscheduledcount: 0,
      upcominginterviewscheduledcount: 0,
      pastinterviewscheduledcount: 0
      
    };

const candidatesDataDummy = [
  { id: 0, label: "01/01/2024", noRecommendedJobs: 4, activeCandidates: 240, recommededJobs: 2400 },
  { id: 1, label: "02/01/2023", noRecommendedJobs: 0, activeCandidates: 139, recommededJobs: 2210 },
  { id: 2, label: "03/01/2023", noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2290 },
  { id: 3, label: "04/01/2023", noRecommendedJobs: 2, activeCandidates: 390, recommededJobs: 2000 },
  { id: 4, label: "05/01/2023", noRecommendedJobs: 1, activeCandidates: 480, recommededJobs: 2181 },
  { id: 5, label: "06/01/2023", noRecommendedJobs: 3, activeCandidates: 380, recommededJobs: 2500 },
  { id: 6, label: "07/01/2023", noRecommendedJobs: 0, activeCandidates: 430, recommededJobs: 2100 },
  { id: 7, label: "08/01/2023", noRecommendedJobs: 2, activeCandidates: 680, recommededJobs: 2290 },
  { id: 8, label: "09/01/2023", noRecommendedJobs: 4, activeCandidates: 790, recommededJobs: 2000 },
  { id: 9, label: "10/01/2023", noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2181 },
  { id: 10, label: yesterday, noRecommendedJobs: 0, activeCandidates: 800, recommededJobs: 1500 },
  { id: 11, label: todaysDate, noRecommendedJobs: 0, activeCandidates: 300, recommededJobs: 2100 }
];


const interviewDataDummy = [
  { id: 0, label: "01/01/2024", noRecommendedJobs: 4, activeCandidates: 240, recommededJobs: 2400, interviewScheduled: 50 },
  { id: 1, label: "02/01/2023", noRecommendedJobs: 0, activeCandidates: 139, recommededJobs: 2210, interviewScheduled: 39 },
  { id: 2, label: "03/01/2023", noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2290, interviewScheduled: 77 },
  { id: 3, label: "04/01/2023", noRecommendedJobs: 2, activeCandidates: 390, recommededJobs: 2000, interviewScheduled: 31 },
  { id: 4, label: "05/01/2023", noRecommendedJobs: 1, activeCandidates: 480, recommededJobs: 2181, interviewScheduled: 51 },
  { id: 5, label: "06/01/2023", noRecommendedJobs: 3, activeCandidates: 380, recommededJobs: 2500, interviewScheduled: 60 },
  { id: 6, label: "07/01/2023", noRecommendedJobs: 0, activeCandidates: 430, recommededJobs: 2100, interviewScheduled: 78 },
  { id: 7, label: "08/01/2023", noRecommendedJobs: 2, activeCandidates: 680, recommededJobs: 2290, interviewScheduled: 59 },
  { id: 8, label: "09/01/2023", noRecommendedJobs: 4, activeCandidates: 790, recommededJobs: 2000, interviewScheduled: 71 },
  { id: 9, label: "10/01/2023", noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2181, interviewScheduled: 121 },
  { id: 10, label: yesterday, noRecommendedJobs: 0, activeCandidates: 800, recommededJobs: 1500, interviewScheduled: 201 },
  { id: 11, label: todaysDate, noRecommendedJobs: 0, activeCandidates: 300, recommededJobs: 2100, interviewScheduled: 82 }
];

export const getScores = createAsyncThunk(
  `${name}/getScores`,
  async (date) => {
    const dashboardScoreURL = `${baseUrl}/AdminDashboard/DasboardCount?date=${date}`;
    return await fetchWrapper.get(dashboardScoreURL);
  }
);

export const getCandidates = createAsyncThunk(
  `${name}/getCandidates`,
  async (payload = {}) => {
    
    const GET_CANDIDATES_STATS = `${process.env.REACT_APP_NEW_API_URL}/Report/GetNewCandidatesList?${new URLSearchParams(payload)}`;
    return await fetchWrapper.get(GET_CANDIDATES_STATS);
  }
);

// Create the slice
const adminDashboardSlice = createSlice({
  name,
  initialState: {
    // initialize state from local storage to enable user to stay logged in
    loading: false,
    error: null,
    cardStats,
    todaysDate,
    timeInterval: timeIntervalDefault,
    candidatesData: candidatesDataDummy,
    totalInterviewScheduled: 0

  },
  reducers: {
    logout: (state, { payload }) => {
      state.user = {};
    },
  },

  extraReducers: {
    // Scores for Dashboard Cards  
    [getScores.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getScores.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.cardStats = data;
      state.totalInterviewScheduled = data.todaysinterviewscheduledcount + data.upcominginterviewscheduledcount + data.pastinterviewscheduledcount
      // below are dummy data, api not available
      state.cardStats.totalCandidates = 120;

    },
    [getScores.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    // Candidates Stats for Dashboard Charts  
    [getCandidates.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getCandidates.fulfilled]: (state, { payload = {} }) => {
      const { data } = payload;
      state.loading = false;
      state.candidatesData = candidatesDataDummy;    // dummy data, api not available
    },
    [getCandidates.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

  },
});

// Export the actions and reducer
// export const adminDashboardSliceActions = {
//   ...adminDashboardSlice.actions,
//   scoresThunk, // Export the async open jobs action
// };
export const { fetchScores } = adminDashboardSlice.actions
export const adminDashboardReducer = adminDashboardSlice.reducer;
