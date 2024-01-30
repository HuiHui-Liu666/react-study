
import  { ChannelItem, fetchChannelAPI} from '@/apis/list'
import { useEffect, useState } from 'react'
const useTabs = ()=>{
    const [channels,setChannels] = useState<ChannelItem[]>([])

    useEffect(()=>{
      const getChannels = async ()=>{
        const res = await fetchChannelAPI() 
        setChannels(res.data.data.channels)
      }
      getChannels()
    },[])

    return {channels}
}

export {useTabs}