import { axiosInstance, duplicateInstance } from "../interceptors";

export const authInterceptorPetstoreAuthLogin = (request) => {
  const token = "";
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
};

export const authInterceptorApiKeyLogin = (request) => {
  const token = { FETCH_TOKEN };
  if (token) {
    ("");
  }
  return request;
};

export const moduleInstance = duplicateInstance(axiosInstance);
moduleInstance.defaults.baseURL =
  import.meta.env.VITE_SWAGGER_PETSTORE___OPENAPI_3_0;
moduleInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return Promise.reject(response);
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      const { status } = error.response;
      if (status >= 400 && status < 500) {
        if (status === 401 && !originalRequest._retry) {
        } else {
          return Promise.reject(error.response);
        }
      }
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  },
);
