// Admin session helpers. The token key (`mio_token`) matches the axios
// interceptor in api.js, so authenticated requests work automatically.
const TOKEN = "mio_token";
const REFRESH = "mio_refresh";
const USER = "mio_user";

export function setSession({ token, refreshToken, user }) {
  try {
    if (token) localStorage.setItem(TOKEN, token);
    if (refreshToken) localStorage.setItem(REFRESH, refreshToken);
    if (user) localStorage.setItem(USER, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    [TOKEN, REFRESH, USER].forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN);
  } catch {
    return null;
  }
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER) || "null");
  } catch {
    return null;
  }
}
