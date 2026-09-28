import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


/*
 * Attach JWT to every request.
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "access_token"
      );


    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }


    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/*
 * Handle authentication errors.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response?.status === 401
    ) {
      console.error(
        "Authentication failed:",
        error.response?.data
      );


      /*
       * Remove expired/invalid session.
       */
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "current_user"
      );
    }


    return Promise.reject(error);
  }
);


export default api;