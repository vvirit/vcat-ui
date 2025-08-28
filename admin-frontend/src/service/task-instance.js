import axios from 'axios';

export async function getPagedTaskInstances(page) {
  const response = await axios.get(`/api/task-instance?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function getTaskInstanceById(id) {
  const response = await axios.get(`/api/task-instance/${id}`);
  return response.data;
}
