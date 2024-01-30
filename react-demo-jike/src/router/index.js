import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
// import Home from "../pages/Home";
// import Article from "../pages/Article";
// import Publish from "../pages/Publish";
import { AuthRoute } from "../components/AuthRoute/AuthRoute";
import { Suspense, lazy } from "react";

// 1、路由懒加载动态导入；
const Home = lazy(() => import("../pages/Home"));
const Article = lazy(() => import("../pages/Article"));
const Publish = lazy(() => import("../pages/Publish"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <Layout></Layout>{" "}
      </AuthRoute>
    ),
    children: [
      {
        path: "",
        index: true,
        element: (
          <Suspense fallback={"加载中..."}>
            <Home></Home>
          </Suspense>
        ),
      },
      {
        path: "article",
        element: (
          <Suspense fallback={"加载中..."}>
            <Article></Article>
          </Suspense>
        ),
      },
      {
        path: "publish",
        element: (
          <Suspense fallback={"加载中..."}>
            <Publish></Publish>
          </Suspense>
        ),
      },
    ],
  },
  { path: "/login", element: <Login></Login> },
]);

export default router;
