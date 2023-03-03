const ID_TOKEN_KEY = "token";
const USER_NAME = "user_name";
const REFRESH_TOKEN = "refresh_token";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return window.localStorage.getItem(REFRESH_TOKEN);
};

export const getName = () => {
  return window.localStorage.getItem(USER_NAME);
};

export const saveToken = (token) => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const saveName = (data) => {
  window.localStorage.setItem(USER_NAME, data);
};

export const saveRefreshToken = (data) => {
  window.localStorage.setItem(REFRESH_TOKEN, data);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(USER_NAME);
  window.localStorage.removeItem(REFRESH_TOKEN);
};
