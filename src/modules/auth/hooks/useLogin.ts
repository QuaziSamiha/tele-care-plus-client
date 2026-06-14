import { IGenericErrorResponse } from "@/types/response.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";
import { accessTokenCreate, refreshCreate } from "@/modules/auth/actions/auth.actions";

/**
 * CUSTOM HOOK TO HANDLE THE LOGIN MUTATION FLOW
 */
export const useLogin = (onSuccess?: (token: string) => void) => {
  return useMutation({
    //* TRIGGER THE LOGIN API SERVICE
    mutationFn: authService.login,

    //* HANDLE SUCCESSFUL AUTHENTICATION
    onSuccess: async (response) => {
      try {
        const { access_token, refresh_token } = response?.data;
        //* BATCH THE STORAGE OF ACCESS AND REFRESH TOKENS IN COOKIES
        await Promise.all([
          refreshCreate(refresh_token),
          accessTokenCreate(access_token),
        ]);

        //* EXECUTE REDIRECTION OR OTHER CALLBACKS
        if (onSuccess) {
          onSuccess(access_token);
        }

        //* SHOW SUCCESS FEEDBACK TO THE USER
        toast.success(response.message || "Logged in successfully");
        // console.log("LOGIN SUCCESS DATA:", response?.data);
        // console.log("ACCESS TOKEN:", access_token);
        // console.log("REFRESH TOKEN:", refresh_token);
      } catch (error) {
        //* CATCH ERRORS IN THE POST-LOGIN COOKIE STORAGE PROCESS
        console.error("LOGIN_CALLBACK_ERROR:", error);
        toast.error("An error occurred during session initialization.");
      }
    },

    //* HANDLE API ERRORS USING THE STANDARDIZED ERROR INTERFACE
    onError: (error: IGenericErrorResponse) => {
      //* AUTOMATICALLY SHOWS THE SERVER-PROVIDED ERROR MESSAGE
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
};
