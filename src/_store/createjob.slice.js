import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

// create slice
const name = "createjob";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const createjobActions = { ...slice.actions, ...extraActions };
export const createjobReducer = slice.reducer;

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    user: {},
    error: null,
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_JOB_API_URL}/api`;

  return {
    getCreatejob: getCreatejob(),
  };

  function getCreatejob() {
    return createAsyncThunk(`${name}/getCreatejob`, async (jobData) => {
      await fetchWrapper.post(`${baseUrl}/job`, { ...jobData });
    });
  }
}

function createExtraReducers() {
  return (builder) => {
    getCreatejob();

    function getCreatejob() {
      var { pending, fulfilled, rejected } = extraActions.getCreatejob;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, action) => {
         
        })
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}
