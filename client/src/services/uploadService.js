import api from './api';

export const uploadService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/api/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // { path, filename }
  },
  async uploadMultiple(files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    const { data } = await api.post('/api/uploads/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // [{ path, filename }, ...]
  },
  async deleteImage(filename) {
    const { data } = await api.delete(`/api/uploads/${filename}`);
    return data;
  },
};
