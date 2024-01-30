import { Image, List,InfiniteScroll } from 'antd-mobile'
// mock数据
// import { users } from './users'
import { ListRes, fetchListAPI } from '@/apis/list'
// import  { ChannelItem, fetchChannelAPI} from '@/apis/list'
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
type Props = {
    channelId: string
  }
const HomeList = (props: Props) => {
    // 标记当前是否还有现=新数据
    const [hasMore, setHasMore] = useState(true)
    const navigate = useNavigate()
    const loadMore = async () => {
        try {
          const res = await fetchListAPI({
            channel_id: channelId,
            timestamp: listRes.pre_timestamp,
          })
          // 没有数据立刻停止
          if (res.data.data.results.length === 0) {
            setHasMore(false)
          }
          setListRes({
            // 拼接新老列表数据
            results: [...listRes.results, ...res.data.data.results],
            // 重置时间参数 为下一次请求做准备
            pre_timestamp: res.data.data.pre_timestamp,
          })
        } catch (error) {
          throw new Error('load list error')
        }
      }
    const { channelId } = props
    // list control
    const [listRes, setListRes] = useState<ListRes>({
      results: [],
      pre_timestamp: '' + new Date().getTime(),
    })
    // 初始数据获取
    useEffect(() => {
      async function getList() {
        try {
          const res = await fetchListAPI({
            channel_id: '0',
            timestamp: '' + new Date().getTime(),
          })
          setListRes(res.data.data)
          console.log('----',res.data.data)
        } catch (error) {
          throw new Error('fetch list error')
        }
      }
      getList()
    }, [channelId])
    
    const navigateToDetail = (id: string) => {
        navigate(`/detail?id=${id}`)
      }
  return (
    <>
      <List>
        {listRes.results.map((item) => (
          <List.Item
            key={item.art_id}
            onClick={() => navigateToDetail(item.art_id)}
            prefix={
              <Image
                src={item.cover.images?.[0]}
                style={{ borderRadius: 20 }}
                fit="cover"
                width={40}
                height={40}
              />
            }
            description={item.pubdate}
            >
            {item.title}
          </List.Item>
        ))}
      </List>
      {/* 加载更多 */}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={20}/>
    </>
  )
}

export default HomeList