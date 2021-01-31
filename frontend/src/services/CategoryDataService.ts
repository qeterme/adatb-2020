import http from "../http-common";
import authHeader from './auth-header';

class CategoryDataService {
  getAll() {
    return http.get("/categories", { headers: authHeader() });
  }

  get(id: string) {
    return http.get(`/categories/${id}`, { headers: authHeader() });
  }

  create(data: any) {
    return http.post("/categories", data, { headers: authHeader() });
  }

  update(id: string, data: any) {
    return http.put(`/categories/${id}`, data, { headers: authHeader() });
  }

  delete(id: string) {
    return http.delete(`/categories/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/categories`, { headers: authHeader() });
  }

  findByName(name: string) {
    return http.get(`/categories?name=${name}`, { headers: authHeader() });
  }
}

export default new CategoryDataService();