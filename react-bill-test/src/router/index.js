import Layout from "@/pages/Layout";    
import New from "@/pages/New";
import Month from "@/pages/Month";
import Year from "@/pages/Year";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path:'/',
        element:<Layout/>,
        children:[
            {
                path:'',
                index:true, //感觉不要这个也可以设置默认的二级路由
                element:<Month/>
            },
            {
                path:'year',
                element:<Year/>
            }
        ]
    },
    {
        path:'/new',
        element:<New/>,
    },
])

export default router;