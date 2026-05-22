import { resetStores, useOrganizationStore, useSessionStore } from "@/store";
import RequestHandler from "./request-handler";

const Auth = {
  async isLoggedIn() {
    // if (!useSessionStore.getState().session) {
      const res = await RequestHandler.Get("/query/v1/session")
        .then(async (res) => {
          if (res.ok) {
            const { sessions: [session] } = await res.json();
            if(session) {
              const sessionState = useSessionStore.getState().session;
              if(!sessionState) {
                useSessionStore.setState((p) =>( {...p, session }));
              }
              return true;
            }
          }
          resetStores();
          return false;
        });
      return res;
  },

  async checkSession() {
    // if (!useSessionStore.getState().session) {
      const res = await RequestHandler.Get("/query/v1/session")
        .then(async (res) => {
          if (res.ok) {
            const { sessions: [session]} = await res.json();
            if(!session) {
              return false;
            }
            useSessionStore.setState((p) =>( {...p, session }));
            return true;
          }
          return false;
        });
      return res;
    // }
    // return true;
  },

  login({ email, password }) {
    return new Promise((resolve, reject) => {
      const body = { email, password };
      RequestHandler.Post("/query/v1/session", { body })
        .then(async (res) => {
          if (res.ok) {
            const { sessions: [session] } = await res.json();
            useSessionStore.setState((p) =>( {...p, session }));
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
      RequestHandler.Delete("/query/v1/session")
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
      RequestHandler.Post("/query/v1/user", { body })
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
      RequestHandler.Post("/query/v1/organization", { body })
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
