import axios from "axios";
import { duplicateInstance } from "../interceptors";
import { moduleInstance } from "./interceptors";

export const createUserJSON = async (User) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...User },
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const createUserXML = async () => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/xml" },
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const createUserURLENCODED = async (User) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user`;

  const formBody = Object.entries(User)
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

  let resp = await localInstance.request(api);

  return resp.data;
};

export const createUsersWithListInput = async (userCreateWithListPost) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/createWithList`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...userCreateWithListPost },
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const loginUser = async (username, password) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/login`;

  const queryParams = { username: username, password: password };
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

  let resp = await localInstance.request(api);

  return resp.data;
};

export const logoutUser = async () => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/logout`;

  const api = {
    method: "get",
    url: url,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const getUserByName = async (username) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/${username}`;

  const api = {
    method: "get",
    url: url,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const updateUserJSON = async (User, username) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/${username}`;

  const api = {
    method: "put",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...User },
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const updateUserXML = async (username) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/${username}`;

  const api = {
    method: "put",
    url: url,
    headers: { "content-type": "application/xml" },
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const updateUserURLENCODED = async (User, username) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/${username}`;

  const formBody = Object.entries(User)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  const api = {
    method: "put",
    url: url,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    data: formBody,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const deleteUser = async (username) => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `user/${username}`;

  const api = {
    method: "delete",
    url: url,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};
