const API_URL = 'http://localhost:5000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
     'Content-Type': 'application/json',
     ...(options.headers as Record<string, string>),
    };

    if (token){
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok){
        const error = await response.json();
        throw error;
    }

    return response.json();
}

export const authAPI = {
   login: (email: string, password: string) =>
    fetchWithAuth('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),


signup: (email: string, password: string) =>
    fetchWithAuth('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
