import { API_URL } from "../config/api";

import { destroyToken, getToken } from "./auth/token";

import axios from "axios";

class API {
  constructor() {
    axios.defaults.baseURL = API_URL;
  }

  async get(slug) {
    try {
      const response = await axios.get(`${slug}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response.status == 401) {
        destroyToken();
      }
      throw error.response;
    }
  }

  async post(slug, params) {
    try {
      const response = await axios.post(`${slug}`, params, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response.status == 401) {
        destroyToken();
      }

      throw error.response;
    }
  }

  async update(slug, params) {
    try {
      const response = await axios.put(`${slug}`, params, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response.status == 401) {
        destroyToken();
      }

      throw error.response;
    }
  }

  async delete(slug) {
    try {
      const response = await axios.delete(`${slug}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response.status == 401) {
        destroyToken();
      }
      throw error.response;
    }
  }

  async download(slug) {
    try {
      const response = await axios.get(`${slug}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response.status == 401) {
        destroyToken();
      }
      throw error.response;
    }
  }
}

export default new API();
