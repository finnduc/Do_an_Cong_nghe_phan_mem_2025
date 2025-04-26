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
          handleAuthError();
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
        handleAuthError();
        throw new Error("Unable to refresh token");
      }
    } else {
      handleAuthError();
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

// Handle auth errors by redirecting to login
function handleAuthError() {
  redirect("/login");
}

// Function to handle auth and response errors
export async function authFetch(url, options = {}) {
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
            throw new Error(data.message || `Error: ${retryResponse.status}`);
          return data;
        } catch (error) {
          console.error("Error during retry:", error);
          handleAuthError();
          throw new Error("Failed to refresh token during retry");
        }
      } else {
        handleAuthError();
        throw new Error("No refresh token available");
      }
    }

    // Check if response is ok
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
  } catch (error) {
    console.error("Auth fetch error:", error);
    throw error;
  }
}
