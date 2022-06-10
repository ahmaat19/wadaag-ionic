import { Storage } from '@capacitor/storage'
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

      const setAuth = async () => {
        const value = {
          name: state.name,
          avatar: state.avatar,
          userType: state.userType,
          mobile: state.mobile,
          points: state.points,
          expiration: state.expiration,
          level: state.level,
          _id: state._id,
          isAuth: true,
        }
        await Storage.set({
          key: 'auth',
          value: JSON.stringify(value),
        })

        return value
      }
      setAuth()
    },
    authLogout: (state) => {
      setUser(initialState)
      const removeAuth = async () => {
        await Storage.remove({ key: 'auth' })
      }
      removeAuth()
    },
  },
})

export const { setUser, authLogout } = userSlice.actions

export default userSlice.reducer
