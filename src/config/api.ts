export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',

    // Recipe endpoints
    RECIPES: '/recipes',
    RECIPE_BY_ID: (id: string) => `/recipes/${id}`,
    SEARCH_RECIPES: '/recipes/search',
    
    // User endpoints
    USER_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',

    // Other endpoints can be added here
};