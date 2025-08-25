import axios from "axios";

export async function getPagedInterparkAccounts(page) {
  const response = await axios.get(`/api/interpark-account?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function addInterparkAccount(account) {
  const response = await axios.post('/api/interpark-account', account);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateInterparkAccount(account) {
  const response = await axios.put('/api/interpark-account', account);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Update failed');
  }
  return data;
}

export async function deleteInterparkAccount(id) {
  const response = await axios.delete(`/api/interpark-account/${id}`);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Delete failed');
  }
  return data;
}
