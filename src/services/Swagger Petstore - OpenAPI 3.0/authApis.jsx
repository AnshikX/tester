import axios from "axios";
import { duplicateInstance } from "../interceptors";
import { moduleInstance } from "./interceptors";

export const petstoreAuthLogin = async () => {
  return new Promise((resolve, reject) => {
    const scope = encodeURIComponent("write:pets read:pets");
    const authUrl = `https://petstore3.swagger.io/oauth/authorize?client_id=$&redirect_uri=&response_type=token&scope=${scope}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      "GoogleAuth",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (!popup) {
      return reject(
        new Error("Popup blocked. Please allow popups and try again."),
      );
    }

    const polling = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(polling);
          reject(new Error("Popup closed by user."));
          return;
        }

        if (popup.location.href.startsWith("")) {
          const hashParams = new URLSearchParams(
            popup.location.hash.substring(1),
          ); // Remove `#`
          const token = hashParams.get("access_token");

          clearInterval(polling);
          popup.close();

          if (token) {
            resolve(token);
          } else {
            reject(new Error("OAuth Login failed: No token received."));
          }
        }
      } catch (error) {
        // Ignoring cross-origin access errors while polling
      }
    }, 500);
  });
};

export const apiKeyLogin = async () => {
  const localInstance = duplicateInstance(moduleInstance);
  let url = `https://petstore3.swagger.io/api/v3`;

  const api = {
    method: "post",
    url: url,
  };

  let resp = await localInstance.request(api);

  return resp.data;
};
