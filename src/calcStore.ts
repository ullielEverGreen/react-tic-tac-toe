import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const calcSlice = createSlice({
  name: 'calc',
  initialState: { n: 0, sum: 10 },
  reducers: {
    setN: (state, action: PayloadAction<number>) => {
      state.n = action.payload
      state.sum = 10 + action.payload
    },
  },
})

export const { setN } = calcSlice.actions

export const store = configureStore({
  reducer: calcSlice.reducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

