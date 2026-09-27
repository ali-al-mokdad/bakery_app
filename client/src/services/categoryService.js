import api from './api';

export const categoryService = {
  async getAll({ all = false } = {}) {
    const { data } = await api.get('/api/categories', { params: all ? { all: true } : {} });
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/categories/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/api/categories', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/api/categories/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/categories/${id}`);
    return data;
  },
  async reorder(order) {
    const { data } = await api.put('/api/categories/reorder', { order });
    return data;
  },
};
