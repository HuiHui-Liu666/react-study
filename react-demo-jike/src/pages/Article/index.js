import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
} from "antd";
// 汉化包
import locale from "antd/es/date-picker/locale/zh_CN";
import dayjs from "dayjs";

// 导入资源
import { Table, Tag, Space, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import img404 from "../../assets/error.png";
import { useChannel } from "../../hooks/useChannel";
import { getArticleListAPI, delArticleAPI } from "../../apis/article";
import { useEffect, useState } from "react";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  const { channelList } = useChannel();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const [reqDate, setReqDate] = useState({
    status: "",
    channel_id: "",
    begin_pubdate: "",
    end_pubdate: "",
    page: 1,
    per_page: 2,
  });

  useEffect(() => {
    // 获取文章列表
    getArticleListAPI(reqDate).then((res) => {
      setList(res.data.results);
      setCount(res.data.total_count);
    });
  }, [reqDate]);

  const onConfirm = async (e) => {
    console.log(e);
    await delArticleAPI(e.id);
    message.success("删除成功！");
    setReqDate({
      ...reqDate,
    });
  };
  // 准备列数据
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      // 1待审核  2审核通过
      render: (data) =>
        data === 1 ? (
          <Tag color="warning">待审核</Tag>
        ) : (
          <Tag color="success">审核通过</Tag>
        ),
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/publish?id=${data.id}`)}
            />
            <Popconfirm
              title="删除文章"
              description="确定删除当前文章？"
              onConfirm={() => onConfirm(data)}
              okText="删除"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 筛选文章列表
  const onFinish = async (formValue) => {
    // 1. 准备参数
    setReqDate({
      ...reqDate,
      channel_id: formValue.channel_id,
      status: formValue.status,
      begin_pubdate: formValue.date[0].format("YYYY-MM-DD"),
      end_pubdate: formValue.date[1].format("YYYY-MM-DD"),
    });
  };

  const onChange = (page) => {
    setReqDate({
      ...reqDate,
      page,
    });
  };
  return (
    <div>
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: "文章列表" },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: "" }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={""}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 120 }}>
              {channelList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker
              initialValues={[dayjs(), dayjs()]}
              locale={locale}
            ></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{
            total: count,
            pageSize: reqDate.per_page,
            onChange: onChange,
          }}
        />
      </Card>
    </div>
  );
};

export default Article;
