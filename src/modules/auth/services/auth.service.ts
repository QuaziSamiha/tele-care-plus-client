import { env } from "@/config/env.config";
import { REFRESH_TOKEN_KEY } from "@/modules/auth/constants/auth.constants";
import { cookieHelper } from "@/lib/utils/cookies.utils";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import axios from "axios";
import type { IGenericResponse } from "@/types/response.type";
import type {
  ILoginCredentials,
  ISocialLoginPayload,
  IAuthTokens,
  IRefreshTokenResponse,
} from "../types/auth.types";
import { accessTokenDelete, refreshDelete } from "@/modules/auth/actions/auth.actions";
import { AUTH_API } from "@/constants/api";

export const authService = {
  //* API METHODS

  login: async (credentials: ILoginCredentials): Promise<IGenericResponse<IAuthTokens>> => {
    const response = await axiosInstance.post(AUTH_API.paths.LOGIN, credentials);
    return response.data;
  },

  socialLogin: async (data: ISocialLoginPayload): Promise<IGenericResponse<IAuthTokens>> => {
    const response = await axiosInstance.post(AUTH_API.paths.SOCIAL, data);
    return response.data;
  },

  //* RAW AXIOS BYPASSES THE INTERCEPTOR TO PREVENT AN INFINITE RETRY LOOP ON TOKEN EXPIRY
  getNewAccessToken: async (): Promise<{ data: IRefreshTokenResponse }> => {
    const refreshToken = cookieHelper.get(REFRESH_TOKEN_KEY);
    return axios.post<IRefreshTokenResponse>(
      `${env.NEXT_PUBLIC_API_BASE_URL}${AUTH_API.paths.REFRESH}`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );
  },

  //* SERVER ACTIONS ARE REQUIRED BECAUSE THE REFRESH TOKEN IS HTTP-ONLY — BROWSER JS CANNOT DELETE IT DIRECTLY
  //* CALLER IS RESPONSIBLE FOR NAVIGATION — THIS SERVICE MUST NOT TOUCH WINDOW OR THE ROUTER
  logout: async (onLogout?: () => void): Promise<void> => {
    await accessTokenDelete();
    await refreshDelete();
    onLogout?.();
  },
};
