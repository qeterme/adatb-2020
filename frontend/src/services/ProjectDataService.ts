import http from "../http-common";
import authHeader from './auth-header';

class ProjectDataService {
  getAll() {
    return http.get("/projects", { headers: authHeader() });
  }

  get(id: string) {
    return http.get(`/projects/${id}`, { headers: authHeader() });
  }

  getForEdit(id: string) {
    return http.get(`/projects/edit/${id}`, { headers: authHeader() });
  }

  create(data: any) {
    return http.post("/projects", data, { headers: authHeader() });
  }

  update(id: string, data: any) {
    return http.put(`/projects/${id}`, data, { headers: authHeader() });
  }

  delete(id: string) {
    return http.delete(`/projects/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/projects`, { headers: authHeader() });
  }

  findByName(name: string) {
    return http.get(`/projects?name=${name}`, { headers: authHeader() });
  }

  findByStatus(status: string) {
    return http.get(`/projects?status=${status}`, { headers: authHeader() });
  }
}

export default new ProjectDataService();