import http from "../http-common";
import authHeader from './auth-header';

class ProjectInventoryDataService {
  getAll(projectId: string) {
    return http.get(`/projects/${projectId}/inventory`, { headers: authHeader() });
  }

  get(projectId: string, id: string) {
    return http.get(`/projects/${projectId}/inventory/${id}`, { headers: authHeader() });
  }

  create(projectId: string, data: any) {
    return http.post(`/projects/${projectId}/inventory`, data, { headers: authHeader() });
  }

  update(projectId: string, id: string, data: any) {
    return http.put(`/projects/${projectId}/inventory/${id}`, data, { headers: authHeader() });
  }

  delete(projectId: string, id: string) {
    return http.delete(`/projects/${projectId}/inventory/${id}`, { headers: authHeader() });
  }
}

export default new ProjectInventoryDataService();