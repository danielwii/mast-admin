import axios from 'axios';

const instance = axios.create({
  baseURL: '/rest/',
  timeout: 10000,
});

export const authHeader = token => ({ headers: { Authorization: `Bearer ${token}` } });

export const modelsService = {
  // save({ token }, { name }) {
  //   return instance.post('/content/models', { name }, authHeader(token));
  // },
  // refreshModels({ token }, pageable = {}) {
  //   return instance.get('/content/models', { params: pageable, ...authHeader(token) });
  // },
  fetch({ token }, modelName, { id, profile }) {
    return instance.get(`${modelName}/${id}`, { params: { profile }, ...authHeader(token) });
  },
  loadModels({ token }, { name }, { pagination, filters, sorter }) {
    return instance.get(name, { params: pagination, ...authHeader(token) });
  },
  loadSchema({ token }, { name }) {
    return instance.options(name, authHeader(token));
  },
  insert({ token }, modelName, { body }) {
    return instance.post(modelName, body, authHeader(token));
  },
  update({ token }, modelName, { id, body }) {
    return instance.put(`${modelName}/${id}`, body, authHeader(token));
  },
};
