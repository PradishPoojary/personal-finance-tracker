import api from './api';

export const loginUser = async (username, password) => {
    const response = await api.post('token/', { username, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
};

export const registerUser = async (username, email, password) => {
    return await api.post('register/', { username, email, password });
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};