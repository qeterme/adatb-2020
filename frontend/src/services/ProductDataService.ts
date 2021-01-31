import http from "../http-common";
import authHeader from './auth-header';

class ProductDataService {
  getAll() {
    return http.get("/products", { headers: authHeader() });
  }

  get(id: string) {
    return http.get(`/products/${id}`, { headers: authHeader() });
  }

  create(data: any) {
    return http.post("/products", data, { headers: authHeader() });
  }

  update(id: string, data: any) {
    return http.put(`/products/${id}`, data, { headers: authHeader() });
  }

  delete(id: string) {
    return http.delete(`/products/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/products`, { headers: authHeader() });
  }

  findByName(name: string) {
    return http.get(`/products?name=${name}`, { headers: authHeader() });
  }
}

export default new ProductDataService();