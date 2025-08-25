import axios from 'axios';

export async function getQueueRouters(page) {
  const response = await axios.get(`/api/queue-router?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function addQueueRouter(pool) {
  const response = await axios.post('/api/queue-router', pool);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateQueueRouter(pool) {
  const response = await axios.put('/api/queue-router', pool);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Update failed');
  }
  return data;
}

export async function deleteQueueRouter(id) {
  const response = await axios.delete(`/api/queue-router/${id}`);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Delete failed');
  }
  return data;
}

export async function getQueueRoutersByType(type) {
  const response = await axios.get(`/api/queue-router/list?type=${type}`);
  return response.data;
}
