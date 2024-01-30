import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Article from "../pages/Article";
import Publish from "../pages/Publish";
import { AuthRoute } from "../components/AuthRoute/AuthRoute";
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
        element: <Home></Home>,
      },
      {
        path: "article",
        element: <Article></Article>,
      },
      {
        path: "publish",
        element: <Publish></Publish>,
      },
    ],
  },
  { path: "/login", element: <Login></Login> },
]);

export default router;
