// 封装高阶组件

import { getToken } from "../../utils";
import { Navigate } from "react-router-dom";

// 在路由配置的时候 用这个包裹即可。
function AuthRoute({ children }) {
  const token = getToken();
  if (token) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export { AuthRoute };
