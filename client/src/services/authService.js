import api from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },
  async logout() {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },
  async getMe() {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },
};
