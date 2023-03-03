import { API_URL } from "../../config/api";

import {
  destroyToken,
  getRefreshToken,
  saveRefreshToken,
  getToken,
  saveToken,
  saveName,
  getName,
} from "./token";

import axios from "axios";

const AuthService = {
  async login(user) {
    const headers = {
      Accept: `application/json`,
    };
    try {
      const data = {
        email: user.email,
        password: user.password,
      };
      const response = await axios.post(API_URL + "auth/login", data, { headers: headers });
      if (response.data.access) {
        saveToken(response.data.access);
        saveName(response.data.name);
        saveRefreshToken(response.data.refresh);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  },

  async me() {
    if (!getToken()) throw new Error("No token found");
    return getName();
  },

  async checkAuth() {
    if (!getToken()) throw new Error("No token found");
    const headers = {
      Accept: `application/json`,
      Authorization: `Bearer ${getToken()}`,
    };
    try {
      const response = await axios.get(API_URL + "auth/check", { headers: headers });
      return response.data;
    } catch (error) {
      throw new Error(error.response);
    }
  },

  async register(user) {
    const headers = {
      Accept: `application/json`,
    };
    try {
      const data = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
      const response = await axios.post(API_URL + "auth/register", data, { headers: headers });
      return response.data;
    } catch (error) {
      if (error.response.data && error.response.data.password) {
        throw new Error(error.response.data.password[0]);
      } else if (error.response.data && error.response.data.email) {
        throw new Error(error.response.data.email[0]);
      } else {
        throw new Error("Register failed");
      }
    }
  },

  async logout() {
    destroyToken();
  },
};

export default AuthService;
