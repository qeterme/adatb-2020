import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + 'signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username: string, fullname: string, email: string, password: string) {
    return axios.post(API_URL + 'signup', {
      username,
      fullname,
      email,
      password
    }, { headers: authHeader() });
  }
}

export default new AuthService();