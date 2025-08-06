import axios from 'axios';

export async function login(username, password) {
  const response = await axios.post('/api/auth/login', {
    username,
    password,
  });
  const data = response.data;
  if (data.code === 'USERNAME_OR_PASSWORD_ERROR') {
    throw new Error('Invalid username or password');
  }
  return data;
}

export async function currentUser() {
  const response = await axios.get('/api/auth/current-user');
  return response.data;
}
