"use client";

import { useEffect, useState, useCallback } from "react";

interface DecodedToken {
  sub: string;
  exp: number;
}

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  isTokenExpired: boolean;
}

interface AuthReturn extends AuthState {
  refreshAuth: () => void;
}

export const useAuth = (): AuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    token: null,
    isTokenExpired: false,
  });

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      // Split the token into parts
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      // Decode the payload (second part)
      const payload = parts[1];

      // Add padding if needed
      const paddedPayload = payload.padEnd(
        payload.length + ((4 - (payload.length % 4)) % 4),
        "="
      );

      // Decode from base64
      const decodedPayload = atob(paddedPayload);

      // Parse JSON
      return JSON.parse(decodedPayload) as DecodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const isTokenExpired = (exp: number): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= exp;
  };

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setAuthState({
          isAuthenticated: false,
          userId: null,
          token: null,
          isTokenExpired: false,
        });
        return;
      }

      const decodedToken = decodeToken(token);

      if (!decodedToken) {
        // Invalid token
        localStorage.removeItem("access_token");
        setAuthState({
          isAuthenticated: false,
          userId: null,
          token: null,
          isTokenExpired: false,
        });
        return;
      }

      const expired = isTokenExpired(decodedToken.exp);

      if (expired) {
        // Token is expired, remove it
        localStorage.removeItem("access_token");
        setAuthState({
          isAuthenticated: false,
          userId: null,
          token: null,
          isTokenExpired: true,
        });
        return;
      }

      // Token is valid
      setAuthState({
        isAuthenticated: true,
        userId: decodedToken.sub,
        token: token,
        isTokenExpired: false,
      });
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthState({
        isAuthenticated: false,
        userId: null,
        token: null,
        isTokenExpired: false,
      });
    }
  }, []);

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when token is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkAuth]);

  return {
    ...authState,
    refreshAuth: checkAuth,
  };
};
