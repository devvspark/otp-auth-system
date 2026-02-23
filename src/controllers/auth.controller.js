import { authHealthService } from "../services/auth.service.js";

export const authHealthCheck = (req, res) => {
      const result=authHealthService();
      return res.status(200).json(result);
  };