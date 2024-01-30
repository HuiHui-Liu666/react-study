// 封装和token相关的方法
const TOKENKET = "token_key";

function setToken(token) {
  localStorage.setItem(TOKENKET, token);
}
function getToken() {
  return localStorage.getItem(TOKENKET);
}
function removeToken() {
  localStorage.removeItem(TOKENKET);
}

export { setToken, getToken, removeToken };
