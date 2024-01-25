import { Outlet } from "react-router-dom";
import { Button } from "antd-mobile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {getBillList} from '@/store/modules/billStore'
const Layout = ()=>{
    const dispatch = useDispatch();
    // 组件上来的时候出发一次
    useEffect(()=>{
        dispatch(getBillList())
    },[dispatch])
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