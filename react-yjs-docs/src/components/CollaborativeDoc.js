import * as Y from "yjs";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
const ydoc = new Y.Doc();
const ytext = ydoc.getText("my text type");
// 虽然是insert操作，但是通过format操作op之后，会把整个op分解，分解成插入一个a，再插入一个bc
// ytext.insert(0, "abc");
// ytext.format(1, 2, { bold: true }); // 处理中间的数据
// ytext.toString(); //'abc
// ytext.delete(0, 1); // delete one element
// ytext.insert(0, "liu hui");
// // 先插入a 再插入bc，再删除a，再插入liu hui，打印出来的 delta 是整合之后的 将最后的 liu hui 提前到了第一个位置
// console.log("delta:", ytext.toDelta());

export function CollaborativeDoc() {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    ytext.insert(0, e.target.value);
    console.log("delta:", ytext.toString());
    setValue(e.target.value);
  };

  // 本地存储 接入index DB
  useEffect(() => {
    const persistance = new IndexeddbPersistence("yjs-docs", ydoc);
    persistance.whenSynced.then(() => {
      console.log("Synced with IndexedDB");
      setValue(ytext.toString());
    });
  }, []);

  return (
    <div className="collaborative-doc">
      <textarea rows={30} onChange={handleChange} value={value}></textarea>
    </div>
  );
}
