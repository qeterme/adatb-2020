import http from "../http-common";
import authHeader from './auth-header';

class InventoryDataService {
  getAll() {
    return http.get("/inventory", { headers: authHeader() });
  }

  get(id: string) {
    return http.get(`/inventory/${id}`, { headers: authHeader() });
  }

  create(data: any) {
    return http.post("/inventory", data, { headers: authHeader() });
  }

  update(id: string, data: any) {
    return http.put(`/inventory/${id}`, data, { headers: authHeader() });
  }

  delete(id: string) {
    return http.delete(`/inventory/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/inventory`, { headers: authHeader() });
  }
}

export default new InventoryDataService();