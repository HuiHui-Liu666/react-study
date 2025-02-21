import * as Y from "yjs";
import { useEffect, useState, useRef, useMemo } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";

// 创建 yjs 文档，用于共享状态
const ydoc = new Y.Doc();
// 有了 provider 之后，可以在 他的基础上指定分层：1用户信息 光标 房间信息等 2 数据层同步
//awareness 分两部分：1本地化的状态 2远程状态
const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "test-yjs-docs",
  ydoc
); //（ws地址，文档id，ydoc实例）

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

// 防抖函数， 用于优化输入同步
const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export function CollaborativeDoc() {
  const [text, setText] = useState("");
  const yTextRef = useRef(null);

  const [currentUser, setCurrentUser] = useState({
    name: "",
    color: "",
    userIcon: "",
  });
  //
  const [remoteUsers, setRemoteUsers] = useState(new Map());
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

    // 监听用户状态变更，获取在线用户列表和光标的位置
    provider.awareness.on("change", () => {
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
      setRemoteUsers(users);
      setRemoteCursors(cursors);
    });

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
      provider.disconnect();
    };
  }, []);

  useEffect(() => {
    // 监听鼠标移动事件，实时同步光标位置
    const updateCursor = (e) => {
      // 设置光标位置
      provider.awareness.setLocalStateField("cursor", {
        x: e.clientX,
        y: e.clientY,
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
      // 鼠标移动的时候 就要同步 provider中的鼠标位置
      document.addEventListener("mousemove", updateCursor);
      return () => {
        document.removeEventListener("mousemove", updateCursor);
      };
    };
  }, []);

  const debounceHandleChange = useMemo(
    () =>
      debounce((event) => {
        const newText = event.target.value;
        const cursorIndex = event.target.selectionStart ?? 0;
        if (yTextRef.current) {
          yTextRef.current.delete(0, yTextRef.current.length);
          yTextRef.current.insert(cursorIndex, newText);
        }
      }, 1000),
    []
  );

  // 处理文本框输入
  const handleChange = (event) => {
    console.log("value:", event.target.value);
    debounceHandleChange(event);
    setText(event.target.value);
  };

  const getCurrentCursorPosition = (value) => {
    if (!value) return;
    const { x, y, windowSize } = value;
    const cursorX = (x / windowSize.width) * window.innerWidth;
    const cursorY = (y / windowSize.height) * window.innerHeight;
    return { cursorX, cursorY };
  };

  return (
    <div className="collaborative-doc">
      <div>
        <h3>
          当前用户：
          <span style={{ color: currentUser.color }}>{currentUser.name}</span>
        </h3>
        <div>
          其他在线用户：
          {Array.from(remoteUsers).map(([key, user]) => {
            <div key={key} style={{ color: user.color }}>
              <img
                src={user.userIcon}
                alt={user.name}
                style={{ width: "30", height: "30", borderRadius: "50%" }}
              ></img>
              {user.userName}
            </div>;
          })}
        </div>
        <textarea rows={30} onChange={handleChange} value={text}></textarea>

        <div>
          {remoteCursors &&
            Array.from(remoteCursors).map(([key, cursor]) => {
              const pos = getCurrentCursorPosition(cursor);
              return (
                <div
                  key={key}
                  style={{
                    position: "absolute",
                    width: "36px",
                    height: "36px",
                    left: pos?.cursorX + "px",
                    top: pos?.cursorY + "px",
                    backgroundColor: remoteCursors.get(key)?.color,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    backgroundImage: `url(${remoteCursors.get(key)?.userIcon})`,
                    backgroundSize: "cover",
                  }}
                ></div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
