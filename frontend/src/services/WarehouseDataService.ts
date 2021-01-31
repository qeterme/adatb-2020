import http from "../http-common";
import authHeader from './auth-header';

class WarehouseDataService {
  getAll() {
    return http.get("/warehouses", { headers: authHeader() });
  }

  get(id: string) {
    return http.get(`/warehouses/${id}`, { headers: authHeader() });
  }

  create(data: any) {
    return http.post("/warehouses", data, { headers: authHeader() });
  }

  update(id: string, data: any) {
    return http.put(`/warehouses/${id}`, data, { headers: authHeader() });
  }

  delete(id: string) {
    return http.delete(`/warehouses/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/warehouses`, { headers: authHeader() });
  }

  findByName(name: string) {
    return http.get(`/warehouses?name=${name}`, { headers: authHeader() });
  }
}

export default new WarehouseDataService();