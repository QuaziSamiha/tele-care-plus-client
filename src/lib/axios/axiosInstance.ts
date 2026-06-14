import { env } from "@/config/env.config";
import axios from "axios";
import { cookieHelper } from "../utils/cookies.utils";
import { ACCESS_TOKEN_KEY } from "@/modules/auth/constants/auth.constants";
import { IGenericErrorResponse } from "@/types/response.type";
import { authService } from "@/modules/auth/services/auth.service";
import { navigateToErrorPage } from "../utils/errorRouter";

//* INITIALIZE AXIOS WITH BASE CONFIGURATION
const instance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60000, //* SET A REQUEST TIMEOUT OF 60 SECONDS
  withCredentials: true, //* ENABLE SENDING COOKIES (REFRESH TOKENS) WITH CROSS-ORIGIN REQUESTS
});

//* AUTHENTICATION REFRESH STATE MANAGEMENT
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

//* NOTIFY ALL QUEUED REQUESTS WHEN TOKEN IS RENEWED
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

//* ADD FAILED REQUESTS TO THE WAIT QUEUE
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

//* REQUEST INTERCEPTOR: ATTACH AUTHENTICATION TOKEN AUTOMATICALLY
instance.interceptors.request.use(
  (config) => {
    const accessToken = cookieHelper.get(ACCESS_TOKEN_KEY); //* RETRIEVE THE ACCESS TOKEN FROM BROWSER COOKIES
    if (
      accessToken &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/refresh")
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`; //* IF TOKEN EXISTS, ATTACH IT TO THE AUTHORIZATION HEADER AS A BEARER TOKEN
    }
    return config;
  },
  (error) => Promise.reject(error), //* HANDLE ERRORS THAT OCCUR BEFORE THE REQUEST IS SENT
);

//* RESPONSE INTERCEPTOR: STANDARDIZE SUCCESS AND ERROR DATA SHAPES -- HANDLE SUCCESS AND AUTOMATIC TOKEN REFRESH
instance.interceptors.response.use(
  (response) => response,
  //* STANDARDIZE THE ERROR OBJECT FOR CONSISTENT UI NOTIFICATIONS (E.G., TOASTS)
  async (error) => {
    //* NETWORK ERROR — error.response is undefined when the server never responded
    //* (backend down, ERR_CONNECTION_REFUSED, DNS failure, request timeout)
    //* MUST BE CHECKED BEFORE status extraction — status would be undefined and
    //* fall through to statusCode: 500, masking the real cause
    if (!error.response) {
      navigateToErrorPage(0);
      return Promise.reject<IGenericErrorResponse>({
        statusCode: 0,
        message: "Network error. Unable to connect to the server.",
        success: false,
        errorMessages: "Network error",
      });
    }

    const originalRequest = error.config;
    const status = error.response.status;
    const errorMessage = error.response.data?.message || "";

    //* HANDLE 401 UNAUTHORIZED: ATTEMPT TOKEN REFRESH
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        //* WAIT FOR THE REFRESH PROCESS ALREADY IN PROGRESS
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //* CALL BACKEND REFRESH ENDPOINT
        const response = await authService.getNewAccessToken();
        const newAccessToken = response.data.accessToken;

        //* UPDATE AXIOS DEFAULTS FOR FUTURE REQUESTS
        instance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        //* RESUME ALL QUEUED REQUESTS
        onRefreshed(newAccessToken);

        //* RETRY THE ORIGINAL FAILED REQUEST
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        //* IF REFRESH FAILS, CLEAR SESSION AND REDIRECT TO UNAUTHORIZED PAGE
        await authService.logout();
        navigateToErrorPage(401);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    //* STANDARDIZE ERROR OBJECT FOR UI FEEDBACK
    const errorResponse: IGenericErrorResponse = {
      statusCode: status || 500,
      message: errorMessage || "Something went wrong",
      success: false,
      errorMessages:
        error.response?.data?.errorMessages ||
        errorMessage ||
        "An unknown error occurred",
    };

    return Promise.reject(errorResponse);
  },
);

export { instance as axiosInstance };
