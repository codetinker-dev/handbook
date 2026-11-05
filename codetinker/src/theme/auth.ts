export type ChaseUser = {
  id: number;
  username: string;
  email: string;
  fullname?: string | null;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: ChaseUser;
};

type RefreshResponse = {
  access: string;
  refresh?: string;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function normaliseApiUrl(apiUrl: string) {
  return apiUrl.replace(/\/$/, "");
}

function saveTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(apiUrl: string) {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(
    `${normaliseApiUrl(apiUrl)}/rest-auth/token/refresh/`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({refresh: refreshToken}),
    },
  );

  if (!response.ok) {
    clearAuth();
    return null;
  }

  const data = (await response.json()) as RefreshResponse;
  saveTokens(data.access, data.refresh);
  return data.access;
}

async function authenticatedFetch(apiUrl: string, path: string) {
  let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    return null;
  }

  let response = await fetch(`${normaliseApiUrl(apiUrl)}${path}`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });

  if (response.status === 401) {
    accessToken = await refreshAccessToken(apiUrl);

    if (!accessToken) {
      return null;
    }

    response = await fetch(`${normaliseApiUrl(apiUrl)}${path}`, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
  }

  return response;
}

export async function signIn(
  apiUrl: string,
  username: string,
  password: string,
) {
  const response = await fetch(`${normaliseApiUrl(apiUrl)}/rest-auth/login/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password}),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  const data = (await response.json()) as LoginResponse;
  saveTokens(data.access_token, data.refresh_token);
  return data.user;
}

export async function getCurrentUser(apiUrl: string) {
  const response = await authenticatedFetch(apiUrl, "/rest-auth/user/");

  if (!response?.ok) {
    clearAuth();
    return null;
  }

  return (await response.json()) as ChaseUser;
}

export async function signOut(apiUrl: string) {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  try {
    if (accessToken) {
      await fetch(`${normaliseApiUrl(apiUrl)}/rest-auth/logout/`, {
        method: "POST",
        headers: {Authorization: `Bearer ${accessToken}`},
      });
    }
  } finally {
    clearAuth();
  }
}
