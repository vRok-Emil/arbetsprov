//hämtar API url från miljövariabler eller använder en flackback localhost url
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';



async function fetchWithAuth<T>(url: string, options: RequestInit = {}) {
    //hämtar token från local storage 
    const token = localStorage.getItem("token");
    //skapar headers objekt med content type och eventuell authorization header
    const headers: Record<string, string> = {
     'Content-Type': 'application/json',
     ...(options.headers as Record<string, string>),
    };
    //lägger till auth header om token finns
    if (token){
        headers['Authorization'] = `Bearer ${token}`;
    }
    //gör en fetch med komplett url och options
    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });
    //katar tillbaka error om response inte är ok
    if (!response.ok){
        const error = await response.json();
        throw error;
    }

    return response.json();
}
//login funktion som skickar email och lösenord till backend
export const authAPI = {
   login: (email: string, password: string) =>
    fetchWithAuth('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

//samma sak för signup
signup: (email: string, password: string) =>
    fetchWithAuth('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
