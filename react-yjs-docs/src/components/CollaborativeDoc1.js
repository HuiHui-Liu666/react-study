import * as Y from "yjs";
import { useEffect, useState, useRef, useMemo } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";

// 创建 yjs 文档，用于共享状态
const ydoc = new Y.Doc();
const ytext = ydoc.getText("my text type");

// 有了 provider 之后，可以在 他的基础上指定分层：1用户信息 光标 房间信息等 2 数据层同步
//awareness 分两部分：1本地化的状态 2远程状态
const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "test-yjs-docs",
  ydoc
); //（ws地址，文档id，ydoc实例）
provider.on("status", (events) => {
  console.log("status:", events.status); //logs "connected" or "disconnected"
});
// provider准备好之后，就可以在他的基础上 指定分层：用户信息 光标 房间信息等
// provider.awareness 分为远程信息和本地信息

// 生成随机用户名称 和 颜色，用于区分不同协作用户
const randomName = () => {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Hannah",
    "Ivy",
    "Jack",
  ];
  return (
    names[Math.floor(Math.random() * names.length)] +
    Math.floor(Math.random() * 1000)
  );
};
const randomColor = "#" + Math.random().toString(16).substring(2, 8);
const userName = randomName();

provider.awareness.setLocalStateField("user", {
  name: userName,
  color: randomColor,
  userIcon: `https://robohash.org/${userName}?set=set1&size=100x100`,
});

export function CollaborativeDoc() {
  const [text, setText] = useState("");
  const yTextRef = useRef(null);

  const [currentUser, setCurrentUser] = useState({
    name: "",
    color: "",
    userIcon: "",
  });
  //
  const [remoteCursors, setRemoteCursors] = useState(new Map());
  const persistenceRef = useRef(null);

  //[]空的话，不依赖任何外部变量，所以只在 mounted的时候执行一次。
  useEffect(() => {
    // 初始化共享文本对象，用于多用户实时编辑
    const yText = ydoc.getText("shared-text");
    yTextRef.current = yText;

    // 使用 IndexedDB 存储数据，实现持久化
    persistenceRef.current = new IndexeddbPersistence("yjs-docs", ydoc);
    setCurrentUser(provider.awareness.getLocalState()?.user);

    console.log("todo");

    // 初载入时从本地数据库同步数据
    persistenceRef.current?.whenSynced.then(() => {
      setText(yText.toString());
      console.log("初载入时从本地数据库同步数据", yText.toString(), text);
    });

    // 监听 yText 的变化，更新文本内容
    const updateHandler = () => {
      setText(yTextRef.current?.toString() || "");
    };
    ydoc.on("update", updateHandler);

    // 解绑事件 和 清理 资源
    return () => {
      ydoc.off("update", updateHandler);
      // provider.disconnect(); // 这个方法 不能同步更新了【重点】
    };
  }, []);

  useEffect(() => {
    return () => {
      console.log("hi");
    };
  }, []);
  // 监听用户状态变更，获取在线用户列表和光标的位置
  provider.awareness.on("change", (updates) => {
    console.log("监听用户状态变更 change:");
    const status = provider.awareness.getStates();
    const users = new Map();
    const cursors = new Map();

    for (const [key, value] of status) {
      // provider.awareness.clientID 当前用户id？
      if (key !== provider.awareness.clientID) {
        users.set(key, value.user);
        cursors.set(key, value.cursor);
      }
    }
    setRemoteCursors(cursors);
  });
  /**
   * yjs本地化处理：
   * 1. ytext = ydoc.getText('');
   * 2. 在文本域onchange的时候：ytext.insert(0,content)
   * 3. 在mounted的时候初始化本地存储IndexeddbPersistence和ydoc关联起来
   * 4. 在 persistance.whenSynced.then 中 赋值 ytext 给 文本域。
   */

  /**
   *
   *
   */

  // 处理文本框输入11111111111
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    // 直接插入的话 可能会造成 [刷新之后]不能同步更新：暴力做法：先删除 再插入。
    // ytext.insert(event.target.selectionStart, event.target.value);
    ytext.delete(0, ytext.length);
    ytext.insert(0, event.target.value);
    console.log(ytext.toString());
    // 同步到文本域
    setValue(event.target.value);
  };
  //  1111 初始化index饿到DB
  useEffect(() => {
    const persistance = new IndexeddbPersistence("liu", ydoc);
    persistance.whenSynced.then(() => {
      console.log("初始化index饿到DB 同步结果拿到 赋值到textaera中");
      setValue(ytext.toString());
    });
  }, []);

  useEffect(() => {
    // 监听到变化的时候，就把内容追加进去
    ydoc.on("update", () => {
      setValue(ytext.toString());
      // todo:
      // return ()=>{}
    });
  }, []);

  return (
    <div className="collaborative-doc">
      <div>
        <h3>
          当前用户：
          <span style={{ color: currentUser.color }}>{currentUser.name}</span>
        </h3>
        <textarea rows={30} onChange={handleChange} value={value}></textarea>
      </div>
    </div>
  );
}
