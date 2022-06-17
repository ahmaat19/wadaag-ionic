import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),

  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
