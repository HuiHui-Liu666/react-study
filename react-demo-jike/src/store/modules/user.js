// 编写子模块
import { createSlice } from "@reduxjs/toolkit";
import { getProfileAPI, loginAPI } from "../../apis/user";
import { setToken as _setToken, getToken, removeToken } from "../../utils";
const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() ? getToken() : "",
    userInfo: {},
  },
  // 同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      console.log("---", action.payload);
      //   1、本地存储一份
      _setToken(action.payload);
    },
    // 获取用户信息
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.userInfo = {};
      state.token = "";
      removeToken();
    },
  },
});

// 解构出 actionCreate
const { setToken, setUserInfo, clearUserInfo } = userStore.actions;

// 创建异步修改代码：
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    // 发送请求 获取数据
    const res = await loginAPI(loginForm);

    dispatch(setToken(res.data.token));
  };
};
const fetchUserInfo = () => {
  return async (dispatch) => {
    // 发送请求 获取数据
    const res = await getProfileAPI();
    console.log("data", res);
    dispatch(setUserInfo(res.data));
  };
};

// 获取reducer函数
const userReducer = userStore.reducer;

export default userReducer;
export { fetchLogin, fetchUserInfo, clearUserInfo };
