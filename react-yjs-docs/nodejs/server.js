// ws nodejs中实现的 WebSocket 协议【全双工通信协议】：可以创建websocket服务器 和 客户端。
const WebSocket = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const port = 1234;

const wss = new WebSocket.Server({ port });

// 有新客户端连接时，事件被触发
wss.on("connection", (ws) => {
  setupWSConnection(ws, wss);
  console.log("有客户端连接了...");
});
console.log(`WebSocket server started on ws://localhost:${port}`);
