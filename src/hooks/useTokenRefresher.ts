
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useAuthStore } from "../store";

export const useTokenRefresher = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const refreshAccessToken = async () => {
      const refreshToken = Cookies.get("refreshToken");

      try {
        const response = await fetch(
          "http://localhost:4000/api/authentication/refresh-token",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Unable to refresh token");

        const data = await response.json();

        setAccessToken(data.tokens.accessToken);
        Cookies.set("refreshToken", data.tokens.refreshtoken, {
          expires: 30,
          secure: true,
          sameSite: "Strict",
        });
      } catch (error) {
        console.warn("Error refreshing token:", error);
        sessionStorage.clear();
        Cookies.remove("refreshToken");

      }
    };

    const interval = setInterval(refreshAccessToken, 14 * 60 * 1000);
    refreshAccessToken();

    return () => clearInterval(interval);
  }, [setAccessToken, navigate]);
};
