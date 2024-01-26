import classNames from "classnames";
import "./index.scss";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
// billTypeToName :通过英文找到对应的英文
import { billTypeToName } from "@/contants";
const DailyBill = ({ date, billList }) => {
  //   console.log(props);
  const [visible, setVisible] = useState(false);
  // 获取对应月的数据 进行数据整理
  const dayResult = useMemo(() => {
    // 支出 输入 结余
    const pay = billList
      .filter((item) => item.type === "pay")
      .reduce((a, b) => a + b.money, 0);

    const income = billList
      .filter((item) => item.type === "income")
      .reduce((a, b) => a + b.money, 0);

    return {
      pay,
      income,
      total: pay + income,
    };
  }, [billList]);
  return (
    <div className={classNames("dailyBill")}>
      <div className="header">
        <div className="dateIcon">
          <span className="date">{date}</span>
          <span
            className={classNames("arrow", visible && "expand")}
            onClick={() => setVisible(!visible)}
          ></span>
        </div>
        <div className="oneLineOverview">
          <div className="pay">
            <span className="type">支出</span>
            <span className="money">{dayResult.pay.toFixed(2)}</span>
          </div>
          <div className="income">
            <span className="type">收入</span>
            <span className="money">{dayResult.income.toFixed(2)}</span>
          </div>
          <div className="balance">
            <span className="money">{dayResult.total.toFixed(2)}</span>
            <span className="type">结余</span>
          </div>
        </div>
      </div>
      {/* 单日列表 */}
      <div className="billList" style={{ display: visible ? "" : "none" }}>
        {billList.map((item) => {
          return (
            <div className="bill" key={item.id}>
              <Icon type={item.useFor} />
              <div className="detail">
                <div className="billType">{billTypeToName[item.useFor]}</div>
              </div>
              <div className={classNames("money", item.type)}>
                {item.money.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DailyBill;
