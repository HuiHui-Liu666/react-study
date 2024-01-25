import { Outlet,useNavigate } from "react-router-dom";
import { Button } from "antd-mobile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {getBillList} from '@/store/modules/billStore'

import './index.scss'
import { Badge, TabBar } from 'antd-mobile'
import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
  } from 'antd-mobile-icons'

  
const Layout = ()=>{
    const dispatch = useDispatch();
    // 组件上来的时候出发一次
    useEffect(()=>{
        dispatch(getBillList())
    },[dispatch])

    // 设置tabbar
    const tabs = [
        {
          key: '/month',
          title: '月度账单',
          icon: <AppOutline />,
          badge: Badge.dot,
        },
        {
          key: '/new',
          title: '记账',
          icon: <UnorderedListOutline />,
          badge: '5',
        },
        {
          key: '/year',
          title: '年度账单',
          icon: <UserOutline />,
        },
      ]
      const navigate = useNavigate()
      const setRouteActive = (path) => {
        // history.push(value)
        navigate(path)
        console.log(path)
      }
    
    return (
        <div className="layout">
            <div className="container">
                <Outlet></Outlet>
            </div>
            <div className="footer">
                <TabBar onChange={value => setRouteActive(value)}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
        </div>)
}

export default Layout;