import { apiClient } from "."

export const getMe = () => {
    return apiClient.get('/api/v1/users/me')
}