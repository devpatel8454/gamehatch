let refreshPromise = null;

export const handleTokenRefresh = async (
  token,
  refreshToken,
  getRefreshTokenFn
) => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const result = await getRefreshTokenFn(token, refreshToken);
        if (result?.accessToken) {
          localStorage.setItem("token", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
          return result.accessToken;
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("buildingId");
          return null;
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("buildingId");
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};
