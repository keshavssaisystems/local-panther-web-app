// src/_store/profileCompletion.actions.js

import { authHeader, handleResponse } from '_helpers';
export const profileCompletionActions = {
  checkMissingFields,
  updateProfile,
  getMissingFields,
  triggerChatbot
};
export const profileCompletionConstants = {
  CHECK_MISSING_REQUEST: 'PROFILE_COMPLETION_CHECK_MISSING_REQUEST',
  CHECK_MISSING_SUCCESS: 'PROFILE_COMPLETION_CHECK_MISSING_SUCCESS',
  CHECK_MISSING_FAILURE: 'PROFILE_COMPLETION_CHECK_MISSING_FAILURE',

  UPDATE_PROFILE_REQUEST: 'PROFILE_COMPLETION_UPDATE_REQUEST',
  UPDATE_PROFILE_SUCCESS: 'PROFILE_COMPLETION_UPDATE_SUCCESS',
  UPDATE_PROFILE_FAILURE: 'PROFILE_COMPLETION_UPDATE_FAILURE',

  GET_MISSING_FIELDS: 'PROFILE_COMPLETION_GET_MISSING_FIELDS',
  TRIGGER_CHATBOT: 'PROFILE_COMPLETION_TRIGGER_CHATBOT'
};
function checkMissingFields(candidateId) {
  return dispatch => {
    dispatch(request());

    // profileCompletionService.checkMissingFields(candidateId)
    //   .then(
    //     missingFields => {
    //       dispatch(success(missingFields));
          
    //       // Auto-trigger chatbot if there are missing fields
    //       if (missingFields && missingFields.length > 0) {
    //         dispatch(triggerChatbot(true));
    //       }
    //     },
    //     error => {
    //       dispatch(failure(error));
    //       dispatch(alertActions.error(error));
    //     }
    //   );
  };

  function request() { return { type: profileCompletionConstants.CHECK_MISSING_REQUEST } }
  function success(missingFields) { return { type: profileCompletionConstants.CHECK_MISSING_SUCCESS, missingFields } }
  function failure(error) { return { type: profileCompletionConstants.CHECK_MISSING_FAILURE, error } }
}

function updateProfile({ candidateId, data }) {
  return dispatch => {
    dispatch(request());

    // profileCompletionService.updateProfile(candidateId, data)
    //   .then(
    //     profile => {
    //       dispatch(success(profile));
    //       dispatch(alertActions.success('Profile updated successfully!'));
          
    //       // Close chatbot after successful update
    //       dispatch(triggerChatbot(false));
    //     },
    //     error => {
    //       dispatch(failure(error));
    //       dispatch(alertActions.error('Failed to update profile. Please try again.'));
    //     }
    //   );
  };

  function request() { return { type: profileCompletionConstants.UPDATE_PROFILE_REQUEST } }
  function success(profile) { return { type: profileCompletionConstants.UPDATE_PROFILE_SUCCESS, profile } }
  function failure(error) { return { type: profileCompletionConstants.UPDATE_PROFILE_FAILURE, error } }
}

function getMissingFields() {
  return { type: profileCompletionConstants.GET_MISSING_FIELDS };
}

function triggerChatbot(isOpen) {
  return { type: profileCompletionConstants.TRIGGER_CHATBOT, isOpen };
}

// src/_store/profileCompletion.constants.js


const initialState = {
  missingFields: [],
  loading: false,
  error: null,
  chatbotOpen: false,
  profileComplete: false
};

export function profileCompletion(state = initialState, action) {
  switch (action.type) {
    case profileCompletionConstants.CHECK_MISSING_REQUEST:
      return {
        ...state,
        loading: true
      };
    case profileCompletionConstants.CHECK_MISSING_SUCCESS:
      return {
        ...state,
        loading: false,
        missingFields: action.missingFields,
        profileComplete: action.missingFields.length === 0
      };
    case profileCompletionConstants.CHECK_MISSING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    
    case profileCompletionConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case profileCompletionConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        missingFields: [],
        profileComplete: true
      };
    case profileCompletionConstants.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    
    case profileCompletionConstants.TRIGGER_CHATBOT:
      return {
        ...state,
        chatbotOpen: action.isOpen
      };
    
    default:
      return state;
  }
}


// export const profileCompletionService = {
//   checkMissingFields,
//   updateProfile,
//   sendEmailReminder
// };

// function checkMissingFields(candidateId) {
//   const requestOptions = {
//     method: 'GET',
//     headers: authHeader()
//   };

//   return fetch(`${process.env.REACT_APP_API_URL}/api/profile/check-missing/${candidateId}`, requestOptions)
//     .then(handleResponse);
// }

// function updateProfile(candidateId, data) {
//   const requestOptions = {
//     method: 'PUT',
//     headers: { ...authHeader(), 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   };

//   return fetch(`${process.env.REACT_APP_API_URL}/api/profile/update/${candidateId}`, requestOptions)
//     .then(handleResponse);
// }

// function sendEmailReminder(candidateId, missingFields) {
//   const requestOptions = {
//     method: 'POST',
//     headers: { ...authHeader(), 'Content-Type': 'application/json' },
//     body: JSON.stringify({ candidateId, missingFields })
//   };

//   return fetch(`${process.env.REACT_APP_API_URL}/api/profile/email-reminder`, requestOptions)
//     .then(handleResponse);
// }