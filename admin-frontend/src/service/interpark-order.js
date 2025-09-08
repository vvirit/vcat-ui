import axios from 'axios';

export async function getPagedInterparkOrders(page) {
  const response = await axios.get(`/api/interpark-order?page=${page.page}&pageSize=${page.pageSize}`);
  return response.data;
}

export async function getInterparkOrder(id) {
  const response = await axios.get(`/api/interpark-order/${id}`);
  return response.data;
}

export async function getPayInfo(id) {
  const response = await axios.get(`/api/interpark-order/${id}/pay-info`);
  return response.data;
}

export async function finishPay(id) {
  const response = await axios.post(`/api/interpark-order/${id}/finish-pay`);
  return response.data;
}

