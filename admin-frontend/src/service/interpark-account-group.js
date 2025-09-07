import axios from "axios";

export async function getPagedInterparkAccountGroups(page) {
  const response = await axios.get(`/api/interpark-account-group?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function addInterparkAccountGroup(account) {
  const response = await axios.post('/api/interpark-account-group', account);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateInterparkAccountGroup(account) {
  const response = await axios.put('/api/interpark-account-group', account);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Update failed');
  }
  return data;
}

export async function deleteInterparkAccountGroup(id) {
  const response = await axios.delete(`/api/interpark-account-group/${id}`);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Delete failed');
  }
  return data;
}

export async function getAllInterparkAccountGroup() {
  const response = await axios.get(`/api/interpark-account-group/all`);
  return response.data;
}
