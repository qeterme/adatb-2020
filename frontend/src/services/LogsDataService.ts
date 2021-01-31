import http from "../http-common";
import authHeader from './auth-header';

class LogsDataService {
  getAll() {
    return http.get("/logs", { headers: authHeader() });
  }
}

export default new LogsDataService();