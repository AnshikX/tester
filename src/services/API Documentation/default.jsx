import axios from "axios";
import { duplicateInstance } from "../interceptors";
import { moduleInstance } from "./interceptors";
import { authInterceptorBearerAuthLogin } from "./interceptors";

export const loginToTheApplication = async (Schema_loginPost) => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000/api/login`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...Schema_loginPost },
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const getAllItems = async () => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000/api/items`;

  const api = {
    method: "get",
    url: url,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};

export const createANewItem = async (Schema_itemsPost) => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000/api/items`;

  const api = {
    method: "post",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...Schema_itemsPost },
  };

  localInstance.interceptors.request.use(authInterceptorBearerAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const getAnItemById = async (id) => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000/api/items/${id}`;

  const api = {
    method: "get",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorBearerAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const updateAnItemById = async (id, Schema_itemsPost) => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000/api/items/${id}`;

  const api = {
    method: "put",
    url: url,
    headers: { "content-type": "application/json" },
    data: { ...Schema_itemsPost },
  };

  localInstance.interceptors.request.use(authInterceptorBearerAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};

export const deleteAnItemById = async (id) => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000/api/items/${id}`;

  const api = {
    method: "delete",
    url: url,
  };

  localInstance.interceptors.request.use(authInterceptorBearerAuthLogin);

  let resp = await localInstance.request(api);

  return resp.data;
};
