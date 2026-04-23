import { resetStores, useOrganizationStore, useSessionStore } from "@/store";
import RequestHandler from "./request-handler";

const Auth = {
  async isLoggedIn() {
    if (useSessionStore.getState().session) {
      const res = await RequestHandler.Get("/api/v1/session")
        .then(res => {
          if (!res.ok) {
            useSessionStore.setState({ session: null });
            return false;
          }
          return true;
        });
      return res;
    }
    return false;
  },

  login({ email, password }) {
    return new Promise((resolve, reject) => {
      const body = { email, password };
      RequestHandler.Post("/api/v1/session", { body })
        .then(async (res) => {
          if (res.ok) {
            const { session } = await res.json();
            useSessionStore.setState({ session });
            return resolve({ session });
          } else {
            const status = {
              code: res.status,
              text: res.statusText
            }
            switch (res.status) {
              case 400:
              case 401:
              case 403: return reject({ message: "Invalid email or password", status });
              default: return reject({ message: "Something went wrong", status });
            }
          }
        })
        .catch(reject);
    });
  },

  logout() {
    return new Promise((resolve, reject) => {
      RequestHandler.Delete("/api/v1/session")
        .then((res) => {
          if (res.ok) {
            // useSessionStore.setState({ session: null });
            resetStores();
            return resolve({ success: true });
          } else {
            if (res.status === 401) {
              resetStores();
            }
            const status = {
              code: res.status,
              text: res.statusText
            }
            return reject({ message: "Something went wrong", status });
          }
        })
        .catch(reject);
    });
  },

  registerUser(body) {
    return new Promise((resolve, reject) => {
      RequestHandler.Post("/api/v1/user", { body })
        .then(async (res) => {
          if (res.ok) {
            return resolve({ success: true });
          } else {
            const status = {
              code: res.status,
              text: res.statusText
            }
            switch (res.status) {
              case 400:
              case 401:
              case 403: return reject({ message: "Invalid input", status });
              default: return reject({ message: "Something went wrong", status });
            }
          }
        })
        .catch(reject);
    })
  },

  registerOrganization(body) {
    return new Promise((resolve, reject) => {
      RequestHandler.Post("/api/v1/organization", { body })
        .then(async (res) => {
          console.log(res);
          if (res.ok) {
            return resolve({ success: true });
          } else {
            const status = {
              code: res.status,
              text: res.statusText
            }
            switch (res.status) {
              case 400:
              case 401:
              case 403: return reject({ message: "Invalid input", status });
              default: return reject({ message: "Something went wrong", status });
            }
          }
        })
        .catch(reject);
    });
  },



};

export default Auth;
