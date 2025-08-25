import axios from "axios";

export async function getPagedInterparkSeatRotatePools(page) {
  const response = await axios.get(`/api/interpark-seat-rotate-pool?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function addInterparkSeatRotatePool(pool) {
  const response = await axios.post('/api/interpark-seat-rotate-pool', pool);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Add failed');
  }
  return data;
}

export async function updateInterparkSeatRotatePool(pool) {
  const response = await axios.put('/api/interpark-seat-rotate-pool', pool);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Update failed');
  }
  return data;
}

export async function getAllInterparkSeatRotatePools() {
  const response = await axios.get(`/api/interpark-seat-rotate-pool/all`);
  return response.data;
}
