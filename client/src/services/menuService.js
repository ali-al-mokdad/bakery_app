import api from './api';

export const menuService = {
  async getAll({ category, search, all = false } = {}) {
    const params = {};
    if (category && category !== 'all') params.category = category;
    if (search) params.search = search;
    if (all) params.all = true;
    const { data } = await api.get('/api/menu', { params });
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/api/menu/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/api/menu', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/api/menu/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/menu/${id}`);
    return data;
  },
  async reorder(order) {
    const { data } = await api.put('/api/menu/reorder', { order });
    return data;
  },
};
