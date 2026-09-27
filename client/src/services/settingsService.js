import api from './api';

export const settingsService = {
  async get() {
    const { data } = await api.get('/api/settings');
    return data;
  },
  async update(payload) {
    const { data } = await api.put('/api/settings', payload);
    return data;
  },
};
