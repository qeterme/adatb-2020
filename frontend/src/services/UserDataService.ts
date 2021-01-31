import http from "../http-common";
import authHeader from './auth-header';

class UserDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }

  get(id: string) {
    return http.get(`/users/${id}`, { headers: authHeader() });
  }

  update(id: string, data: any) {
    return http.put(`/users/${id}`, data, { headers: authHeader() });
  }

  updateSelf(id: string, data: any) {
    return http.put(`/users/self/${id}`, data, { headers: authHeader() });
  }

  delete(id: string) {
    return http.delete(`/users/${id}`, { headers: authHeader() });
  }

  findByName(name: string) {
    return http.get(`/users?name=${name}`, { headers: authHeader() });
  }
}

export default new UserDataService();