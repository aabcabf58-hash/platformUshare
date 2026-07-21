const AUTH_TOKEN_KEY = "zouzou_auth_token";
const AUTH_USER_KEY = "zouzou_auth_user";

/*
  إذا عندك بالسيرفر:
  app.use("/auth", authRouter)
  خليه مثل ما هو.

  إذا عندك:
  app.use("/api/auth", authRouter)
  غيّر AUTH_BASE_PATH إلى "/api/auth"
*/
const AUTH_BASE_PATH = "/auth";

function getApiBaseUrl() {
  return (
    window.APP_CONFIG?.API_BASE_URL ||
    "http://localhost:3000"
  );
}

function getAuthUrl(path) {
  return `${getApiBaseUrl()}${AUTH_BASE_PATH}${path}`;
}

function saveAuth(token, user) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(user || {})
  );
}

function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    return null;
  }
}

function logout() {
  clearAuth();
  window.location.href = "./login.html";
}

function authHeaders(extraHeaders = {}) {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
}

function parseJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = atob(base64);

    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwtPayload(token);

  if (!payload || !payload.exp) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  return payload.exp <= nowInSeconds;
}

function normalizeRole(role) {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

function requireLogin() {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearAuth();
    window.location.href = "./login.html";
    return false;
  }

  return true;
}

function requireRole(allowedRoles) {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearAuth();
    window.location.href = "./login.html";
    return false;
  }

  let user = getUser();

  if (!user || !user.role) {
    user = parseJwtPayload(token);
  }

  const userRole = normalizeRole(user?.role);
  const allowed = allowedRoles.map(normalizeRole);

  if (!user || !allowed.includes(userRole)) {
    alert("You are not allowed to open this page");
    clearAuth();
    window.location.href = "./login.html";
    return false;
  }

  return true;
}

function extractTokenAndUser(data) {
  const token =
    data.token ||
    data.data?.token;

  if (!token) {
    throw new Error("Server did not return token");
  }

  const user =
    data.user ||
    data.data?.user ||
    parseJwtPayload(token) ||
    {};

  saveAuth(token, user);

  return {
    token,
    user,
    data,
  };
}

// Login بالـpassword
async function loginWithPassword(numberphone, password) {
  const response = await fetch(
    getAuthUrl("/login/password"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numberphone,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(
      data.message ||
      data.error ||
      "Login failed"
    );
  }

  return extractTokenAndUser(data);
}

// طلب OTP
async function requestLoginOtp(numberphone) {
  const response = await fetch(
    getAuthUrl("/login/request-otp"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numberphone,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(
      data.message ||
      data.error ||
      "Failed to send OTP"
    );
  }

  return data;
}

// تأكيد OTP وتخزين token
async function verifyLoginOtp(numberphone, otp) {
  const response = await fetch(
    getAuthUrl("/login/verify-otp"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numberphone,
        otp,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(
      data.message ||
      data.error ||
      "OTP verification failed"
    );
  }

  return extractTokenAndUser(data);
}

function isAdminUser(user) {
  const role = normalizeRole(user?.role);

  return (
    role === "admin" ||
    role === "super_admin"
  );
}

function isSuperAdminUser(user = getUser()) {
  return normalizeRole(user?.role) === "super_admin";
}