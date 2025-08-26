import axios from 'axios';

export async function getNodes() {
  const response = await axios.get(`/api/node/list`);
  return response.data;
}
