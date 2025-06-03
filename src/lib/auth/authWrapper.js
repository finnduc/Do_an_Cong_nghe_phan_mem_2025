import { refreshAccessToken } from "./refreshToken";
import { get_cookie } from "../cookie/action";
import { redirect } from "next/navigation";

// Utility to add auth headers to fetch options
export async function addAuthHeaders(options = {}) {
  // Get authentication data
  const { accessToken, user, refreshToken } = await get_cookie();

  if (!user?.user_id || !accessToken) {
    if (refreshToken) {
      try {
        await refreshAccessToken(refreshToken);
        // Get fresh tokens after refresh
        const refreshedAuth = await get_cookie();

        if (!refreshedAuth.accessToken || !refreshedAuth.user?.user_id) {
          throw new Error("Failed to get valid token after refresh");
        }

        // Return options with the new token
        return {
          ...options,
          headers: {
            "x-client-id": refreshedAuth.user.user_id,
            authorization: `Bearer ${refreshedAuth.accessToken}`,
            ...(options.headers || {}),
          },
        };
      } catch (error) {
        console.error("Error refreshing token:", error);
        throw new Error("Unable to refresh token");
      }
    } else {
      throw new Error("No user information or access token");
    }
  }

  // Return options with auth headers added
  return {
    ...options,
    headers: {
      "x-client-id": user.user_id,
      authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  };
}

const isServer = typeof window === 'undefined';


// Function to handle auth and response errors
export async function authFetch(endpoint, options = {},  isExpress = true) {
  let url = ''
  if (isExpress){
    const baseUrl = isServer ? process.env.EXPRESS_URL : process.env.NEXT_PUBLIC_EXPRESS_URL;
    url = `${baseUrl}${endpoint}`;
  }
  else{
    const baseUrl = isServer ? process.env.FASTAPI_URL : process.env.NEXT_PUBLIC_FASTAPI_URL;
    url = `${baseUrl}${endpoint}`;
  }
  try {
    // Add auth headers to the request
    const authOptions = await addAuthHeaders(options);
    // Make the fetch request
    const response = await fetch(url, authOptions);

    // Handle 403 errors (token expired)
    if (response.status === 403) {
      const { refreshToken } = await get_cookie();

      if (refreshToken) {
        try {
          await refreshAccessToken(refreshToken);
          // Retry with fresh tokens
          const newAuthOptions = await addAuthHeaders(options);
          const retryResponse = await fetch(url, newAuthOptions);
          const data = await retryResponse.json();
          if (!retryResponse.ok)
            throw new Error(data.message || data.detail || `Error: ${retryResponse.status}`);
          return data;
        } catch (error) {
          console.error("Error during retry:", error);
          redirect("/login"); // Redirect to login on retry failure
        }
      } else {
        redirect("/login"); // No refresh token, redirect to login
      }
    }

    // Check if response is ok
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.detail || `Error: ${response.status}`);

    return data;
  } catch (error) {
    // Redirect to login for authentication-related errors without re-throwing
    if (
      error.message === "No user information or access token" ||
      error.message === "Unable to refresh token"
    ) {
      redirect("/login");
    }
    // Re-throw other errors for upstream handling
    throw error;
  }
}