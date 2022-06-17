import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import requestReducer from './requestSlice'
import acceptReducer from './acceptSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    request: requestReducer,
    accept: acceptReducer,
    chat: chatReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
