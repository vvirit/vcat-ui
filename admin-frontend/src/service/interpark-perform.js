import axios from "axios";

export async function addInterparkPerform(perform) {
  const response = await axios.post('/api/interpark-perform', perform);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateInterparkPerform(perform) {
  const response = await axios.put('/api/interpark-perform', perform);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Edit failed');
  }
  return data;
}

export async function getAllPerforms() {
  const response = await axios.get(`/api/interpark-perform/all`);
  return response.data;
}

export async function getPagedInterparkPerforms(page) {
  const response = await axios.get(`/api/interpark-perform?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function deleteInterparkPerform(id) {
  const response = await axios.delete(`/api/interpark-perform/${id}`);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Delete failed');
  }
  return data;
}
