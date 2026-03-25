// configureStore 和 createSlice 都是 Redux Toolkit（RTK）里提供的简化 Redux 编程体验的 API。
// - createSlice 用于生成 reducer、action creators，并自动组织好 action type，极大减少样板代码。
// - configureStore 是新的 store 创建方法，内置了 redux-thunk 中间件和开发者工具（devTools），比老的 createStore 更推荐。
// 与传统的 createStore 区别：createStore 原生只创建 store，需手动组合 reducer、添加中间件等。而 configureStore 是“包含最佳实践配置”的一体化方案。
// 现在用 configureStore 配合 createSlice 是编写 Redux 应用的主流方式。
import { configureStore, createSlice } from '@reduxjs/toolkit'

// 基础 state：输入 n 和计算结果 sum
export type CalcState = {
  n: number
  sum: number
}

const initialState: CalcState = { n: 0, sum: 10 }

const calcSlice = createSlice({
  name: 'calc',
  initialState,
  reducers: {
    setN(state, action) {
      const n = action.payload as number
      state.n = n
      state.sum = 10 + n
    },
  },
})

export const { setN } = calcSlice.actions

// 使用 configureStore（更推荐的 Redux 入口写法）
export const store = configureStore({
  reducer: calcSlice.reducer,
})

// 由于我们 reducer 直接返回该 slice 的 state，所以 RootState 等于 CalcState
export type RootState = CalcState

