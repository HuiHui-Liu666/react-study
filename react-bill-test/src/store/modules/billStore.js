// 账单列表相关store
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const billStore = createSlice({
    name:'bill',
    // 数据状态state
    initialState:{
        billList:[]
    },
    // 同步修改的方法
    reducers:{
        setBillList(state,action){
            state.billList = action.payload
        }
    }
})

// 结构actionCreater 函数
const {setBillList} = billStore.actions

// 编写异步
const getBillList = () => {
    // 需要return 一个函数
    return async (dispatch) => {
        // 编写异步请求
        const res = await axios.get('http://localhost:8888/ka')
        // 触发同步reducer
        dispatch(setBillList(res.data))
    }
}

// 导出reducer [没有s]
const reducer = billStore.reducer 

export default reducer;
export {getBillList};