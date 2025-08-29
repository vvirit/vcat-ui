import axios from 'axios';

export async function getPagedSystemSettings(page) {
  const response = await axios.get(`/api/system-setting?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function updateSystemSetting(id, value) {
  const response = await axios.put(`/api/system-setting/set-setting-value`, {
    id,
    value,
  });
  return response.data;
}
