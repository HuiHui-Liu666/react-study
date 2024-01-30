import { useEffect, useState } from "react";
import { getChannelAPI } from "../apis/article";

function useChannel() {
  const [channelList, setChannelList] = useState([]);
  useEffect(() => {
    const getChannelList = async () => {
      // 发送请求获取频道列表
      const res = await getChannelAPI();
      // set之后不会立马 看到效果。
      setChannelList(res.data.channels);
    };
    getChannelList();
  }, []);
  return { channelList };
}

export { useChannel };
