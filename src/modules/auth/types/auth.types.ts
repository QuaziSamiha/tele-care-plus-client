export type TUserRole = "ADMIN" | "CUSTOMER" | null;
export type TAuthProvider = "GOOGLE" | "FACEBOOK" | "APPLE" | null;

export interface IDecodedToken {
  sub: number;     //* USER ID — THE JWT SUBJECT CLAIM
  email: string;   //* USER'S EMAIL ADDRESS
  role: TUserRole; //* ROLE USED FOR RBAC (ADMIN | CUSTOMER)
  name?: string;   //* FULL NAME FROM PROFILE — OPTIONAL
  iat?: number;    //* ISSUED AT — JWT STANDARD CLAIM
  exp: number;     //* EXPIRATION TIMESTAMP — JWT STANDARD CLAIM
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ISocialLoginPayload {
  email: string;
  firstName: string;
  lastName?: string;
  providerId: string;
  provider: string;
  image?: string;
}

//* TOKENS RETURNED BY LOGIN AND SOCIAL-LOGIN ENDPOINTS
export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

//* REFRESH ENDPOINT RETURNS A FLAT SHAPE — NOT WRAPPED IN IGenericResponse
export interface IRefreshTokenResponse {
  accessToken: string;
}
