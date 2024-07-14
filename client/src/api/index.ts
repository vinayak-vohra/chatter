import axios, { AxiosResponse } from "axios";
import { auth as firebase } from "../config/firebase";
import { ApiResponse } from "../types/Api";

type ApiCallback = () => Promise<AxiosResponse<ApiResponse, ApiResponse>>;

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
});

// add access token before each request
api.interceptors.request.use(async function (config) {
  config.headers.Authorization = `Bearer ${await firebase.currentUser?.getIdToken()}`;
  return config;
});

// execute the api call provided and resolve/reject as ApiResponse
async function handler(apiCall: ApiCallback) {
  return apiCall()
    .then((response) => Promise.resolve(response.data))
    .catch((error) =>
      Promise.reject(
        error.response
          ? error.response.data
          : ({
              status: 408,
              data: null,
              success: false,
              message: `net/${error.message.toLowerCase().replace(" ", "-")}`,
              errors: [],
            } as ApiResponse)
      )
    );
}
