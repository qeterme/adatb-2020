import http from "../http-common";
import authHeader from './auth-header';

class RoleDataService {
  getAll() {
    return http.get("/roles", { headers: authHeader() });
  }
}

export default new RoleDataService();