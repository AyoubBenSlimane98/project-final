import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "../store";

export const useTokenRefresher = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const controller = new AbortController();

    const refreshAccessToken = async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) return;

      try {
        const response = await fetch(
          "http://localhost:4000/api/authentication/refresh-token",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
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
        if (error instanceof Error && error.name !== "AbortError") {
          console.warn("Error refreshing token:", error);
          sessionStorage.clear();
          Cookies.remove("refreshToken");
        }
      }
    };

    const interval = setInterval(refreshAccessToken, 14 * 60 * 1000); // every 14 minutes
    refreshAccessToken(); // initial call on mount

    return () => {
      clearInterval(interval);
      controller.abort(); // cleanup fetch if needed
    };
  }, [setAccessToken]);
};
