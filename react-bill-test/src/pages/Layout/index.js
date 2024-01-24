import { Outlet } from "react-router-dom";
import { Button } from "antd-mobile";
const Layout = ()=>{
    return (
        <div>
            <Outlet></Outlet>
            layout
            
        <Button
            color="primary"
            >csss</Button>
            </div>)
}

export default Layout;