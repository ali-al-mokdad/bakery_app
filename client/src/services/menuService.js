import api from './api';

export const menuService = {
  async getAll({ category, search, all = false, featured = false, limit } = {}) {
    const params = {};
    if (category && category !== 'all') params.category = category;
    if (search) params.search = search;
    if (all) params.all = true;
    if (featured) params.featured = true;
    if (limit) params.limit = limit;
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
