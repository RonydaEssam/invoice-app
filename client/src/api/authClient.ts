import { API_URL } from "./config";

const TOKEN_KEY = "access_token";

function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function isAuthenticated(): boolean {
    return !!getToken();
}

async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    setToken(data.session.access_token);
    return data.user;
}

async function signup(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Signup failed");
    }

    // Supabase may require email confirmation before a session exists.
    if (data.session) {
        setToken(data.session.access_token);
    }
    return data.user;
}

async function logout() {
    const token = getToken();
    clearToken();

    if (token) {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {
            // logout is best-effort client-side; token is already cleared
        });
    }
}

export { login, signup, logout, getToken, isAuthenticated };