import api from './api';

export const galleryService = {
  async getAll({ all = false } = {}) {
    const { data } = await api.get('/api/gallery', { params: all ? { all: true } : {} });
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/api/gallery', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/api/gallery/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/gallery/${id}`);
    return data;
  },
  async reorder(order) {
    const { data } = await api.put('/api/gallery/reorder', { order });
    return data;
  },
};
