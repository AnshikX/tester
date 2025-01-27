import axios from "axios";
import { duplicateInstance } from "../interceptors";
import { moduleInstance } from "./interceptors";

export const bearerAuthLogin = async () => {
  const localInstance = duplicateInstance(moduleInstance);

  let url = `http://localhost:3000`;

  const api = {
    method: "post",
    url: url,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};
