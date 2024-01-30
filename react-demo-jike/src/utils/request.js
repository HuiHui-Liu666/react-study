import axios from "axios";
import { getToken, removeToken } from "./token";
import router from "../router";
const request = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  timeout: 5000,
});

// 拦截器：
request.interceptors.request.use(
  (config) => {
    // 注入token
    const token = getToken();
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { status } = error.response;

    if (status === 401) {
      // token失效了
      removeToken();
      router.navigate("/login");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export { request };
