import axios from "axios";
import { duplicateInstance } from "../interceptors";
import { moduleInstance } from "./interceptors";
import {
  authInterceptorPetstoreAuthLogin,
  authInterceptorApiKeyLogin,
} from "./interceptors";

export const addPetJSON = async (Pet) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...Pet },
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const addPetXML = async () => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/xml" },
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const addPetURLENCODED = async (Pet) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet`;

  const formBody = Object.entries(Pet)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  const api = {
    method: "post",
    url: url,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    data: formBody,
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const updatePet = async (petId) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet`;

  const queryParams = { petId: petId };
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== null && value !== "" && value !== undefined,
    ),
  );
  const queryString = new URLSearchParams(filteredParams).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  const api = {
    method: "put",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const findPetsByStatus = async (petId) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet/findByStatus`;

  const queryParams = { petId: petId };
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== null && value !== "" && value !== undefined,
    ),
  );
  const queryString = new URLSearchParams(filteredParams).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  const api = {
    method: "get",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const findPetsByTags = async (tags) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet/findByTags`;

  const queryParams = { tags: tags };
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== null && value !== "" && value !== undefined,
    ),
  );
  const queryString = new URLSearchParams(filteredParams).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  const api = {
    method: "get",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const getPetById = async (petId) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet/${petId}`;

  const api = {
    method: "get",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorApiKeyLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const updatePetWithForm = async (petId, name, status) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet/${petId}`;

  const queryParams = { name: name, status: status };
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== null && value !== "" && value !== undefined,
    ),
  );
  const queryString = new URLSearchParams(filteredParams).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  const api = {
    method: "post",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const deletePet = async (petId) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet/${petId}`;

  const api = {
    method: "delete",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const uploadFile = async (petId, additionalMetadata) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `pet/${petId}/uploadImage`;

  const queryParams = { additionalMetadata: additionalMetadata };
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== null && value !== "" && value !== undefined,
    ),
  );
  const queryString = new URLSearchParams(filteredParams).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  const api = {
    method: "post",
    url: url,
    headers: {},
  };

  localInstance.interceptors.request.use(authInterceptorPetstoreAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};
