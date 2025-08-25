import axios from "axios";

export async function addProxy(proxy) {
  const response = await axios.post('/api/proxy', proxy);
  const data = response.data;
  if (data.code !== 'SUCCESS') {
    throw new Error('Invalid username or password');
  }
  return data;
}

export async function getPagedProxies(page) {
  const response = await axios.get(`/api/proxy?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function getAllProxies() {
  const response = await axios.get(`/api/proxy/all`);
  return response.data;
}
