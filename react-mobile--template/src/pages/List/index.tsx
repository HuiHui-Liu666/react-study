import { Tabs } from 'antd-mobile'
import './style.css'
import ListItem from './ListItem'
// import  { ChannelItem, fetchChannelAPI} from '@/apis/list'
// import { useEffect, useState } from 'react'
import { useTabs } from './useTabs'
const List = () => {
  const {channels} = useTabs()
  
  return (
    <div className="tabContainer">
       <Tabs defaultActiveKey="0">
        {channels.map(item=>(
          <Tabs.Tab title={item.name} key={item.id}>
            <div className="listContainer">
                {/* HomeList列表 */}
                <ListItem channelId={''+item.id}/>
            </div>
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  )
}

export default List