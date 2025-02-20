import * as Y from "yjs";

const ydoc = new Y.Doc();
const ytext = ydoc.getText("text");
// 虽然是insert操作，但是通过format操作op之后，会把整个op分解，分解成插入一个a，再插入一个bc
ytext.insert(0, "abc");
ytext.format(1, 2, { bold: true }); // 处理中间的数据
ytext.toString(); //'abc
ytext.delete(0, 1); // delete one element
ytext.insert(0, "liu hui");
// 先插入a 再插入bc，再删除a，再插入liu hui，打印出来的 delta 是整合之后的 将最后的 liu hui 提前到了第一个位置
console.log("delta:", ytext.toDelta());

export function CollaborativeDoc() {
  return (
    <div className="collaborative-doc">
      <h1>Collaborative Document</h1>
      <p>Here you can collaborate with other users in real-time.</p>
      <div className="editor"></div>
    </div>
  );
}
