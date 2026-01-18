import axios from 'axios';

const api = axios.create({
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

/**
 * Global API response structure (optional, depends on backend convention)
 */
export interface ApiResponse<T> {
    message?: string;
    data?: T; // If you wrap everything in 'data'
    [key: string]: any; // Allow other fields like 'customer' in the specific case
}

export const apiGet = <T>(url: string, params?: any) =>
    api.get<T>(url, { params }).then((res) => res.data);

export const apiPost = <T>(url: string, data?: any) =>
    api.post<T>(url, data).then((res) => res.data);

export const apiPut = <T>(url: string, data?: any) =>
    api.put<T>(url, data).then((res) => res.data);

export const apiPatch = <T>(url: string, data?: any) =>
    api.patch<T>(url, data).then((res) => res.data);

export const apiDel = <T>(url: string) =>
    api.delete<T>(url).then((res) => res.data);

export default api;
