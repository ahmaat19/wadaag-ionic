import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  name: string
  avatar: string
  userType: string
  mobile: number
  points: number
  expiration: number
  level: number
  isAuth: boolean
  _id: string
}

const initialState: UserState = {
  name: 'John Doe',
  avatar: 'https://github.com/johndoe.png',
  userType: 'Driver',
  mobile: 123456789,
  points: 0,
  expiration: 0,
  level: 0,
  isAuth: false,
  _id: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id
      state.name = action.payload.name
      state.avatar = action.payload.avatar
      state.userType = action.payload.userType
      state.mobile = action.payload.mobile
      state.points = action.payload.points
      state.expiration = action.payload.expiration
      state.level = action.payload.level
      state.isAuth = true
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
