export const msWrapper = {
  get: request("GET"),
  post: request("POST"),
};

function request(method) {
  return (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(),
    };
    if (body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions).then(handleResponse);
  };
}

// helper functions

function authHeader() {
  let clientId = process.env.REACT_APP_API_KEY;
  let msalKey = localStorage.getItem("msal.token.keys." + clientId);
  let accessTokenKey = JSON.parse(msalKey).accessToken[0];
  return {
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem(accessTokenKey)).secret
    }`,
  };
}
async function handleResponse(response) {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;
  return data;
}
