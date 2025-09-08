import axios from "axios";

export async function getPagedWebHooks(page) {
  const response = await axios.get(`/api/web-hook?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function addWebHook(webHook) {
  const response = await axios.post('/api/web-hook', webHook);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateWebHook(webHook) {
  const response = await axios.put('/api/web-hook', webHook);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Update failed');
  }
  return data;
}

export async function deleteWebHook(id) {
  const response = await axios.delete(`/api/web-hook/${id}`);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Delete failed');
  }
  return data;
}
