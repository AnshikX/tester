import { axiosInstance, duplicateInstance } from "../interceptors";

export const authInterceptorBearerAuthLogin = (request) => {
  const token = "";
  if (token) {
    ("");
  }
  return request;
};

export const moduleInstance = duplicateInstance(axiosInstance);
moduleInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status >= 400 && status < 500) {
        if (status === 401) {
          console.log("Unauthorized! Please log in again.");
          // Redirect to login page, or show a custom message
        } else {
          return Promise.reject(error.response);
        }
      }
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  },
);
