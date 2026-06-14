import { jwtDecode } from "jwt-decode";

//* DECODES THE JWT PAYLOAD ONLY — SIGNATURE VERIFICATION IS THE BACKEND'S RESPONSIBILITY
export const getDecodedToken = <T extends object>(token: string): T | null => {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
};
