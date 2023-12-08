import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { history, fetchWrapper } from "_helpers";

// create slice
const name = "candidate-profile";
const initialState = createInitialState();
const personalDetailsAction = personalInfoInsertActions();
const detailsReducer = insertPersonalInfoReducer();
const resumeUpdateAction = resumeUpdateActions();
const deleteResumeActions = resumedeleteActions();
const addResumeAction = resumeAddActions();
const resumeUpdateReducer = updateResumeReducer();
const resumeAddReducer = addResumeReducer();
const resumeDeleteReducer = deleteResumeReducer();

const addSkillReducer = addSkillsReducer();
const addSkillAction = addSkillsActions();

const qualificationDeleteActions = deleteQualificationActions();
const qualificationRemoveReducer = deleteQualificationReducer();

const slice = createSlice({
  name,
  initialState,
  detailsReducer,
  resumeUpdateReducer,
  resumeAddReducer,
  resumeDeleteReducer,
  addSkillReducer,
  qualificationRemoveReducer,
});

const baseUrl = `${process.env.REACT_APP_MAIN_API_URL}`;

// exports
export const profileActions = {
  ...slice.actions,
  ...personalDetailsAction,
  ...resumeUpdateAction,
  ...addResumeAction,
  ...deleteResumeActions,
  ...addSkillAction,
  ...qualificationDeleteActions,
};
export const profileReducer = slice.reducer;

const candidateId = JSON.parse(localStorage.getItem("userDetails"))?.UserId;

function createInitialState() {
  return {
    // initialize state from local storage to enable user to stay logged in
    candidateList: {},
    personalInfoError: null,
    personalInfo: null,
    candidateDetails: null,
  };
}

function personalInfoInsertActions() {
  return {
    insertPersonalInfo: insertPersonalInfo(),
  };

  function insertPersonalInfo() {
    return createAsyncThunk(
      `${name}/Candidate`,
      async ({
        candidateid,
        firstname,
        lastname,
        dob,
        email,
        phonenumber,
        address,
        genderid,
        cityid,
        stateid,
        countryid,
        zipcode,
        ethnicityid,
        employmenteligiblity,
        isreadytoworkimmediately,
        isactive,
        userid,
        jobprofile,
        pronounid,
      }) =>
        await fetchWrapper.put(`${baseUrl}/api/Candidate/${candidateid}`, {
          candidateid,
          firstname,
          lastname,
          dob,
          email,
          phonenumber,
          address,
          genderid,
          cityid,
          stateid,
          countryid,
          zipcode,
          ethnicityid,
          employmenteligiblity,
          isreadytoworkimmediately,
          isactive,
          userid,
          jobprofile,
          pronounid,
        })
    );
  }
}

function insertPersonalInfoReducer() {
  return (builder) => {
    insertPersonalInfo();

    function insertPersonalInfo() {
      var { pending, fulfilled, rejected } =
        personalDetailsAction.insertPersonalInfo;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, action) => {
          state.personalInfo = true;
        })
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}

function resumeAddActions() {
  return {
    addResume: addResume(),
  };

  function addResume() {
    return createAsyncThunk(
      `${name}/Candidate/GetCandidateById`,
      async (form) =>
        await fetchWrapper.post(`${baseUrl}/api/PostResume`, form, "form")
    );
  }
}

function addResumeReducer() {
  return (builder) => {
    addResume();

    function addResume() {
      var { pending, fulfilled, rejected } = resumeUpdateAction.addResume;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, payload) => {})
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}

function resumeUpdateActions() {
  return {
    updateResume: updateResume(),
  };

  function updateResume() {
    return createAsyncThunk(
      `${name}/Candidate/GetCandidateById`,
      async (candidateresumeid, form) =>
        await fetchWrapper.put(
          `${baseUrl}/api/PutResume/${candidateresumeid}`,
          {
            form,
          }
        )
    );
  }
}

function updateResumeReducer() {
  return (builder) => {
    updateResume();

    function updateResume() {
      var { pending, fulfilled, rejected } = resumeUpdateAction.updateResume;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, payload) => {})
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}

function resumedeleteActions() {
  return {
    deleteResume: deleteResume(),
  };

  function deleteResume() {
    return createAsyncThunk(
      `${name}/Candidate/GetCandidateById`,
      async (resumeId) =>
        await fetchWrapper.delete(
          `${baseUrl}/DeleteResume?candidateResumeId=${resumeId}`
        )
    );
  }
}

function deleteResumeReducer() {
  return (builder) => {
    deleteResume();

    function deleteResume() {
      var { pending, fulfilled, rejected } = deleteResumeActions.deleteResume;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, payload) => {})
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}

function addSkillsActions() {
  return {
    addSkills: addSkills(),
  };

  function addSkills() {
    return createAsyncThunk(
      `${name}/addSkills`,

      async (id, skills_data) => {
        await fetchWrapper.put(
          `${baseUrl}/api/CandidateSkill/UpdateCandidateSkill/${id}/${candidateId}`,
          skills_data
        );
      }
    );
  }
}

function addSkillsReducer() {
  return (builder) => {
    addSkills();

    function addSkills() {
      var { pending, fulfilled, rejected } = addSkillAction.addSkills;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, action) => {
          state.personalInfo = true;
        })
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}

function deleteQualificationActions() {
  return {
    deleteQualification: deleteQualification(),
  };

  function deleteQualification() {
    return createAsyncThunk(
      `${name}/Candidate/deleteQualification`,
      async (deleteId) =>
        await fetchWrapper.delete(
          `${baseUrl}/api/CandidateQualifications/${deleteId}`
        )
    );
  }
}

function deleteQualificationReducer() {
  return (builder) => {
    deleteQualification();

    function deleteQualification() {
      var { pending, fulfilled, rejected } =
        qualificationDeleteActions.deleteQualification;
      builder
        .addCase(pending, (state) => {
          state.error = null;
        })
        .addCase(fulfilled, (state, payload) => {})
        .addCase(rejected, (state, action) => {
          state.error = action.error;
        });
    }
  };
}
