import { NavBar, DatePicker } from "antd-mobile";
import "./index.scss";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import _ from "lodash";

import DailyBill from "./components/DayBill";

const Month = () => {
  // 控制时间选择器打开关闭
  const [dateVisible, setDateVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    return dayjs().format("YYYY-MM");
  });
  const [currentMonthList, setCurrentMonthList] = useState([]);

  // 拿到redux里面的数据
  const billList = useSelector((state) => state.bill.billList);

  const monthGroup = useMemo(() => {
    // return 计算之后的值，lodash
    return _.groupBy(billList, (item) => dayjs(item.date).format("YYYY-MM"));
  }, [billList]); //后面的是依赖项

  // 获取对应月的数据 进行数据整理
  const monthResult = useMemo(() => {
    // 支出 输入 结余
    const pay = currentMonthList
      .filter((item) => item.type === "pay")
      .reduce((a, b) => a + b.money, 0);

    const income = currentMonthList
      .filter((item) => item.type === "income")
      .reduce((a, b) => a + b.money, 0);

    return {
      pay,
      income,
      total: pay + income,
    };
  }, [currentMonthList]);
  // 时间选择确定之后
  const dateConfirm = (date) => {
    setDateVisible(false);
    const month = dayjs(date).format("YYYY-MM");
    setCurrentMonth(month);
    setCurrentMonthList(monthGroup[month] || []);
  };
  useEffect(() => {
    setCurrentMonthList(monthGroup[currentMonth] || []);
  }, [monthGroup]);
  const close = () => {
    setDateVisible(false);
  };
  // 当月的数据 按照日分组
  const dayGroup = useMemo(() => {
    // return 计算之后的值，lodash
    const groupData = _.groupBy(currentMonthList, (item) =>
      dayjs(item.date).format("YYYY-MM-DD")
    );
    const keys = Object.keys(groupData);
    return {
      groupData,
      keys,
    };
  }, [currentMonthList]); //后面的是依赖项

  //
  return (
    <div className="monthlyBill">
      <NavBar className="nav" backArrow={false}>
        月度收支
      </NavBar>
      <div className="content">
        <div className="header">
          {/* 时间切换区域 */}
          <div className="date" onClick={() => setDateVisible(!dateVisible)}>
            <span className="text">{currentMonth}月账单</span>
            <span
              className={classNames("arrow", dateVisible && "expand")}
            ></span>
          </div>
          {/* 统计区域 */}
          <div className="twoLineOverview">
            <div className="item">
              <span className="money">{monthResult.pay.toFixed(2)}</span>
              <span className="type">支出</span>
            </div>
            <div className="item">
              <span className="money">{monthResult.income.toFixed(2)}</span>
              <span className="type">收入</span>
            </div>
            <div className="item">
              <span className="money">{monthResult.total.toFixed(2)}</span>
              <span className="type">结余</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className="kaDate"
            title="记账日期"
            precision="month"
            onConfirm={(date) => dateConfirm(date)}
            onClose={() => setDateVisible(false)}
            visible={dateVisible}
            max={new Date()}
          />
        </div>
        {/* 按日分组账单:整理好数据之后遍历 */}
        {dayGroup.keys.map((key) => {
          return (
            <DailyBill
              key={key}
              date={key}
              billList={dayGroup.groupData[key]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Month;
