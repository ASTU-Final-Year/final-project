
function _fetch(url, method, init) {
  if (window == null) return null;
  init = init ?? {};
  if (init.body === undefined) {
    return fetch(url, {
      method,
      credentials: "include",
      ...init,
      headers: [
        ["Content-type", "application/json"],
        ...(init.headers ? init.headers : [])
      ],
    });
  } else {
    const body = JSON.stringify(init.body);
    return fetch(url, {
      method,
      credentials: "include",
      ...init,
      body,
      headers: [
        ["Content-type", "application/json"],
        ...(init.headers ? init.headers : [])
      ],
    });
  }
}

const RequestHandler = {
  async Get(url, init) {
    return _fetch(url, "GET", init);
  },

  async Post(url, init) {
    return _fetch(url, "POST", init);
  },

  async Patch(url, init) {
    return _fetch(url, "PATCH", init);
  },

  async Delete(url, init) {
    return _fetch(url, "DELETE", init);
  }
};

export default RequestHandler;
