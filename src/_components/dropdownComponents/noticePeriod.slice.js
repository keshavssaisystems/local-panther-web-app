import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWrapper } from "_helpers";

// create slice
const name = "noticePeriod";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports
export const noticePeriodActions = { ...slice.actions, ...extraActions };
export const noticePeriodReducer = slice.reducer;

// implementation
function createInitialState() {
  return {
    noticePeriod: [],
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_MASTER_API_URL}/api`;

  return {
    getNoticePeriod: getNoticePeriod(),
  };

  function getNoticePeriod() {
    return createAsyncThunk(
      `${name}/getNoticePeriod`,
      async () =>
        await fetchWrapper.get(
          `${baseUrl}/Common/GetCommonDropdown?searchText=noticeperiod`
        )
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getNoticePeriod();

    function getNoticePeriod() {
      var { pending, fulfilled, rejected } = extraActions.getNoticePeriod;
      builder
        .addCase(pending, (state) => {
          state.noticePeriod = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          state.noticePeriod = action.payload.data;
        })
        .addCase(rejected, (state, action) => {
          state.noticePeriod = { error: action.error };
        });
    }
  };
}
