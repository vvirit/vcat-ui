import axios from 'axios';

export async function getNodes() {
  const response = await axios.get(`/api/node/list`);
  return response.data;
}

export async function runTask(data) {
  const response = await axios.post('/api/node/run-task', data);
  return response.data;
}
