import axios from 'axios';

export async function getPageTasks(page) {
  const response = await axios.get(`/api/task?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function addTask(task) {
  const response = await axios.post('/api/task', task);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateTask(task) {
  const response = await axios.put('/api/task', task);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Update failed');
  }
  return data;
}

export async function deleteTask(id) {
  const response = await axios.delete(`/api/task/${id}`);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Delete failed');
  }
  return data;
}

export async function getTask(id) {
  const response = await axios.get(`/api/task/${id}`);
  return response.data;
}

