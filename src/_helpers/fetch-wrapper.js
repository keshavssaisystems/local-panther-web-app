import { store, authActions } from "_store";

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

const memoryCache = {};
const inflightRequests = {};
const EXCLUDED_DROPDOWN_KEYS = [
  'userListByCompany',
  'ScheduledCandidatesForCustomer',
  'ScheduledCandidateListByUserId',
];

function isCacheableDropdown(url) {
  if (!url.includes('/api/Common/GetCommonDropdown?searchText=')) {
    return false;
  }

  return !EXCLUDED_DROPDOWN_KEYS.some(key =>
    url.includes(`searchText=${key}`)
  );
}

function request(method) {
  return async (url, body) => {
    const shouldCache = isCacheableDropdown(url);
    const cacheKey = url;
    const cacheTtl = 300000; // 5 minutes

    if (shouldCache) {
      const cached = memoryCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < cacheTtl) {
        return cached.data;
      }

      if (inflightRequests[cacheKey]) {
        return inflightRequests[cacheKey];
      }

      inflightRequests[cacheKey] = (async () => {
        const requestOptions = {
          method,
          headers: authHeader(url),
        };

        if (body) {
          requestOptions.headers["Content-Type"] = "application/json";
          requestOptions.body = JSON.stringify(body);
        }

        try {
          const data = await fetch(url, requestOptions).then(handleResponse);
          memoryCache[cacheKey] = { data, timestamp: Date.now() };
          return data;
        } finally {
          delete inflightRequests[cacheKey];
        }
      })();

      return inflightRequests[cacheKey];
    }

    // Non-cacheable (dynamic) dropdowns
    const requestOptions = {
      method,
      headers: authHeader(url),
    };

    if (body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }

    return fetch(url, requestOptions).then(handleResponse);
  };
}


// helper functions

function authHeader(url) {
  // return auth header with basic auth credentials if user is logged in and request is to the api url
  const authData = basicAuthData();
  const isLoggedIn = !!authData;
  const isApiUrl = url.startsWith(process.env.REACT_APP_MAIN_API_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${authData}` };
  } else {
    if (url.indexOf("Login") > -1) {
      const userAgent = navigator.userAgent;
      let os = "Unknown OS";

      if (userAgent.indexOf("Win") != -1) os = "Windows";
      if (userAgent.indexOf("Mac") != -1) os = "MacOS";
      if (userAgent.indexOf("X11") != -1) os = "UNIX";
      if (userAgent.indexOf("Linux") != -1) os = "Linux";
      if (userAgent.indexOf("Android") != -1) os = "Android";
      if (userAgent.indexOf("like Mac") != -1) os = "iOS";
      return {
        LoginSource: "Web",

        LoginDevice: os,
        // OsVersion: userAgent ? userAgent.toString() : "",
        LoginDeviceId: os,
        IpAddress: localStorage.getItem("publicip")
          ? localStorage.getItem("publicip")
          : "Web",
      };
    } else {
      return {};
    }
  }
}

function basicAuthData() {
  return localStorage.getItem("token") ? localStorage.getItem("token") : "";
}

async function handleResponse(response) {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  // check for error response
  if (!response.ok) {
    if (basicAuthData() && [401, 403].includes(response.status)) {
      // auto logout if logged in and response status is 401 Unauthorized or 403 Forbidden
      const logout = () => store.dispatch(authActions.logout());
      logout();
    }

    // get error message from body or default to response status
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  } else if (data?.status === "Failed") {
    if (basicAuthData() && [401, 403].includes(response.statusCode)) {
      // auto logout if logged in and response status is 401 Unauthorized or 403 Forbidden
      const logout = () => store.dispatch(authActions.logout());
      logout();
    }

    // get error message from body or default to response status
    const error = (data && data.message) || response.statusCode;
    return Promise.reject(error);
  }

  return data;
}
